"use client";

import { useEffect, useState } from "react";
import { consumeProfileFlash } from "@/lib/profile-flash";

export function ProfileFlashToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const flash = consumeProfileFlash();
    if (!flash) return;
    setMessage(flash);
    const timer = window.setTimeout(() => setMessage(null), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!message) return null;

  return (
    <p
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-md rounded-full bg-ink px-4 py-3 text-center text-sm font-medium text-paper shadow-card"
    >
      {message}
    </p>
  );
}
