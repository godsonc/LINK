"use client";

import Link from "next/link";
import { useState } from "react";
import { useProfile } from "@/components/useProfile";

export default function ProfilePrivacyPage() {
  const profile = useProfile();
  const [saved, setSaved] = useState(false);

  if (!profile.ready) return <p className="text-muted">Loading your profile…</p>;
  if (profile.error) {
    return (
      <button type="button" className="font-semibold text-brand" onClick={profile.reload}>
        Try again
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-muted">
        Your information stays on this device unless you sign in, when your name
        is also stored on your account.
      </p>
      {saved ? <p className="text-sm text-success">Saved on this device.</p> : null}
      <label className="flex min-h-target items-start gap-3 rounded-card bg-paper p-4 shadow-card">
        <input
          type="checkbox"
          className="mt-1"
          checked={profile.consents.navigator}
          onChange={(event) => {
            profile.saveConsents({
              ...profile.consents,
              navigator: event.target.checked,
            });
            setSaved(true);
          }}
        />
        <span>
          <span className="block font-medium">A navigator may see my pathway</span>
          <span className="block text-sm text-muted">
            Only if you ask for help. This choice is saved here.
          </span>
        </span>
      </label>
      <label className="flex min-h-target items-start gap-3 rounded-card bg-paper p-4 shadow-card">
        <input
          type="checkbox"
          className="mt-1"
          checked={profile.consents.reminders}
          onChange={(event) => {
            profile.saveConsents({
              ...profile.consents,
              reminders: event.target.checked,
            });
            setSaved(true);
          }}
        />
        <span>
          <span className="block font-medium">Appointment reminders</span>
          <span className="block text-sm text-muted">
            Shown in LINK on this device the day before and on the day.
          </span>
        </span>
      </label>
      <Link href="/privacy" className="inline-flex font-medium text-brand">
        Read the privacy notice
      </Link>
    </div>
  );
}
