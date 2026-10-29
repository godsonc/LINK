"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";

function initial(fullName: string | null, email: string | null) {
  const source = fullName?.trim() || email?.trim() || "";
  return source ? source.charAt(0).toUpperCase() : "?";
}

export function UserMenu() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const letter = initial(user?.fullName ?? null, user?.email ?? null);
  const label = user?.fullName?.trim() || user?.email || "Account";

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  async function handleLogout() {
    setOpen(false);
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-pine text-lg font-semibold text-sand"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${label} account menu`}
        onClick={() => setOpen((value) => !value)}
      >
        {letter}
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-2xl border border-pine/10 bg-paper py-1 shadow-card"
        >
          <p className="truncate px-4 py-2 text-sm text-pine">{label}</p>
          <Link
            role="menuitem"
            href="/profile"
            className="block px-4 py-2.5 text-sm font-medium hover:bg-sand"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <Link
            role="menuitem"
            href="/settings"
            className="block px-4 py-2.5 text-sm font-medium hover:bg-sand"
            onClick={() => setOpen(false)}
          >
            Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            className="block w-full px-4 py-2.5 text-left text-sm font-medium text-red-700 hover:bg-sand"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
