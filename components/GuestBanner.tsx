"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function GuestBanner({ className = "" }: { className?: string }) {
  const { ready, user, isGuest } = useAuth();
  if (!ready || user || !isGuest) return null;

  return (
    <aside
      className={`rounded-card border border-brand/20 bg-brand/10 p-4 text-sm ${className}`}
    >
      <p className="font-medium">You’re browsing as a guest</p>
      <p className="mt-1 text-muted">
        Your pathway and bookings stay on this device. Create a free account to
        save your name and pick up on another device.
      </p>
      <Link
        href="/login/sign-up"
        className="mt-3 inline-flex min-h-11 items-center rounded-full bg-brand px-4 text-sm font-semibold text-paper"
      >
        Create account
      </Link>
    </aside>
  );
}
