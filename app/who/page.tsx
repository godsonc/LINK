"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLink } from "@/lib/link-context";

const OPTIONS = [
  {
    id: "support",
    title: "I need support or opportunities",
    detail: "For myself",
  },
  {
    id: "supporting",
    title: "I'm supporting someone else",
    detail: "A family member, friend or person you care for",
  },
  {
    id: "organisation",
    title: "I work for an organisation",
    detail: "A service, charity or community group",
  },
];

export default function WhoPage() {
  const router = useRouter();
  const { session, answerQuestion } = useLink();
  const [role, setRole] = useState(session.answers.role ?? "");

  return (
    <div className="space-y-5">
      <p className="text-muted">
        Choose the option that fits. You can change it later.
      </p>
      <div className="space-y-3">
        {OPTIONS.map((option) => {
          const selected = role === option.id;
          return (
            <button
              key={option.id}
              type="button"
              className={`w-full rounded-card border px-4 py-4 text-left ${
                selected
                  ? "border-brand bg-brand/10"
                  : "border-line/15 bg-paper"
              }`}
              onClick={() => setRole(option.id)}
              aria-pressed={selected}
            >
              <span className="block font-semibold">{option.title}</span>
              <span className="mt-1 block text-sm text-muted">
                {option.detail}
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="min-h-target w-full rounded-full bg-brand px-4 font-semibold text-paper disabled:opacity-50"
        disabled={!role}
        onClick={() => {
          answerQuestion("role", role);
          router.push("/about");
        }}
      >
        Continue
      </button>
    </div>
  );
}
