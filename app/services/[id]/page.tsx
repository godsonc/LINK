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
    <article className="mx-auto max-w-3xl space-y-6">
      <Link href="/pathway" className="text-sm text-brand">
        Back to pathway
      </Link>
      <header className="rounded-3xl bg-paper p-8 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-4xl font-semibold">{live.name}</h1>
            <p className="mt-1 text-muted">{live.organisation}</p>
          </div>
          <CapacityBadge capacity={live.capacity} />
        </div>
        <p className="mt-4 text-lg leading-relaxed">{live.summary}</p>
        <p className="mt-3 text-sm text-muted">
          {place.name} · {live.district} · last verified {live.lastVerified} ·{" "}
          {live.verification}
        </p>
      </header>

      <section className="rounded-3xl border border-line/15 bg-paper p-6">
        <h2 className="text-2xl font-semibold">How to access this</h2>
        <p className="mt-2 leading-relaxed">{live.howToAccess}</p>
        <p className="mt-3 font-medium">Next action: {live.nextAction}</p>
        <Link
          href={`/bookings/new?service=${live.id}`}
          className="mt-4 inline-flex min-h-target items-center rounded-full bg-brand px-4 text-sm font-semibold text-paper"
        >
          Book appointment
        </Link>
        {live.documents.length > 0 ? (
          <div className="mt-4">
            <h3 className="font-medium">If you have them, useful documents</h3>
            <ul className="mt-2 list-disc pl-5">
              {live.documents.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <p className="mt-4 text-sm text-muted">{live.eligibilityNotes}</p>
        {match ? <p className="mt-3 text-sm">{match.eligibilityPhrase}</p> : null}
        <div className="mt-4 space-y-1 text-sm">
          {live.phone ? <p>Phone: {live.phone}</p> : null}
          {live.email ? <p>Email: {live.email}</p> : null}
          {live.website ? (
            <p>
              Website:{" "}
              <a className="underline" href={live.website}>
                {live.website}
              </a>
            </p>
          ) : null}
        </div>
      </section>

      <section className="rounded-3xl bg-paper p-6 shadow-card">
        <h2 className="text-2xl font-semibold">Ask LINK to help you take this step</h2>
        <p className="mt-2 text-muted">
          Where we cannot book directly, we can send a referral request for a
          navigator or the provider to follow up.
        </p>
        {sent ? (
          <p className="mt-4 font-medium">
            Referral requested. A navigator can see this on the admin board.
          </p>
        ) : (
          <form
            className="mt-4 grid gap-3"
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
            <label>
              Name, if you are happy to share it
              <input
                className="mt-1 w-full rounded-full border border-line/20 bg-field px-4 py-2"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>
            <label>
              Phone or email
              <input
                className="mt-1 w-full rounded-full border border-line/20 bg-field px-4 py-2"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </label>
            <button
              className="rounded-full bg-brand px-5 py-3 font-medium text-paper"
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
