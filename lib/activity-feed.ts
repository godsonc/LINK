import { channelLabel, formatLongDate } from "./appointments";
import type { Appointment } from "./appointments";
import type { ProfileDocument } from "./profile";
export type ActivityItem = {
  id: string;
  at: string;
  title: string;
  detail: string;
  href?: string;
};

export function buildActivityFeed(input: {
  bookings: Appointment[];
  documents: ProfileDocument[];
}): ActivityItem[] {
  const items: ActivityItem[] = [];

  for (const booking of input.bookings) {
    if (booking.status === "cancelled") continue;
    items.push({
      id: booking.id,
      at: booking.createdAt,
      title:
        booking.status === "waitlist"
          ? "Joined waitlist"
          : "Booking confirmed",
      detail: `${booking.serviceName} · ${channelLabel(booking.channel)}${
        booking.time
          ? ` · ${formatLongDate(booking.date)} at ${booking.time}`
          : ""
      }`,
      href: `/bookings/${booking.id}`,
    });
  }

  for (const document of input.documents) {
    items.push({
      id: document.id,
      at: document.addedAt,
      title: "Document added",
      detail: document.name,
      href: "/profile/documents",
    });
  }

  return items.sort(
    (left, right) => new Date(right.at).getTime() - new Date(left.at).getTime(),
  );
}
