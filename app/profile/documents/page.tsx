"use client";

import { documentRecord } from "@/lib/profile";
import { useProfile } from "@/components/useProfile";

export default function DocumentsPage() {
  const profile = useProfile();

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
        Only the file name is kept, on this device. The file itself is not uploaded.
      </p>
      {profile.documents.length === 0 ? (
        <p className="rounded-card bg-paper p-4 text-muted shadow-card">
          No documents yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {profile.documents.map((document) => (
            <li
              key={document.id}
              className="flex items-center justify-between gap-3 rounded-card bg-paper p-4 shadow-card"
            >
              <span>
                <span className="block font-medium">{document.name}</span>
                <span className="block text-sm text-muted">
                  {new Date(document.addedAt).toLocaleDateString("en-GB")}
                </span>
              </span>
              <button
                type="button"
                className="text-sm font-semibold text-danger"
                onClick={() =>
                  profile.saveDocuments(
                    profile.documents.filter((item) => item.id !== document.id),
                  )
                }
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <label className="inline-flex min-h-target w-full cursor-pointer items-center justify-center rounded-full bg-brand px-4 font-semibold text-paper">
        Add a document
        <input
          type="file"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            profile.saveDocuments([documentRecord(file.name), ...profile.documents]);
            event.target.value = "";
          }}
        />
      </label>
    </div>
  );
}
