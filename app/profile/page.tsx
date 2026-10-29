"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const LINKS = [
  { href: "/settings", label: "Settings" },
  { href: "/saved", label: "Saved items" },
  { href: "/feedback", label: "Feedback" },
  { href: "/bookings", label: "Appointments" },
  { href: "/privacy", label: "Privacy" },
  { href: "/admin", label: "Navigator board" },
];

export default function ProfilePage() {
  const { ready, user } = useAuth();
  const name = user?.fullName?.trim() || "Your profile";
  const letter = (user?.fullName || user?.email || "?").charAt(0).toUpperCase();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-2xl font-semibold text-paper">
          {user ? letter : "?"}
        </span>
        <div>
          <h2 className="text-2xl font-semibold">
            {ready && user ? name : "Guest"}
          </h2>
          <p className="text-sm text-muted">
            {user?.email ?? "You can use LINK without an account."}
          </p>
        </div>
      </div>
      <ul className="overflow-hidden rounded-card bg-paper shadow-card">
        {LINKS.map((item) => (
          <li key={item.href} className="border-b border-line/10 last:border-b-0">
            <Link href={item.href} className="flex min-h-target items-center px-4 font-medium">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      {ready && !user ? (
        <Link
          href="/login"
          className="inline-flex min-h-target items-center rounded-full bg-brand px-5 font-semibold text-paper"
        >
          Sign in
        </Link>
      ) : null}
    </div>
  );
}
