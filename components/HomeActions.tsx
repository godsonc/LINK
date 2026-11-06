"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { loadSession } from "@/lib/store";

export function HomeActions() {
  const { ready, user, isGuest } = useAuth();
  const [hasPathway, setHasPathway] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const session = loadSession();
    setHasPathway(session.pathway.length > 0);
    setSessionReady(true);
  }, []);

  const signedIn = Boolean(user) || isGuest;

  if (!ready || !sessionReady) {
    return <div className="mt-8 min-h-target" aria-hidden />;
  }

  if (!signedIn && !hasPathway) {
    return (
      <Link
        href="/login"
        className="mt-8 flex min-h-target w-full items-center justify-center rounded-full bg-brand px-6 font-medium text-paper"
      >
        Get started
      </Link>
    );
  }

  if (!signedIn && hasPathway) {
    return (
      <>
        <Link
          href="/login/sign-up"
          className="mt-8 flex min-h-target w-full items-center justify-center rounded-full bg-brand px-6 font-medium text-paper"
        >
          Create account
        </Link>
        <Link
          href="/login/sign-in"
          className="mt-3 flex min-h-target w-full items-center justify-center rounded-full border border-line/30 px-6 font-medium"
        >
          Sign in
        </Link>
        <Link
          href="/login/guest"
          className="mt-3 min-h-target px-4 py-3 text-sm font-medium text-brand"
        >
          Continue as guest
        </Link>
      </>
    );
  }

  if (hasPathway) {
    return (
      <>
        <Link
          href="/pathway"
          className="mt-8 flex min-h-target w-full items-center justify-center rounded-full bg-brand px-6 font-medium text-paper"
        >
          Continue your pathway
        </Link>
        <Link
          href="/who"
          className="mt-4 min-h-target px-4 py-3 text-sm font-medium text-brand"
        >
          Start again
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        href="/who"
        className="mt-8 flex min-h-target w-full items-center justify-center rounded-full bg-brand px-6 font-medium text-paper"
      >
        Get started
      </Link>
      <Link
        href="/login/sign-in"
        className="mt-5 min-h-target px-4 py-3 font-medium text-muted"
      >
        I already have an account
      </Link>
      <Link
        href="/login/guest"
        className="min-h-target px-4 py-3 text-sm font-medium text-brand"
      >
        Continue as guest
      </Link>
    </>
  );
}
