"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const { ready, user } = useAuth();
  const name = user?.fullName?.trim() || "Your profile";
  const letter = name.charAt(0).toUpperCase();

  return (
    <article className="mx-auto max-w-3xl rounded-3xl bg-paper p-8 shadow-card">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-2xl font-semibold text-paper">
          {user ? letter : "?"}
        </span>
        <div>
          <h1 className="text-4xl font-semibold">{ready ? name : "Profile"}</h1>
          <p className="mt-1 text-muted">{user?.email ?? "Sign in to see your account."}</p>
        </div>
      </div>
      {ready && !user ? (
        <p className="mt-6">
          <Link href="/login" className="font-medium text-muted underline">
            Sign in
          </Link>
        </p>
      ) : null}
    </article>
  );
}
