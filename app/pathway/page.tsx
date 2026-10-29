"use client";

import Link from "next/link";
import { NEED_COPY } from "@/lib/needs";
import { serviceById } from "@/lib/catalog";
import { useLink } from "@/lib/link-context";

export default function PathwayPage() {
  const { session } = useLink();

  if (!session.pathway.length) {
    return (
      <div className="space-y-4">
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
              <Link
                href={`/services/${service.id}`}
                className="mt-4 inline-flex min-h-11 items-center rounded-full bg-brand px-4 text-sm font-semibold text-paper"
              >
                Start this step
              </Link>
            </li>
          );
        })}
      </ol>
      <Link href="/help" className="block text-center text-sm font-medium text-brand">
        I need a person to help me
      </Link>
    </div>
  );
}
