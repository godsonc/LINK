"use client";

import Link from "next/link";
import {
  channelLabel,
  formatLongDate,
  reminderText,
} from "@/lib/appointments";
import { useAppointments } from "@/components/useAppointments";
import { useProfile } from "@/components/useProfile";

export default function BookingsPage() {
  const { ready, items } = useAppointments();
  const profile = useProfile();
  const active = items.filter((item) => item.status !== "cancelled");
  const reminders = profile.consents.reminders
    ? active
        .map((item) => reminderText(item))
        .filter((item): item is string => Boolean(item))
    : [];

  return (
    <div className="space-y-4">
      <p className="text-muted">
        In person, phone, video, or a community visit. Times shown are example
        slots for the demo services and stay on this device.
      </p>
      {reminders.map((reminder) => (
        <p key={reminder} className="rounded-card bg-brand/10 p-4 text-sm font-medium">
          {reminder}
        </p>
      ))}
      <Link
        href="/bookings/new"
        className="inline-flex min-h-target w-full items-center justify-center rounded-full bg-brand px-4 font-semibold text-paper"
      >
        Book an appointment
      </Link>
      {!ready ? <p className="text-muted">Loading bookings…</p> : null}
      {ready && active.length === 0 ? (
        <p className="rounded-card bg-paper p-4 text-muted shadow-card">
          You have no appointments yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {active.map((item) => (
            <li key={item.id}>
              <Link
                href={`/bookings/${item.id}`}
                className="block rounded-card bg-paper p-4 shadow-card"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-brand">
                  {item.status === "waitlist" ? "Waitlist" : "Booked"} · {item.reference}
                </span>
                <span className="mt-1 block font-semibold">{item.serviceName}</span>
                <span className="mt-1 block text-sm text-muted">
                  {channelLabel(item.channel)}
                  {item.time
                    ? ` · ${formatLongDate(item.date)} at ${item.time}`
                    : ` · Requested ${formatLongDate(item.date)}`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
