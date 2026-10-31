"use client";

import Link from "next/link";
import { NEED_COPY } from "@/lib/needs";
import { serviceById } from "@/lib/catalog";
import { GuestBanner } from "@/components/GuestBanner";
import { useLink } from "@/lib/link-context";

export default function PathwayPage() {
  const { session } = useLink();

  if (!session.pathway.length) {
    return (
      <div className="space-y-4">
        <GuestBanner />
        <p className="text-muted">
          Tell us what you need and we will suggest local options.
        </p>
        <Link
          href="/discover"
          className="inline-flex min-h-target items-center rounded-full bg-brand px-5 font-semibold text-paper"
        >
          Find my pathway
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <GuestBanner />
      <div>
        <p className="text-muted">
          Start with one step. You can come back to the others.
        </p>
      </div>
      <ol className="space-y-3">
        {session.pathway.map((step, index) => {
          const service = serviceById(step.serviceId);
          if (!service) return null;
          return (
            <li key={step.serviceId} className="rounded-card bg-paper p-4 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                Step {index + 1} · {NEED_COPY[step.needId].short}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{service.name}</h3>
              <p className="mt-1 text-sm text-muted">{service.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/bookings/new?service=${service.id}`}
                  className="inline-flex min-h-11 items-center rounded-full bg-brand px-4 text-sm font-semibold text-paper"
                >
                  Book appointment
                </Link>
                <Link
                  href={`/services/${service.id}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-line/30 px-4 text-sm font-semibold"
                >
                  View this step
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
      <Link href="/help" className="block text-center text-sm font-medium text-brand">
        I need a person to help me
      </Link>
      <Link href="/follow-up" className="block text-center text-sm text-muted">
        Did you get the help you needed?
      </Link>
    </div>
  );
}
