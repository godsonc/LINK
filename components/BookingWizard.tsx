"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { GuestBanner } from "@/components/GuestBanner";
import { useAuth } from "@/lib/auth-context";
import { SERVICES, serviceById } from "@/lib/catalog";
import { useLink } from "@/lib/link-context";
import {
  APPOINTMENT_CHANNELS,
  type Appointment,
  type AppointmentChannel,
  channelLabel,
  createAppointment,
  downloadCalendar,
  formatLongDate,
  nextOpenDate,
  placeFor,
  slotsFor,
  toIsoDate,
} from "@/lib/appointments";
import { appendMessage } from "@/lib/messages";
import type { NeedId, Service } from "@/lib/types";
import { useAppointments } from "./useAppointments";

const TOPICS: { label: string; needs: NeedId[] }[] = [
  { label: "Benefits & money", needs: ["money"] },
  { label: "Housing support", needs: ["money", "independent"] },
  { label: "Work & skills", needs: ["work"] },
  { label: "Health & wellbeing", needs: ["community"] },
  { label: "Transport", needs: ["independent"] },
  { label: "Food & essentials", needs: ["money"] },
  { label: "Caring support", needs: ["caring"] },
];

type Step =
  | "service"
  | "channel"
  | "date"
  | "time"
  | "none"
  | "waitlist"
  | "details"
  | "review"
  | "error"
  | "done";

export function BookingWizard() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, isGuest } = useAuth();
  const { session, board } = useLink();
  const { ready, items, commit } = useAppointments();
  const rescheduleId = params.get("reschedule");
  const presetService = params.get("service");
  const existing = items.find((item) => item.id === rescheduleId);

  const [step, setStep] = useState<Step>(rescheduleId ? "date" : "service");
  const [serviceId, setServiceId] = useState(presetService ?? "");
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const [channel, setChannel] = useState<AppointmentChannel>("in_person");
  const [date, setDate] = useState(toIsoDate(new Date()));
  const [time, setTime] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState<"email" | "text">("email");
  const [notes, setNotes] = useState("");
  const [accessNeeds, setAccessNeeds] = useState(session.answers.access ?? "");
  const [saved, setSaved] = useState<Appointment | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ready || started) return;
    if (existing) {
      setServiceId(existing.serviceId);
      setChannel(existing.channel);
      setDate(existing.date);
      setTime(existing.time);
      setFullName(existing.fullName);
      setEmail(existing.email);
      setPhone(existing.phone);
      setContactMethod(existing.contactMethod);
      setNotes(existing.notes);
      setAccessNeeds(existing.accessNeeds);
      setStep("date");
    } else if (user) {
      setFullName(user.fullName ?? "");
      setEmail(user.email ?? "");
    }
    setStarted(true);
  }, [existing, ready, started, user]);

  const service = serviceById(serviceId);
  const live = service
    ? { ...service, ...board.serviceOverrides[service.id] }
    : undefined;
  const openSlots = live ? slotsFor(date, live.capacity) : [];

  const services = useMemo(() => {
    const selected = TOPICS.find((item) => item.label === topic);
    const needle = query.trim().toLowerCase();
    return SERVICES.filter((item) => {
      const topicMatch =
        !selected || item.categories.some((need) => selected.needs.includes(need));
      const text = `${item.name} ${item.organisation} ${item.summary}`.toLowerCase();
      return topicMatch && (!needle || text.includes(needle));
    });
  }, [query, topic]);

  const pathwayServices = session.pathway
    .map((stepItem) => serviceById(stepItem.serviceId))
    .filter((item): item is Service => Boolean(item));

  function goTime(nextDate: string) {
    if (!live) return;
    setDate(nextDate);
    setTime("");
    const slots = slotsFor(nextDate, live.capacity);
    setStep(slots.length ? "time" : "none");
  }

  function confirm(status: "booked" | "waitlist") {
    if (!live) {
      setStep("error");
      return;
    }
    try {
      const next = createAppointment({
        serviceId: live.id,
        serviceName: live.name,
        organisation: live.organisation,
        channel,
        date: status === "waitlist" ? date : date,
        time: status === "waitlist" ? "" : time,
        place: placeFor(live, channel),
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        contactMethod,
        notes: notes.trim(),
        accessNeeds: accessNeeds.trim(),
        status,
      });
      let savedAppointment = next;
      if (existing) {
        savedAppointment = {
          ...next,
          id: existing.id,
          reference: existing.reference,
          createdAt: existing.createdAt,
        };
        commit(
          items.map((item) =>
            item.id === existing.id ? savedAppointment : item,
          ),
        );
        setSaved(savedAppointment);
      } else {
        commit([next, ...items]);
        setSaved(next);
      }
      appendMessage({
        from: savedAppointment.serviceName,
        preview:
          status === "waitlist"
            ? "You joined the waitlist for this service."
            : `Appointment booked for ${formatLongDate(savedAppointment.date)}${
                savedAppointment.time ? ` at ${savedAppointment.time}` : ""
              }.`,
        body: `Reference ${savedAppointment.reference}. ${savedAppointment.place}. ${
          status === "waitlist"
            ? "We will contact you when a slot opens."
            : "Bring any documents listed on your pathway step."
        }`,
      });
      setStep("done");
    } catch {
      setStep("error");
    }
  }

  const detailsReady =
    fullName.trim().length > 1 &&
    (contactMethod === "email" ? email.includes("@") : phone.trim().length >= 8);

  if (!ready || !started) {
    return <p className="text-muted">Loading your booking…</p>;
  }

  if (rescheduleId && !existing) {
    return <p>We could not find that booking.</p>;
  }

  return (
    <div className="space-y-5">
      {step === "service" ? (
        <section className="space-y-4">
          <p className="text-muted">
            Which service would you like help with?
          </p>
          <input
            className="min-h-target w-full rounded-2xl border border-line/20 bg-field px-4"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search services"
            aria-label="Search services"
          />
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((item) => {
              const selected = topic === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  className={`min-h-11 rounded-full px-3 text-sm font-medium ${
                    selected
                      ? "bg-brand text-paper"
                      : "border border-line/20 bg-paper"
                  }`}
                  aria-pressed={selected}
                  onClick={() => setTopic(selected ? "" : item.label)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          {pathwayServices.length > 0 && !query && !topic ? (
            <ServiceList
              title="From your pathway"
              services={pathwayServices}
              selectedId={serviceId}
              onSelect={setServiceId}
            />
          ) : null}
          <ServiceList
            title={query || topic ? "Matching services" : "All services"}
            services={
              query || topic
                ? services
                : services.filter(
                    (item) => !pathwayServices.some((row) => row.id === item.id),
                  )
            }
            selectedId={serviceId}
            onSelect={setServiceId}
          />
          <button
            type="button"
            className="min-h-target w-full rounded-full bg-brand px-4 font-semibold text-paper disabled:opacity-50"
            disabled={!serviceId}
            onClick={() => setStep("channel")}
          >
            Continue
          </button>
        </section>
      ) : null}

      {step === "channel" && live ? (
        <section className="space-y-4">
          <p className="text-muted">How would you like to meet?</p>
          <p className="font-semibold">{live.name}</p>
          {APPOINTMENT_CHANNELS.map((item) => {
            const selected = channel === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`w-full rounded-card border px-4 py-4 text-left ${
                  selected ? "border-brand bg-brand/10" : "border-line/15 bg-paper"
                }`}
                aria-pressed={selected}
                onClick={() => setChannel(item.id)}
              >
                <span className="block font-semibold">{item.title}</span>
                <span className="mt-1 block text-sm text-muted">{item.detail}</span>
              </button>
            );
          })}
          <StepActions back={() => setStep("service")} next={() => setStep("date")} />
        </section>
      ) : null}

      {step === "date" && live ? (
        <section className="space-y-4">
          <p className="text-muted">Select a date</p>
          <MonthCalendar value={date} onChange={setDate} />
          <StepActions
            back={() => setStep(rescheduleId ? "date" : "channel")}
            backLabel={rescheduleId ? "Bookings" : "Back"}
            onBack={rescheduleId ? () => router.push("/bookings") : undefined}
            next={() => goTime(date)}
            nextLabel="Continue"
          />
        </section>
      ) : null}

      {step === "time" && live ? (
        <section className="space-y-4">
          <p className="font-semibold">{formatLongDate(date)}</p>
          <p className="text-muted">Select a time</p>
          <div className="grid grid-cols-2 gap-2">
            {openSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                className={`min-h-target rounded-2xl text-sm font-semibold ${
                  time === slot ? "bg-brand text-paper" : "bg-paper"
                }`}
                aria-pressed={time === slot}
                onClick={() => setTime(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted">
            Earliest available {formatLongDate(date)}, {openSlots[0]}
          </p>
          <StepActions
            back={() => setStep("date")}
            next={() => setStep(rescheduleId ? "review" : "details")}
            nextDisabled={!time}
          />
        </section>
      ) : null}

      {step === "none" && live ? (
        <section className="space-y-4 rounded-card bg-paper p-5 shadow-card">
          <h2 className="text-xl font-semibold">No appointments available</h2>
          <p className="text-muted">
            {live.name} has no open times on {formatLongDate(date)}. Weekend
            slots are closed, and a full service has no bookable times.
          </p>
          <button
            type="button"
            className="min-h-target w-full rounded-full bg-brand px-4 font-semibold text-paper"
            onClick={() => {
              const next = nextOpenDate(date, live.capacity);
              if (next) goTime(next);
            }}
          >
            View next available
          </button>
          <button
            type="button"
            className="min-h-target w-full rounded-full border border-line/30 px-4 font-semibold"
            onClick={() => setStep("date")}
          >
            Choose another date
          </button>
          <button
            type="button"
            className="min-h-target w-full rounded-full border border-line/30 px-4 font-semibold"
            onClick={() => setStep("waitlist")}
          >
            Join waitlist
          </button>
        </section>
      ) : null}

      {step === "waitlist" ? (
        <DetailsForm
          fullName={fullName}
          email={email}
          phone={phone}
          contactMethod={contactMethod}
          notes={notes}
          accessNeeds={accessNeeds}
          onFullName={setFullName}
          onEmail={setEmail}
          onPhone={setPhone}
          onContactMethod={setContactMethod}
          onNotes={setNotes}
          onAccessNeeds={setAccessNeeds}
          ready={detailsReady}
          submitLabel="Join waitlist"
          onBack={() => setStep("none")}
          onSubmit={() => confirm("waitlist")}
        />
      ) : null}

      {step === "details" ? (
        <DetailsForm
          fullName={fullName}
          email={email}
          phone={phone}
          contactMethod={contactMethod}
          notes={notes}
          accessNeeds={accessNeeds}
          onFullName={setFullName}
          onEmail={setEmail}
          onPhone={setPhone}
          onContactMethod={setContactMethod}
          onNotes={setNotes}
          onAccessNeeds={setAccessNeeds}
          ready={detailsReady}
          submitLabel="Review booking"
          onBack={() => setStep("time")}
          onSubmit={() => setStep("review")}
        />
      ) : null}

      {step === "review" && live ? (
        <section className="space-y-4">
          <p className="text-muted">Check the details before confirming.</p>
          <dl className="space-y-3 rounded-card bg-paper p-4 shadow-card text-sm">
            <Row label="Service" value={live.name} />
            <Row label="Type" value={channelLabel(channel)} />
            <Row
              label="When"
              value={time ? `${formatLongDate(date)} at ${time}` : formatLongDate(date)}
            />
            <Row label="Where" value={placeFor(live, channel)} />
            <Row label="Name" value={fullName} />
            <Row label="Contact" value={contactMethod === "email" ? email : phone} />
            {accessNeeds ? <Row label="Access" value={accessNeeds} /> : null}
            {notes ? <Row label="Notes" value={notes} /> : null}
          </dl>
          <StepActions
            back={() => setStep(rescheduleId ? "time" : "details")}
            next={() => confirm("booked")}
            nextLabel={rescheduleId ? "Confirm change" : "Confirm booking"}
          />
        </section>
      ) : null}

      {step === "error" ? (
        <section className="space-y-4 rounded-card bg-paper p-5 shadow-card">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-muted">
            We couldn’t save this booking on this device. Nothing has been confirmed.
          </p>
          <button
            type="button"
            className="min-h-target w-full rounded-full bg-brand px-4 font-semibold text-paper"
            onClick={() => setStep("review")}
          >
            Try again
          </button>
          <button
            type="button"
            className="min-h-target w-full rounded-full border border-line/30 px-4 font-semibold"
            onClick={() => router.push("/bookings")}
          >
            Go back
          </button>
        </section>
      ) : null}

      {step === "done" && saved ? (
        <section className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-3xl text-success">
            ✓
          </div>
          <h2 className="text-2xl font-semibold">
            {saved.status === "waitlist" ? "You’re on the waitlist" : "Appointment booked"}
          </h2>
          <p className="text-muted">
            {saved.status === "waitlist"
              ? "We’ll keep your request with this booking."
              : "Your appointment has been saved on this device."}
          </p>
          <p className="rounded-card bg-paper p-4 text-left shadow-card">
            <span className="block text-sm text-muted">Reference</span>
            <span className="mt-1 block font-semibold">{saved.reference}</span>
            <span className="mt-3 block text-sm">
              {saved.serviceName}
              <br />
              {channelLabel(saved.channel)}
              {saved.time ? ` · ${formatLongDate(saved.date)} at ${saved.time}` : null}
              <br />
              {saved.place}
            </span>
          </p>
          {saved.status === "booked" ? (
            <button
              type="button"
              className="min-h-target w-full rounded-full border border-line/30 px-4 font-semibold"
              onClick={() => downloadCalendar(saved)}
            >
              Add to calendar
            </button>
          ) : null}
          <Link
            href="/bookings"
            className="inline-flex min-h-target w-full items-center justify-center rounded-full bg-brand px-4 font-semibold text-paper"
          >
            View bookings
          </Link>
          {isGuest && !user ? (
            <GuestBanner className="text-left" />
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function ServiceList({
  title,
  services,
  selectedId,
  onSelect,
}: {
  title: string;
  services: Service[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  if (!services.length) {
    return <p className="text-sm text-muted">No services match that search.</p>;
  }
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold">{title}</h2>
      {services.map((service) => {
        const selected = service.id === selectedId;
        return (
          <button
            key={service.id}
            type="button"
            className={`w-full rounded-card border px-4 py-3 text-left ${
              selected ? "border-brand bg-brand/10" : "border-line/15 bg-paper"
            }`}
            aria-pressed={selected}
            onClick={() => onSelect(service.id)}
          >
            <span className="block font-semibold">{service.name}</span>
            <span className="mt-1 block text-sm text-muted">{service.summary}</span>
          </button>
        );
      })}
    </div>
  );
}

function MonthCalendar({
  value,
  onChange,
}: {
  value: string;
  onChange: (iso: string) => void;
}) {
  const selected = value ? value.split("-").map(Number) : [];
  const initial = selected.length === 3
    ? new Date(selected[0], selected[1] - 1, 1)
    : new Date();
  const [cursor, setCursor] = useState(initial);
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1).getDay();
  const lead = (first + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  const today = toIsoDate(new Date());
  const cells = [
    ...Array.from({ length: lead }, () => ""),
    ...Array.from({ length: count }, (_, index) => String(index + 1)),
  ];

  return (
    <div className="rounded-card bg-paper p-4 shadow-card">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="min-h-11 min-w-11 rounded-full text-brand"
          aria-label="Previous month"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
        >
          ‹
        </button>
        <p className="font-semibold">
          {cursor.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
        </p>
        <button
          type="button"
          className="min-h-11 min-w-11 rounded-full text-brand"
          aria-label="Next month"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
        >
          ›
        </button>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-muted">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (!day) return <span key={`empty-${index}`} />;
          const iso = toIsoDate(new Date(year, month, Number(day)));
          const past = iso < today;
          const selectedDay = iso === value;
          return (
            <button
              key={iso}
              type="button"
              disabled={past}
              className={`min-h-11 rounded-full text-sm ${
                selectedDay
                  ? "bg-brand font-semibold text-paper"
                  : past
                    ? "text-muted/40"
                    : "bg-field"
              }`}
              onClick={() => onChange(iso)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DetailsForm({
  fullName,
  email,
  phone,
  contactMethod,
  notes,
  accessNeeds,
  onFullName,
  onEmail,
  onPhone,
  onContactMethod,
  onNotes,
  onAccessNeeds,
  ready,
  submitLabel,
  onBack,
  onSubmit,
}: {
  fullName: string;
  email: string;
  phone: string;
  contactMethod: "email" | "text";
  notes: string;
  accessNeeds: string;
  onFullName: (value: string) => void;
  onEmail: (value: string) => void;
  onPhone: (value: string) => void;
  onContactMethod: (value: "email" | "text") => void;
  onNotes: (value: string) => void;
  onAccessNeeds: (value: string) => void;
  ready: boolean;
  submitLabel: string;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (ready) onSubmit();
      }}
    >
      <p className="text-muted">Your details</p>
      <Field label="Full name" value={fullName} onChange={onFullName} />
      <Field label="Email" value={email} onChange={onEmail} type="email" />
      <Field label="Phone" value={phone} onChange={onPhone} type="tel" />
      <fieldset>
        <legend className="text-sm font-medium">Preferred contact</legend>
        <div className="mt-2 flex gap-2">
          {(
            [
              ["email", "Email"],
              ["text", "Text message"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`min-h-11 flex-1 rounded-full text-sm font-medium ${
                contactMethod === id ? "bg-brand text-paper" : "border border-line/20 bg-paper"
              }`}
              aria-pressed={contactMethod === id}
              onClick={() => onContactMethod(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="block text-sm font-medium">
        Anything we should know?
        <textarea
          className="mt-2 w-full rounded-card border border-line/20 bg-field p-3"
          rows={3}
          value={notes}
          onChange={(event) => onNotes(event.target.value)}
        />
      </label>
      <label className="block text-sm font-medium">
        Accessibility needs
        <textarea
          className="mt-2 w-full rounded-card border border-line/20 bg-field p-3"
          rows={2}
          value={accessNeeds}
          onChange={(event) => onAccessNeeds(event.target.value)}
        />
      </label>
      <StepActions back={onBack} next={onSubmit} nextLabel={submitLabel} nextDisabled={!ready} />
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        type={type}
        className="mt-2 min-h-target w-full rounded-2xl border border-line/20 bg-field px-4"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function StepActions({
  back,
  next,
  nextLabel = "Continue",
  nextDisabled = false,
  backLabel = "Back",
  onBack,
}: {
  back: () => void;
  next: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  backLabel?: string;
  onBack?: () => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        className="min-h-target flex-1 rounded-full border border-line/30 px-4 font-semibold"
        onClick={onBack ?? back}
      >
        {backLabel}
      </button>
      <button
        type="button"
        className="min-h-target flex-1 rounded-full bg-brand px-4 font-semibold text-paper disabled:opacity-50"
        disabled={nextDisabled}
        onClick={next}
      >
        {nextLabel}
      </button>
    </div>
  );
}
