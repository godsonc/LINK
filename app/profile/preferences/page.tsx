"use client";

import Link from "next/link";
import { useState } from "react";
import { useProfile } from "@/components/useProfile";
import { useDisplayPrefs } from "@/lib/display-prefs";
import type { ProfilePreferences } from "@/lib/profile";

export default function PreferencesPage() {
  const profile = useProfile();
  const { textSize, setLargeText } = useDisplayPrefs();
  const [saved, setSaved] = useState(false);

  if (!profile.ready) return <p className="text-muted">Loading your profile…</p>;
  if (profile.error) {
    return (
      <button type="button" className="font-semibold text-brand" onClick={profile.reload}>
        Try again
      </button>
    );
  }

  const prefs: ProfilePreferences = {
    ...profile.preferences,
    largePrint: textSize === "128%",
  };

  function update(next: ProfilePreferences) {
    setSaved(false);
    if (next.largePrint !== prefs.largePrint) setLargeText(next.largePrint);
    profile.savePreferences(next);
    setSaved(true);
  }

  return (
    <div className="space-y-5">
      <p className="text-muted">How you’d like LINK to contact you, and what helps you take part.</p>
      {saved ? <p className="text-sm text-success">Saved on this device.</p> : null}
      <fieldset className="space-y-2">
        <legend className="font-semibold">Communication</legend>
        <Check
          label="Email"
          checked={prefs.email}
          onChange={(email) => update({ ...prefs, email })}
        />
        <Check
          label="Text message"
          checked={prefs.sms}
          onChange={(sms) => update({ ...prefs, sms })}
        />
        <Check
          label="Phone call"
          checked={prefs.phone}
          onChange={(phone) => update({ ...prefs, phone })}
        />
        <Check
          label="Post"
          checked={prefs.post}
          onChange={(post) => update({ ...prefs, post })}
        />
      </fieldset>
      <label className="block text-sm font-medium">
        Language
        <select
          className="mt-2 min-h-target w-full rounded-2xl border border-line/20 bg-field px-4"
          value={prefs.language}
          onChange={(event) => update({ ...prefs, language: event.target.value })}
        >
          <option>English</option>
        </select>
      </label>
      <fieldset className="space-y-2">
        <legend className="font-semibold">Access needs</legend>
        <Check
          label="Large print"
          checked={prefs.largePrint}
          onChange={(largePrint) => update({ ...prefs, largePrint })}
        />
        <Check
          label="Easy read"
          checked={prefs.easyRead}
          onChange={(easyRead) => update({ ...prefs, easyRead })}
        />
        <Check
          label="Hearing support"
          checked={prefs.hearing}
          onChange={(hearing) => update({ ...prefs, hearing })}
        />
      </fieldset>
      <p className="text-sm text-muted">
        Large print changes text size straight away. Easy read and hearing support
        are kept for a navigator. Contrast stays in{" "}
        <Link href="/settings" className="font-medium text-brand">
          settings
        </Link>
        .
      </p>
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-target items-center gap-3 rounded-2xl bg-paper px-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
