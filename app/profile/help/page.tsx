"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const TOPICS = [
  {
    question: "How do I book an appointment?",
    href: "/bookings/new",
    detail: "Choose a service, a way to meet, then a date and time.",
  },
  {
    question: "How does LINK work?",
    href: "/discover",
    detail: "Tell us what you need and we’ll suggest a pathway.",
  },
  {
    question: "How is my data used?",
    href: "/privacy",
    detail: "What stays on this device, and what sign-in stores.",
  },
  {
    question: "I need help with my account",
    href: "/login/forgot",
    detail: "Reset a password or sign in again.",
  },
  {
    question: "I need help with my pathway",
    href: "/help",
    detail: "Ask a Community Navigator to take the next step with you.",
  },
];

export default function ProfileHelpPage() {
  const [query, setQuery] = useState("");
  const topics = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return TOPICS;
    return TOPICS.filter((topic) =>
      `${topic.question} ${topic.detail}`.toLowerCase().includes(needle),
    );
  }, [query]);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">
        How can we help?
        <input
          className="mt-2 min-h-target w-full rounded-2xl border border-line/20 bg-field px-4"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search help topics"
        />
      </label>
      {topics.length === 0 ? (
        <p className="text-muted">No topics match that search.</p>
      ) : (
        <ul className="space-y-2">
          {topics.map((topic) => (
            <li key={topic.href}>
              <Link href={topic.href} className="block rounded-card bg-paper p-4 shadow-card">
                <span className="block font-medium">{topic.question}</span>
                <span className="mt-1 block text-sm text-muted">{topic.detail}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link
        href="/help"
        className="inline-flex min-h-target w-full items-center justify-center rounded-full bg-brand px-4 font-semibold text-paper"
      >
        Contact support
      </Link>
    </div>
  );
}
