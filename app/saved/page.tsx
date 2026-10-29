"use client";

import Link from "next/link";
import { serviceById } from "@/lib/catalog";
import { useLink } from "@/lib/link-context";

export default function SavedPage() {
  const { session } = useLink();
  const items = session.pathway
    .map((step) => serviceById(step.serviceId))
    .filter((service) => service !== undefined);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-muted">
          Options from your current pathway stay here on this device.
        </p>
      </div>
      {items.length === 0 ? (
        <p className="rounded-card bg-paper p-4 text-muted shadow-card">
          Nothing saved yet.{" "}
          <Link href="/discover" className="font-medium text-brand">
            Find a pathway
          </Link>
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((service) => (
            <li key={service.id} className="rounded-card bg-paper p-4 shadow-card">
              <h3 className="font-semibold">{service.name}</h3>
              <p className="mt-1 text-sm text-muted">{service.organisation}</p>
              <Link
                href={`/services/${service.id}`}
                className="mt-3 inline-flex text-sm font-semibold text-brand"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
