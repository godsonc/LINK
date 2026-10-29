"use client";

import Link from "next/link";
import { useDisplayPrefs } from "@/lib/display-prefs";

export default function SettingsPage() {
  const { textSize, contrast, toggleTextSize, toggleContrast } =
    useDisplayPrefs();

  return (
    <div className="space-y-4">
      <p className="text-muted">How LINK looks on this device.</p>
      <ul className="overflow-hidden rounded-card bg-paper shadow-card">
        <li className="border-b border-line/10">
          <button
            type="button"
            className="flex min-h-target w-full items-center justify-between px-4 text-left"
            onClick={toggleTextSize}
          >
            <span className="font-medium">Text size</span>
            <span className="text-sm text-muted">
              {textSize === "112%" ? "Larger" : "Standard"}
            </span>
          </button>
        </li>
        <li className="border-b border-line/10">
          <button
            type="button"
            className="flex min-h-target w-full items-center justify-between px-4 text-left"
            onClick={toggleContrast}
          >
            <span className="font-medium">Contrast</span>
            <span className="text-sm text-muted">
              {contrast ? "High" : "Standard"}
            </span>
          </button>
        </li>
        <li className="border-b border-line/10">
          <div className="flex min-h-target items-center justify-between px-4">
            <span className="font-medium">Language</span>
            <span className="text-sm text-muted">English</span>
          </div>
        </li>
        <li>
          <Link href="/privacy" className="flex min-h-target items-center px-4 font-medium">
            Privacy
          </Link>
        </li>
      </ul>
    </div>
  );
}
