"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CapacityBadge } from "@/components/CapacityBadge";
import { serviceById } from "@/lib/catalog";
import { localityById } from "@/lib/localities";
import { useLink } from "@/lib/link-context";

export default function ServicePage() {
  const params = useParams<{ id: string }>();
  const { session, board, requestReferral } = useLink();
  const service = serviceById(params.id);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  if (!service) {
    return <p>We could not find that service in the verified directory.</p>;
  }

  const override = board.serviceOverrides[service.id];
  const live = { ...service, ...override };
  const place = localityById(live.locality);
  const match = session.matches.find((item) => item.serviceId === live.id);

  return (
    <article className="space-y-4">
      <header className="rounded-card bg-paper p-5 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">{live.name}</h2>
            <p className="mt-1 text-sm text-muted">{live.organisation}</p>
          </div>
          <CapacityBadge capacity={live.capacity} />
        </div>
        <p className="mt-3 leading-relaxed">{live.summary}</p>
        <p className="mt-2 text-sm text-muted">
          {place.name} · {live.district} · verified {live.lastVerified}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/bookings/new?service=${live.id}`}
            className="inline-flex min-h-11 items-center rounded-full bg-brand px-4 text-sm font-semibold text-paper"
          >
            Book appointment
          </Link>
          <Link
            href="/help"
            className="inline-flex min-h-11 items-center rounded-full border border-line/30 px-4 text-sm font-semibold"
          >
            Ask for help
          </Link>
        </div>
      </header>

      <section className="rounded-card bg-paper p-5 shadow-card">
        <h3 className="font-semibold">How to access this</h3>
        <p className="mt-2 text-sm leading-relaxed">{live.howToAccess}</p>
        <p className="mt-3 text-sm font-medium">Next: {live.nextAction}</p>
        {live.documents.length > 0 ? (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
            {live.documents.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
        {match ? (
          <p className="mt-3 text-sm">{match.eligibilityPhrase}</p>
        ) : null}
        <div className="mt-3 space-y-1 text-sm text-muted">
          {live.phone ? <p>Phone: {live.phone}</p> : null}
          {live.email ? <p>Email: {live.email}</p> : null}
          {live.website ? (
            <p>
              Website:{" "}
              <a className="text-brand underline" href={live.website}>
                {live.website}
              </a>
            </p>
          ) : null}
        </div>
      </section>

      <section className="rounded-card bg-paper p-5 shadow-card">
        <h3 className="font-semibold">Request a referral</h3>
        <p className="mt-2 text-sm text-muted">
          LINK can pass your details to a navigator or the provider to follow up.
        </p>
        {sent ? (
          <p className="mt-4 text-sm font-medium">
            Referral requested. Check Messages for confirmation on this device.
          </p>
        ) : (
          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              requestReferral({
                serviceId: live.id,
                contactName: name,
                contactPhone: phone,
              });
              setSent(true);
            }}
          >
            <label className="block text-sm font-medium">
              Name
              <input
                className="mt-2 min-h-target w-full rounded-2xl border border-line/20 bg-field px-4"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>
            <label className="block text-sm font-medium">
              Phone or email
              <input
                className="mt-2 min-h-target w-full rounded-2xl border border-line/20 bg-field px-4"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </label>
            <button
              className="min-h-target w-full rounded-full bg-brand px-4 font-semibold text-paper disabled:opacity-50"
              type="submit"
              disabled={!live.acceptingReferrals || live.capacity === "full"}
            >
              Request a referral
            </button>
          </form>
        )}
      </section>
    </article>
  );
}
