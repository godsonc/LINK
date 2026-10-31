"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readGuestFlag } from "@/lib/guest";
import { loadSession } from "@/lib/store";

export function HomeActions() {
  const [hasPathway, setHasPathway] = useState(false);
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    const session = loadSession();
    setHasPathway(session.pathway.length > 0);
    setGuest(readGuestFlag());
  }, []);

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
        <Link
          href="/login/sign-in"
          className="mt-2 min-h-target px-4 py-3 font-medium text-muted"
        >
          I already have an account
        </Link>
        {!guest ? (
          <Link
            href="/login/guest"
            className="min-h-target px-4 py-3 text-sm font-medium text-brand"
          >
            Continue as guest
          </Link>
        ) : null}
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
