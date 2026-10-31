"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { GuestBanner } from "@/components/GuestBanner";
import { useAppointments } from "@/components/useAppointments";
import { useMessages } from "@/components/useMessages";
import { useProfile } from "@/components/useProfile";
import { useAuth } from "@/lib/auth-context";
import { buildActivityFeed } from "@/lib/activity-feed";
import { createClient } from "@/lib/supabase/client";
import { useLink } from "@/lib/link-context";

const SECTIONS = [
  {
    href: "/profile/edit",
    title: "Personal information",
    detail: "Name, contact details, address",
  },
  {
    href: "/profile/preferences",
    title: "Preferences",
    detail: "Communication, language, access needs",
  },
  {
    href: "/profile/activity",
    title: "Activity",
    detail: "Bookings, messages, saved opportunities",
  },
  {
    href: "/profile/documents",
    title: "Documents",
    detail: "Files you choose to keep on this device",
  },
  {
    href: "/profile/security",
    title: "Account & security",
    detail: "Password, sign-in, data on this device",
  },
  {
    href: "/profile/privacy",
    title: "Privacy & consent",
    detail: "Your data, permissions, consent",
  },
  {
    href: "/profile/help",
    title: "Help & support",
    detail: "Questions and a person to contact",
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { ready: authReady, user, isGuest, clearGuest, signOut } = useAuth();
  const profile = useProfile();
  const { ready: bookingsReady, items } = useAppointments();
  const { ready: messagesReady, items: messages } = useMessages();
  const { ready: linkReady, session } = useLink();
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const seeded = useRef(false);
  const ready =
    authReady && profile.ready && bookingsReady && messagesReady && linkReady;

  useEffect(() => {
    if (!user || !profile.ready || seeded.current) return;
    if (!profile.details.fullName && !profile.details.email) {
      profile.saveDetails({
        ...profile.details,
        fullName: user.fullName || "",
        email: user.email || "",
      });
      seeded.current = true;
    }
  }, [user, profile.ready, profile.details, profile.saveDetails]);

  useEffect(() => {
    if (!user) {
      setEmailVerified(false);
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmailVerified(Boolean(data.user?.email_confirmed_at));
    });
    supabase
      .from("profiles")
      .select("created_at")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.created_at) setMemberSince(data.created_at);
      });
  }, [user]);

  const activity = useMemo(
    () =>
      buildActivityFeed({
        bookings: items,
        documents: profile.documents,
      }),
    [items, profile.documents],
  );

  if (!ready) {
    return (
      <p className="text-muted" aria-busy="true">
        Loading your profile…
      </p>
    );
  }

  if (profile.error) {
    return (
      <div className="space-y-4 rounded-card bg-paper p-5 shadow-card">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-muted">We couldn’t load your profile on this device.</p>
        <button
          type="button"
          className="min-h-target w-full rounded-full bg-brand px-4 font-semibold text-paper"
          onClick={profile.reload}
        >
          Try again
        </button>
      </div>
    );
  }

  const guestOnly = isGuest && !user;
  const name =
    profile.details.fullName.trim() ||
    user?.fullName?.trim() ||
    (guestOnly ? "Guest" : "Your profile");
  const email = profile.details.email.trim() || user?.email || "";
  const phone = profile.details.phone.trim();
  const location =
    profile.details.address.trim() ||
    session.answers.postcode?.trim() ||
    "";
  const letter = name.charAt(0).toUpperCase();
  const bookings = items.filter((item) => item.status !== "cancelled").length;
  const saved = session.pathway.length;
  const documents = profile.documents.length;
  const avatar = profile.details.avatarDataUrl;

  return (
    <div className="space-y-5">
      {guestOnly ? <GuestBanner /> : null}
      <div className="flex items-center gap-4">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt=""
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-2xl font-semibold text-paper">
            {letter || "?"}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold">{name}</h2>
          {email ? <p className="truncate text-sm text-muted">{email}</p> : null}
          {phone ? <p className="text-sm text-muted">{phone}</p> : null}
          {location ? <p className="text-sm text-muted">{location}</p> : null}
          <div className="mt-1 flex flex-wrap gap-2">
            {guestOnly ? (
              <span className="rounded-full bg-brand/15 px-2 py-0.5 text-xs font-medium text-brand">
                Guest · this device
              </span>
            ) : null}
            {emailVerified ? (
              <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                Email verified
              </span>
            ) : null}
            {memberSince ? (
              <span className="text-xs text-muted">
                Member since{" "}
                {new Date(memberSince).toLocaleDateString("en-GB", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
        <Stat href="/bookings" value={bookings} label="Bookings" />
        <Stat href="/messages" value={messages.length} label="Messages" />
        <Stat href="/saved" value={saved} label="Saved" />
        <Stat href="/profile/documents" value={documents} label="Documents" />
      </div>

      {activity.length > 0 ? (
        <section className="space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-semibold">Recent activity</h3>
            <Link href="/profile/activity" className="text-sm font-medium text-brand">
              View all
            </Link>
          </div>
          <ul className="space-y-2">
            {activity.slice(0, 3).map((item) => (
              <li key={item.id}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="block rounded-card bg-paper p-3 shadow-card"
                  >
                    <ActivityRow item={item} />
                  </Link>
                ) : (
                  <div className="rounded-card bg-paper p-3 shadow-card">
                    <ActivityRow item={item} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <ul className="overflow-hidden rounded-card bg-paper shadow-card">
        {SECTIONS.map((section) => (
          <li key={section.href} className="border-b border-line/10 last:border-b-0">
            <Link href={section.href} className="flex min-h-target items-center gap-3 px-4 py-3">
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{section.title}</span>
                <span className="block text-sm text-muted">{section.detail}</span>
              </span>
              <span aria-hidden="true" className="text-muted">
                ›
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {user ? (
        <button
          type="button"
          className="min-h-target w-full rounded-full border border-danger/40 font-semibold text-danger"
          onClick={async () => {
            await signOut();
            router.push("/login");
            router.refresh();
          }}
        >
          Sign out
        </button>
      ) : guestOnly ? (
        <div className="space-y-2">
          <Link
            href="/login/sign-up"
            className="inline-flex min-h-target w-full items-center justify-center rounded-full bg-brand px-4 font-semibold text-paper"
          >
            Create account
          </Link>
          <button
            type="button"
            className="min-h-target w-full rounded-full border border-line/30 font-semibold"
            onClick={() => {
              clearGuest();
              router.push("/login");
              router.refresh();
            }}
          >
            Leave guest mode
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <Link
            href="/login/sign-up"
            className="inline-flex min-h-target w-full items-center justify-center rounded-full bg-brand px-4 font-semibold text-paper"
          >
            Create account
          </Link>
          <Link
            href="/login/guest"
            className="inline-flex min-h-target w-full items-center justify-center rounded-full border border-line/30 font-semibold"
          >
            Continue as guest
          </Link>
        </div>
      )}
      <Link href="/settings" className="block text-center text-sm text-muted">
        Display settings
      </Link>
    </div>
  );
}

function ActivityRow({
  item,
}: {
  item: { title: string; detail: string; at: string };
}) {
  return (
    <>
      <span className="block text-sm font-medium">{item.title}</span>
      <span className="mt-0.5 block text-sm text-muted">{item.detail}</span>
      <span className="mt-1 block text-xs text-muted">
        {new Date(item.at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </>
  );
}

function Stat({
  href,
  value,
  label,
}: {
  href: string;
  value: number;
  label: string;
}) {
  return (
    <Link href={href} className="rounded-card bg-paper px-2 py-3 shadow-card">
      <span className="block text-xl font-semibold text-brand">{value}</span>
      <span className="block text-xs text-muted">{label}</span>
    </Link>
  );
}
