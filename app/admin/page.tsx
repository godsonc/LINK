"use client";

import { SERVICES } from "@/lib/catalog";
import { localityById } from "@/lib/localities";
import { useLink } from "@/lib/link-context";

export default function AdminPage() {
  const { board, updateService, updateReferralStatus, updateCaseStatus } =
    useLink();
  const successful =
    board.referrals.filter((item) => item.status === "accepted").length +
    (typeof window !== "undefined" &&
    window.localStorage.getItem("link-session")?.includes('"accessed":"yes"')
      ? 1
      : 0);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">
          MVP admin
        </p>
        <h1 className="mt-2 text-4xl font-semibold">Navigator and verification board</h1>
        <p className="mt-3 max-w-3xl text-pine">
          This board is stored in your browser so the demo can show referrals,
          case escalation, capacity and audit history without a server login.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <Stat label="Verified services" value={String(SERVICES.length)} />
        <Stat label="Referral requests" value={String(board.referrals.length)} />
        <Stat label="Navigator cases" value={String(board.cases.length)} />
        <Stat label="Successful connections (demo)" value={String(successful)} />
      </section>

      <section className="rounded-3xl bg-paper p-6 shadow-card">
        <h2 className="text-2xl font-semibold">Referrals</h2>
        {board.referrals.length === 0 ? (
          <p className="mt-2 text-pine">No referrals yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {board.referrals.map((item) => (
              <li key={item.id} className="rounded-2xl border border-pine/10 p-4">
                <p className="font-medium">{item.serviceName}</p>
                <p className="text-sm text-pine">
                  {item.contactName} · {item.contactPhone} · {localityById(item.locality).name}
                </p>
                <select
                  className="mt-2 rounded-full border border-pine/15 bg-sand px-3 py-1"
                  value={item.status}
                  onChange={(event) =>
                    updateReferralStatus(
                      item.id,
                      event.target.value as typeof item.status,
                    )
                  }
                >
                  <option value="requested">Requested</option>
                  <option value="sent">Sent</option>
                  <option value="accepted">Accepted</option>
                  <option value="unable">Unable to help</option>
                </select>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl bg-paper p-6 shadow-card">
        <h2 className="text-2xl font-semibold">Navigator cases</h2>
        {board.cases.length === 0 ? (
          <p className="mt-2 text-pine">No open navigator cases.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {board.cases.map((item) => (
              <li key={item.id} className="rounded-2xl border border-pine/10 p-4">
                <p className="font-medium">{item.reason}</p>
                <p className="text-sm text-pine">{item.story}</p>
                <p className="text-sm">Contact: {item.preferredContact}</p>
                <select
                  className="mt-2 rounded-full border border-pine/15 bg-sand px-3 py-1"
                  value={item.status}
                  onChange={(event) =>
                    updateCaseStatus(
                      item.id,
                      event.target.value as typeof item.status,
                    )
                  }
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl bg-paper p-6 shadow-card">
        <h2 className="text-2xl font-semibold">Provider verification and capacity</h2>
        <div className="mt-4 grid gap-3">
          {SERVICES.map((service) => {
            const live = { ...service, ...board.serviceOverrides[service.id] };
            return (
              <div
                key={service.id}
                className="grid gap-3 rounded-2xl border border-pine/10 p-4 md:grid-cols-[1fr_auto_auto]"
              >
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-pine">{service.organisation}</p>
                </div>
                <select
                  className="rounded-full border border-pine/15 bg-sand px-3 py-1"
                  value={live.capacity}
                  onChange={(event) =>
                    updateService(service.id, {
                      capacity: event.target.value as typeof live.capacity,
                    })
                  }
                >
                  <option value="available">Available</option>
                  <option value="limited">Limited</option>
                  <option value="full">Full</option>
                </select>
                <select
                  className="rounded-full border border-pine/15 bg-sand px-3 py-1"
                  value={live.verification}
                  onChange={(event) =>
                    updateService(service.id, {
                      verification: event.target.value as typeof live.verification,
                    })
                  }
                >
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl bg-paper p-6 shadow-card">
        <h2 className="text-2xl font-semibold">Audit log</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {board.audit.slice(0, 20).map((event) => (
            <li key={event.id}>
              {new Date(event.at).toLocaleString("en-GB")} — {event.kind}: {event.detail}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-paper p-5 shadow-card">
      <p className="text-sm text-pine">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
