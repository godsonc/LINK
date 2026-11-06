"use client";

import { useEffect, useState } from "react";
import { consumeProfileFlash } from "@/lib/profile-flash";

const DISPLAY_MS = 2000;
const TRANSITION_MS = 280;

export function ProfileFlashToast() {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const flash = consumeProfileFlash();
    if (!flash) return;
    setMessage(flash);
  }, []);

  useEffect(() => {
    if (!message) return;

    const showRaf = requestAnimationFrame(() => {
      setVisible(true);
    });

    let removeAfterExit: number | undefined;
    const hideTimer = window.setTimeout(() => {
      setVisible(false);
      removeAfterExit = window.setTimeout(() => {
        setMessage(null);
      }, TRANSITION_MS);
    }, DISPLAY_MS);

    return () => {
      cancelAnimationFrame(showRaf);
      window.clearTimeout(hideTimer);
      if (removeAfterExit) window.clearTimeout(removeAfterExit);
    };
  }, [message]);

  if (!message) return null;

  return (
    <p
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-4 top-20 z-[60] mx-auto max-w-md rounded-full bg-ink px-4 py-3 text-center text-sm font-medium text-paper shadow-card transition-[opacity,transform] duration-300 ease-out sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:px-6 lg:top-4 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
      }`}
    >
      {message}
    </p>
  );
}
