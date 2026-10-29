"use client";

export function CapacityBadge({
  capacity,
}: {
  capacity: "available" | "limited" | "full";
}) {
  const copy = {
    available: { label: "Accepting referrals", className: "bg-success/15 text-success" },
    limited: { label: "Limited spaces", className: "bg-warning text-ink" },
    full: { label: "Currently full", className: "bg-danger/15 text-danger" },
  }[capacity];
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm ${copy.className}`}>
      {copy.label}
    </span>
  );
}
