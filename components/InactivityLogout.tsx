"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  ACTIVITY_EVENTS,
  INACTIVITY_TIMEOUT_MS,
  inactiveForMs,
  readLastActivity,
  writeLastActivity,
} from "@/lib/session-idle";

export function InactivityLogout() {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, user, isGuest, signOut } = useAuth();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loggingOutRef = useRef(false);
  const lastPersistRef = useRef(0);

  useEffect(() => {
    if (!ready) return;

    const hasSession = Boolean(user) || isGuest;
    const isAuthRoute =
      pathname.startsWith("/login") || pathname.startsWith("/auth");

    if (!hasSession || isAuthRoute) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    function persistActivity() {
      const now = Date.now();
      if (now - lastPersistRef.current < 5000) return;
      lastPersistRef.current = now;
      writeLastActivity(now);
    }

    async function logoutIdle() {
      if (loggingOutRef.current) return;
      loggingOutRef.current = true;
      await signOut();
      router.push("/login");
      router.refresh();
    }

    function scheduleLogout() {
      persistActivity();
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        void logoutIdle();
      }, INACTIVITY_TIMEOUT_MS);
    }

    if (inactiveForMs()) {
      void logoutIdle();
      return;
    }

    if (!readLastActivity()) writeLastActivity();
    scheduleLogout();

    function onActivity() {
      scheduleLogout();
    }

    function onVisibility() {
      if (document.visibilityState !== "visible") return;
      if (inactiveForMs()) {
        void logoutIdle();
        return;
      }
      scheduleLogout();
    }

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, onActivity, { passive: true });
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, onActivity);
      }
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ready, user, isGuest, pathname, signOut, router]);

  return null;
}
