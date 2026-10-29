"use client";

import { useState } from "react";
import { useLink } from "@/lib/link-context";

const TIMES = ["10:00", "11:00", "13:00", "14:30", "16:00"];

export default function BookingsPage() {
  const { session, requestNavigator } = useLink();
  const [date, setDate] = useState("");
  const [time, setTime] = useState(TIMES[0]);
  const [contact, setContact] = useState("");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Book an appointment</h2>
        <p className="mt-2 text-muted">
          Ask a Community Navigator for a time that suits you.
        </p>
      </div>
      {session.navigatorCase ? (
        <section className="rounded-card bg-success/15 p-4">
          <h3 className="font-semibold">Request sent</h3>
          <p className="mt-1 text-sm">
            Case {session.navigatorCase.id} is{" "}
            {session.navigatorCase.status.replace("_", " ")}. A navigator will
            confirm the time.
          </p>
        </section>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            requestNavigator({
              reason: `Appointment requested for ${date} at ${time}.`,
              preferredContact: contact,
            });
          }}
        >
          <label className="block text-sm font-medium">
            Date
            <input
              type="date"
              className="mt-2 min-h-target w-full rounded-2xl border border-line/20 bg-field px-4"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </label>
          <fieldset>
            <legend className="text-sm font-medium">Time</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {TIMES.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={`min-h-11 rounded-full px-4 text-sm font-medium ${
                    time === slot
                      ? "bg-brand text-paper"
                      : "border border-line/20 bg-paper"
                  }`}
                  onClick={() => setTime(slot)}
                  aria-pressed={time === slot}
                >
                  {slot}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="block text-sm font-medium">
            Phone or email
            <input
              className="mt-2 min-h-target w-full rounded-2xl border border-line/20 bg-field px-4"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              required
            />
          </label>
          <button
            type="submit"
            className="min-h-target w-full rounded-full bg-brand px-4 font-semibold text-paper"
          >
            Request this time
          </button>
        </form>
      )}
    </div>
  );
}
