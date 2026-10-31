"use client";

import Link from "next/link";
import { useAppointments } from "@/components/useAppointments";
import { useMessages } from "@/components/useMessages";
import { useProfile } from "@/components/useProfile";
import { buildActivityFeed } from "@/lib/activity-feed";
import { useLink } from "@/lib/link-context";

export default function ActivityPage() {
  const profile = useProfile();
  const { ready, items } = useAppointments();
  const { ready: messagesReady, items: messages } = useMessages();
  const { session } = useLink();
  const bookings = items.filter((item) => item.status !== "cancelled");
  const saved = session.pathway.length;
  const feed = buildActivityFeed({
    bookings: items,
    documents: profile.documents,
  });

  if (!profile.ready || !ready || !messagesReady) {
    return <p className="text-muted">Loading your profile…</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-muted">Bookings, messages and saved opportunities on this device.</p>
      <ul className="overflow-hidden rounded-card bg-paper shadow-card">
        <Row href="/bookings" label="Bookings" value={String(bookings.length)} />
        <Row href="/messages" label="Messages" value={String(messages.length)} />
        <Row href="/saved" label="Saved opportunities" value={String(saved)} />
        <Row
          href="/profile/documents"
          label="Documents uploaded"
          value={String(profile.documents.length)}
        />
      </ul>
      <h2 className="font-semibold">Recent activity</h2>
      {feed.length === 0 ? (
        <p className="rounded-card bg-paper p-4 text-muted shadow-card">
          No activity yet. When you book an appointment or add a document, it will appear here.
        </p>
      ) : (
        <ul className="space-y-2">
          {feed.map((item) => (
            <li key={item.id}>
              {item.href ? (
                <Link href={item.href} className="block rounded-card bg-paper p-4 shadow-card">
                  <span className="block font-medium">{item.title}</span>
                  <span className="mt-1 block text-sm text-muted">{item.detail}</span>
                </Link>
              ) : (
                <div className="rounded-card bg-paper p-4 shadow-card">
                  <span className="block font-medium">{item.title}</span>
                  <span className="mt-1 block text-sm text-muted">{item.detail}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Row({ href, label, value }: { href: string; label: string; value: string }) {
  return (
    <li className="border-b border-line/10 last:border-b-0">
      <Link href={href} className="flex min-h-target items-center justify-between px-4">
        <span className="font-medium">{label}</span>
        <span className="text-sm text-muted">{value}</span>
      </Link>
    </li>
  );
}
