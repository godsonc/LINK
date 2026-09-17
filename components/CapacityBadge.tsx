"use client";

export function CapacityBadge({
  capacity,
}: {
  capacity: "available" | "limited" | "full";
}) {
  const copy = {
    available: { label: "Accepting referrals", className: "bg-moss/15 text-moss" },
    limited: { label: "Limited spaces", className: "bg-wheat text-ink" },
    full: { label: "Currently full", className: "bg-clay/15 text-clay" },
  }[capacity];
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm ${copy.className}`}>
      {copy.label}
    </span>
  );
}
