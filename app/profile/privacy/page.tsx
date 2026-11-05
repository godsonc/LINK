"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useProfile } from "@/components/useProfile";
import { setProfileFlash } from "@/lib/profile-flash";
import type { ProfileConsent } from "@/lib/profile";

export default function ProfilePrivacyPage() {
  const router = useRouter();
  const profile = useProfile();
  const [draft, setDraft] = useState<ProfileConsent | null>(null);

  if (!profile.ready) return <p className="text-muted">Loading your profile…</p>;
  if (profile.error) {
    return (
      <button type="button" className="font-semibold text-brand" onClick={profile.reload}>
        Try again
      </button>
    );
  }

  const consents = draft ?? profile.consents;

  function onSave() {
    profile.saveConsents(consents);
    setProfileFlash("Privacy choices saved.");
    router.push("/profile");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <p className="text-muted">
        Your information stays on this device unless you sign in, when your name
        is also stored on your account.
      </p>
      <label className="flex min-h-target items-start gap-3 rounded-card bg-paper p-4 shadow-card">
        <input
          type="checkbox"
          className="mt-1"
          checked={consents.navigator}
          onChange={(event) =>
            setDraft({ ...consents, navigator: event.target.checked })
          }
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
          checked={consents.reminders}
          onChange={(event) =>
            setDraft({ ...consents, reminders: event.target.checked })
          }
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
      <button
        type="button"
        className="min-h-target w-full rounded-full bg-brand px-4 font-semibold text-paper"
        onClick={onSave}
      >
        Save
      </button>
    </div>
  );
}
