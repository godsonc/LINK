import Link from "next/link";
import { CapacityBadge } from "./CapacityBadge";
import { localityById } from "@/lib/localities";
import type { Match, Service } from "@/lib/types";

export function ServiceCard({
  service,
  match,
}: {
  service: Service;
  match?: Match;
}) {
  const place = localityById(service.locality);
  return (
    <article className="rounded-2xl border border-line/15 bg-paper p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">{service.name}</h3>
          <p className="text-sm text-muted">{service.organisation}</p>
        </div>
        <CapacityBadge capacity={service.capacity} />
      </div>
      <p className="mt-3 leading-relaxed">{service.summary}</p>
      <p className="mt-2 text-sm text-muted">
        {place.name} · {service.cost === "free" ? "Free" : "May have a cost"} ·
        verified {service.lastVerified}
      </p>
      {match ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
          {match.reasons.slice(0, 3).map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      ) : null}
      <div className="mt-4">
        <Link
          className="inline-flex rounded-full bg-brand px-4 py-2 text-sm font-medium text-paper"
          href={`/services/${service.id}`}
        >
          View this option
        </Link>
      </div>
    </article>
  );
}
