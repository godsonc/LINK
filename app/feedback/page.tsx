"use client";

import { useState } from "react";
import { useLink } from "@/lib/link-context";

export default function FeedbackPage() {
  const { saveFollowUp } = useLink();
  const [stars, setStars] = useState(0);
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-muted">
          Tell us whether the pathway was useful. This stays on this device.
        </p>
      </div>
      {sent ? (
        <p className="rounded-card bg-success/15 p-4 font-medium">
          Thank you. Your feedback is saved.
        </p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            saveFollowUp(stars >= 4 ? "yes" : stars === 0 ? "not_yet" : "no", notes);
            setSent(true);
          }}
        >
          <div className="flex gap-2" role="group" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`flex h-11 w-11 items-center justify-center rounded-full text-lg ${
                  value <= stars ? "bg-brand text-paper" : "bg-field text-ink"
                }`}
                onClick={() => setStars(value)}
                aria-pressed={value <= stars}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
              >
                {value}
              </button>
            ))}
          </div>
          <label className="block text-sm font-medium">
            Anything else?
            <textarea
              className="mt-2 w-full rounded-card border border-line/20 bg-field p-4"
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>
          <button
            type="submit"
            className="min-h-target w-full rounded-full bg-brand px-4 font-semibold text-paper disabled:opacity-50"
            disabled={stars === 0}
          >
            Send feedback
          </button>
        </form>
      )}
    </div>
  );
}
