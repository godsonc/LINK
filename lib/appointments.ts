import { localityById } from "./localities";
import { newId } from "./store";
import type { Capacity, Service } from "./types";

export type AppointmentChannel =
  | "in_person"
  | "phone"
  | "video"
  | "outreach";

export type AppointmentStatus = "booked" | "waitlist" | "cancelled";

export type Appointment = {
  id: string;
  reference: string;
  serviceId: string;
  serviceName: string;
  organisation: string;
  channel: AppointmentChannel;
  date: string;
  time: string;
  place: string;
  fullName: string;
  email: string;
  phone: string;
  contactMethod: "email" | "text";
  notes: string;
  accessNeeds: string;
  status: AppointmentStatus;
  createdAt: string;
};

const STORAGE_KEY = "link-appointments";

export const APPOINTMENT_TIMES = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
];

export const APPOINTMENT_CHANNELS: {
  id: AppointmentChannel;
  title: string;
  detail: string;
}[] = [
  { id: "in_person", title: "In person", detail: "At a local location" },
  { id: "phone", title: "Phone call", detail: "We call you" },
  { id: "video", title: "Video call", detail: "Online, from where you are" },
  {
    id: "outreach",
    title: "Community outreach",
    detail: "At a community venue",
  },
];

export function channelLabel(channel: AppointmentChannel) {
  return (
    APPOINTMENT_CHANNELS.find((item) => item.id === channel)?.title ?? channel
  );
}

export function placeFor(service: Service, channel: AppointmentChannel) {
  const place = localityById(service.locality);
  if (channel === "phone") return "Phone call";
  if (channel === "video") return "Video call";
  if (channel === "outreach") return `${place.name} community venue`;
  return `${place.name}`;
}

export function loadAppointments(): Appointment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Appointment[]) : [];
  } catch {
    return [];
  }
}

export function saveAppointments(items: Appointment[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function createReference() {
  const left = Math.floor(100000 + Math.random() * 900000);
  const right = Math.floor(1000 + Math.random() * 9000);
  return `LINK-${left}-${right}`;
}

export function createAppointment(
  input: Omit<Appointment, "id" | "reference" | "createdAt">,
): Appointment {
  return {
    ...input,
    id: newId("apt"),
    reference: createReference(),
    createdAt: new Date().toISOString(),
  };
}

function parseDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toIsoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function formatLongDate(iso: string) {
  return parseDate(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function slotsFor(iso: string, capacity: Capacity) {
  const day = parseDate(iso).getDay();
  if (day === 0 || day === 6 || capacity === "full") return [];
  if (capacity === "limited") return ["10:00", "11:00", "13:30"];
  return APPOINTMENT_TIMES;
}

export function nextOpenDate(fromIso: string, capacity: Capacity) {
  const start = parseDate(fromIso);
  for (let offset = 1; offset <= 28; offset += 1) {
    const next = new Date(start);
    next.setDate(start.getDate() + offset);
    const iso = toIsoDate(next);
    if (slotsFor(iso, capacity).length > 0) return iso;
  }
  return null;
}

export function reminderText(appointment: Appointment, now = new Date()) {
  if (appointment.status !== "booked" || !appointment.date || !appointment.time) {
    return null;
  }
  const when = parseDate(appointment.date);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((when.getTime() - today.getTime()) / 86400000);
  if (diff < 0 || diff > 1) return null;
  const whenLabel = diff === 0 ? "today" : "tomorrow";
  return `You have an appointment ${whenLabel} at ${appointment.time} with ${appointment.serviceName}.`;
}

export function downloadCalendar(appointment: Appointment) {
  const [year, month, day] = appointment.date.split("-");
  const [hour, minute] = appointment.time.split(":");
  const start = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );
  const end = new Date(start.getTime() + 45 * 60 * 1000);
  const stamp = (date: Date) => {
    const pad = (value: number) => String(value).padStart(2, "0");
    return (
      `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
      `T${pad(date.getHours())}${pad(date.getMinutes())}00`
    );
  };
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//LINK//Appointments//EN",
    "BEGIN:VEVENT",
    `UID:${appointment.id}@lincolnshire-link`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${appointment.serviceName}`,
    `LOCATION:${appointment.place}`,
    `DESCRIPTION:Reference ${appointment.reference}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const file = new Blob([body], { type: "text/calendar" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${appointment.reference}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}
