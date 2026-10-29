"use client";

import { useDisplayPrefs } from "@/lib/display-prefs";

export default function SettingsPage() {
  const { textSize, contrast, toggleTextSize, toggleContrast } =
    useDisplayPrefs();

  return (
    <article className="mx-auto max-w-3xl space-y-6 rounded-3xl bg-paper p-8 shadow-card">
      <header>
        <h1 className="text-4xl font-semibold">Settings</h1>
        <p className="mt-2 text-muted">
          Choose how LINK looks on this device.
        </p>
      </header>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="min-h-11 rounded-full border border-line/30 px-4 py-2 font-medium"
          onClick={toggleTextSize}
        >
          {textSize === "112%" ? "Larger text" : "Standard text"}
        </button>
        <button
          type="button"
          className="min-h-11 rounded-full border border-line/30 px-4 py-2 font-medium"
          onClick={toggleContrast}
        >
          {contrast ? "Standard contrast" : "High contrast"}
        </button>
      </div>
    </article>
  );
}
