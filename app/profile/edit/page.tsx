"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useProfile } from "@/components/useProfile";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import type { ProfileDetails } from "@/lib/profile";

export default function EditProfilePage() {
  const { user } = useAuth();
  const profile = useProfile();
  const [draft, setDraft] = useState<ProfileDetails | null>(null);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState("");

  if (!profile.ready) {
    return <p className="text-muted">Loading your profile…</p>;
  }
  if (profile.error) {
    return <ProfileLoadError onRetry={profile.reload} />;
  }

  const form = draft ?? {
    ...profile.details,
    fullName: profile.details.fullName || user?.fullName || "",
    email: profile.details.email || user?.email || "",
  };

  function update(field: keyof ProfileDetails, value: string) {
    setSaved(false);
    setNotice("");
    setDraft({ ...form, [field]: value });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    profile.saveDetails(form);
    setSaved(true);
    if (!user) {
      setNotice("Saved on this device.");
      return;
    }
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: form.fullName.trim() },
      });
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: form.fullName.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (authError || profileError) {
        setNotice("Saved on this device. The account name could not be updated.");
        return;
      }
      setNotice("Saved on this device and on your account.");
    } catch {
      setNotice("Saved on this device. The account name could not be updated.");
    }
  }

  function onPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      update("avatarDataUrl", reader.result);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="flex items-center gap-4">
        {form.avatarDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={form.avatarDataUrl}
            alt=""
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-xl font-semibold text-paper">
            {(form.fullName || "?").charAt(0).toUpperCase()}
          </span>
        )}
        <label className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line/30 px-4 text-sm font-semibold">
          Change photo
          <input type="file" accept="image/*" className="sr-only" onChange={onPhotoChange} />
        </label>
      </div>
      <p className="text-muted">
        Name, phone and address help us reach you. Email comes from your sign-in.
        Photos stay on this device only.
      </p>
      {saved && notice ? (
        <p className="rounded-card bg-success/15 p-3 text-sm">{notice}</p>
      ) : null}
      <Field label="Full name" value={form.fullName} onChange={(value) => update("fullName", value)} />
      <Field
        label="Date of birth"
        type="date"
        value={form.dateOfBirth}
        onChange={(value) => update("dateOfBirth", value)}
      />
      <label className="block text-sm font-medium">
        Address
        <textarea
          className="mt-2 w-full rounded-card border border-line/20 bg-field p-3"
          rows={3}
          value={form.address}
          onChange={(event) => update("address", event.target.value)}
        />
      </label>
      <Field label="Phone" type="tel" value={form.phone} onChange={(value) => update("phone", value)} />
      <Field
        label="Email"
        type="email"
        value={form.email}
        onChange={(value) => update("email", value)}
        readOnly={Boolean(user?.email)}
      />
      <button
        type="submit"
        className="min-h-target w-full rounded-full bg-brand px-4 font-semibold text-paper"
      >
        Save
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        type={type}
        readOnly={readOnly}
        className="mt-2 min-h-target w-full rounded-2xl border border-line/20 bg-field px-4 read-only:text-muted"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function ProfileLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-muted">We couldn’t load your profile.</p>
      <button
        type="button"
        className="min-h-target rounded-full bg-brand px-4 font-semibold text-paper"
        onClick={onRetry}
      >
        Try again
      </button>
    </div>
  );
}
