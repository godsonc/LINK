"use client";

import { useState } from "react";
import { useLink } from "@/lib/link-context";

const OPTIONS = [
  {
    title: "A navigator calls me",
    detail: "Someone from LINK talks it through with you.",
  },
  {
    title: "Help with a form or application",
    detail: "Support to fill something in or make a referral.",
  },
  {
    title: "Come with me to an appointment",
    detail: "A person attends with you if that would help.",
  },
];

export default function HelpPage() {
  const { session, requestNavigator } = useLink();
  const [choice, setChoice] = useState(OPTIONS[0].title);
  const [contact, setContact] = useState("");

  return (
    <div className="space-y-5">
      <div>
        <p className="text-muted">
          If the next step is hard to do alone, a Community Navigator can help.
        </p>
      </div>
      {session.navigatorCase ? (
        <section className="rounded-card bg-success/15 p-4">
          <h3 className="font-semibold">A navigator has been asked</h3>
          <p className="mt-1 text-sm">
            Case {session.navigatorCase.id} is{" "}
            {session.navigatorCase.status.replace("_", " ")}.
          </p>
        </section>
      ) : (
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            requestNavigator({
              reason: choice,
              preferredContact: contact,
            });
          }}
        >
          {OPTIONS.map((option) => {
            const selected = choice === option.title;
            return (
              <button
                key={option.title}
                type="button"
                className={`w-full rounded-card border px-4 py-4 text-left ${
                  selected
                    ? "border-brand bg-brand/10"
                    : "border-line/15 bg-paper"
                }`}
                onClick={() => setChoice(option.title)}
                aria-pressed={selected}
              >
                <span className="block font-semibold">{option.title}</span>
                <span className="mt-1 block text-sm text-muted">
                  {option.detail}
                </span>
              </button>
            );
          })}
          <label className="block text-sm font-medium">
            How should we reach you?
            <input
              className="mt-2 min-h-target w-full rounded-2xl border border-line/20 bg-field px-4"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="Phone number or email"
              required
            />
          </label>
          <button
            type="submit"
            className="min-h-target w-full rounded-full bg-brand px-4 font-semibold text-paper"
          >
            Request help
          </button>
        </form>
      )}
    </div>
  );
}
