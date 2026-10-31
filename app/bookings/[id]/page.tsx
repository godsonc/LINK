"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useAppointments } from "@/components/useAppointments";
import { useProfile } from "@/components/useProfile";
import {
  channelLabel,
  downloadCalendar,
  formatLongDate,
  reminderText,
} from "@/lib/appointments";

export default function BookingDetailPage() {
  const params = useParams<{ id: string }>();
  const { ready, items, commit } = useAppointments();
  const profile = useProfile();
  const [cancelling, setCancelling] = useState(false);
  const appointment = items.find((item) => item.id === params.id);

  if (!ready) return <p className="text-muted">Loading your booking…</p>;
  if (!appointment) return <p>We could not find that booking.</p>;

  const reminder = profile.consents.reminders
    ? reminderText(appointment)
    : null;

  function cancel() {
    commit(
      items.map((item) =>
        item.id === appointment?.id ? { ...item, status: "cancelled" } : item,
      ),
    );
    setCancelling(false);
  }

  if (appointment.status === "cancelled") {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Appointment cancelled</h2>
        <p className="text-muted">
          {appointment.reference} is no longer booked.
        </p>
        <Link href="/bookings" className="font-semibold text-brand">
          Back to bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reminder ? (
        <p className="rounded-card bg-brand/10 p-4 text-sm font-medium">{reminder}</p>
      ) : null}
      <dl className="space-y-3 rounded-card bg-paper p-4 shadow-card text-sm">
        <div>
          <dt className="text-muted">Reference</dt>
          <dd className="font-semibold">{appointment.reference}</dd>
        </div>
        <div>
          <dt className="text-muted">Service</dt>
          <dd className="font-medium">{appointment.serviceName}</dd>
        </div>
        <div>
          <dt className="text-muted">Type</dt>
          <dd className="font-medium">{channelLabel(appointment.channel)}</dd>
        </div>
        <div>
          <dt className="text-muted">When</dt>
          <dd className="font-medium">
            {appointment.time
              ? `${formatLongDate(appointment.date)} at ${appointment.time}`
              : `Requested for ${formatLongDate(appointment.date)}`}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Where</dt>
          <dd className="font-medium">{appointment.place}</dd>
        </div>
        <div>
          <dt className="text-muted">Contact</dt>
          <dd className="font-medium">
            {appointment.fullName}
            <br />
            {appointment.contactMethod === "email"
              ? appointment.email
              : appointment.phone}
          </dd>
        </div>
      </dl>
      {cancelling ? (
        <section className="space-y-3 rounded-card bg-paper p-4 shadow-card">
          <h2 className="text-lg font-semibold">Cancel this appointment?</h2>
          <p className="text-sm text-muted">
            You can book again later. This only updates the copy saved on this device.
          </p>
          <button
            type="button"
            className="min-h-target w-full rounded-full bg-danger px-4 font-semibold text-paper"
            onClick={cancel}
          >
            Cancel appointment
          </button>
          <button
            type="button"
            className="min-h-target w-full rounded-full border border-line/30 px-4 font-semibold"
            onClick={() => setCancelling(false)}
          >
            Keep appointment
          </button>
        </section>
      ) : (
        <div className="space-y-2">
          {appointment.status === "booked" ? (
            <>
              <Link
                href={`/bookings/new?reschedule=${appointment.id}`}
                className="inline-flex min-h-target w-full items-center justify-center rounded-full bg-brand px-4 font-semibold text-paper"
              >
                Reschedule
              </Link>
              <button
                type="button"
                className="min-h-target w-full rounded-full border border-line/30 px-4 font-semibold"
                onClick={() => downloadCalendar(appointment)}
              >
                Add to calendar
              </button>
            </>
          ) : null}
          <button
            type="button"
            className="min-h-target w-full rounded-full border border-danger/40 px-4 font-semibold text-danger"
            onClick={() => setCancelling(true)}
          >
            Cancel appointment
          </button>
        </div>
      )}
    </div>
  );
}
