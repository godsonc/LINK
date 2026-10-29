"use client";

import { useState } from "react";
import { useLink } from "@/lib/link-context";

export default function HelpPage() {
  const { session, requestNavigator } = useLink();
  const [reason, setReason] = useState("I would like a person to help me take the next step.");
  const [contact, setContact] = useState("");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
          Human when necessary
        </p>
        <h1 className="mt-2 text-4xl font-semibold">Need someone to help?</h1>
        <p className="mt-3 text-lg text-muted">
          Community Navigators can review your situation, contact organisations,
          support applications, and find another pathway if the first one fails.
        </p>
      </header>
      {session.navigatorCase ? (
        <section className="rounded-3xl bg-success/15 p-6">
          <h2 className="text-2xl font-semibold">A navigator has been asked</h2>
          <p className="mt-2">
            Case {session.navigatorCase.id} is {session.navigatorCase.status.replace("_", " ")}.
            In this MVP the request appears on the admin board so a navigator can
            pick it up.
          </p>
        </section>
      ) : (
        <form
          className="rounded-3xl bg-paper p-6 shadow-card"
          onSubmit={(event) => {
            event.preventDefault();
            requestNavigator({ reason, preferredContact: contact });
          }}
        >
          <label className="block font-medium">
            Why would a person help more than the website just now?
            <textarea
              className="mt-2 w-full rounded-2xl border border-line/20 bg-field p-4"
              rows={5}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </label>
          <label className="mt-4 block font-medium">
            How should we contact you?
            <input
              className="mt-2 w-full rounded-full border border-line/20 bg-field px-4 py-2"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              required
            />
          </label>
          <button
            className="mt-5 rounded-full bg-brand px-5 py-3 font-medium text-paper"
            type="submit"
          >
            Connect with a Community Navigator
          </button>
        </form>
      )}
    </div>
  );
}
