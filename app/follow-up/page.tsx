"use client";

import { useState } from "react";
import { useLink } from "@/lib/link-context";

export default function FollowUpPage() {
  const { session, saveFollowUp } = useLink();
  const [accessed, setAccessed] = useState<"yes" | "no" | "not_yet">("not_yet");
  const [notes, setNotes] = useState("");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-4xl font-semibold">Did you get the help you needed?</h1>
      <p className="text-lg text-muted">
        LINK measures successful connections, not just page visits. Your answer
        stays on this device in the MVP demo.
      </p>
      {session.followUp ? (
        <p className="rounded-3xl bg-success/15 p-6">
          Thank you. You told us: {session.followUp.accessed.replace("_", " ")}.
        </p>
      ) : (
        <form
          className="rounded-3xl bg-paper p-6 shadow-card"
          onSubmit={(event) => {
            event.preventDefault();
            saveFollowUp(accessed, notes);
          }}
        >
          <fieldset className="space-y-2">
            <legend className="font-medium">Were you able to access support?</legend>
            {[
              ["yes", "Yes"],
              ["no", "No"],
              ["not_yet", "Not yet"],
            ].map(([value, label]) => (
              <label key={value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="accessed"
                  checked={accessed === value}
                  onChange={() => setAccessed(value as typeof accessed)}
                />
                {label}
              </label>
            ))}
          </fieldset>
          <label className="mt-4 block">
            Anything we should know?
            <textarea
              className="mt-2 w-full rounded-2xl border border-line/20 bg-field p-4"
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>
          <button className="mt-4 rounded-full bg-brand px-5 py-3 font-medium text-paper" type="submit">
            Send follow-up
          </button>
        </form>
      )}
    </div>
  );
}
