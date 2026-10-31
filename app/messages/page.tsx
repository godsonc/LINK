"use client";

import Link from "next/link";
import { GuestBanner } from "@/components/GuestBanner";
import { useMessages } from "@/components/useMessages";
import { useAuth } from "@/lib/auth-context";
import { formatMessageTime } from "@/lib/messages";

const EXAMPLES = [
  {
    id: "example-emma",
    from: "Emma",
    preview: "I can help you look at the benefits form.",
    time: "Example",
  },
  {
    id: "example-pantry",
    from: "Boston Community Pantry",
    preview: "Your visit is booked for Thursday.",
    time: "Example",
  },
];

export default function MessagesPage() {
  const { ready, items } = useMessages();
  const { isGuest, user } = useAuth();

  if (!ready) {
    return <p className="text-muted">Loading messages…</p>;
  }

  return (
    <div className="space-y-4">
      <GuestBanner />
      <p className="text-sm text-muted">
        Messages from bookings, referrals and navigator requests on this device.
        Nothing is sent to a real inbox in this demo.
      </p>
      {items.length === 0 ? (
        <p className="rounded-card bg-paper p-4 text-muted shadow-card">
          No messages yet. Book an appointment or ask for a navigator and updates
          will appear here.
        </p>
      ) : (
        <ul className="divide-y divide-line/10 overflow-hidden rounded-card bg-paper shadow-card">
          {items.map((thread) => (
            <li key={thread.id}>
              <Link
                href={`/messages/${thread.id}`}
                className="flex items-start gap-3 px-4 py-4"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/15 font-semibold text-brand">
                  {thread.from.charAt(0)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold">{thread.from}</span>
                    <span className="text-xs text-muted">
                      {formatMessageTime(thread.at)}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-sm text-muted">
                    {thread.preview}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {items.length === 0 && (isGuest || !user) ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Examples
          </p>
          <ul className="divide-y divide-line/10 overflow-hidden rounded-card border border-dashed border-line/20 bg-paper/80">
            {EXAMPLES.map((thread) => (
              <li key={thread.id}>
                <div className="flex items-start gap-3 px-4 py-4 opacity-80">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 font-semibold text-brand">
                    {thread.from.charAt(0)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold">{thread.from}</span>
                      <span className="text-xs text-muted">{thread.time}</span>
                    </span>
                    <span className="mt-1 block truncate text-sm text-muted">
                      {thread.preview}
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
