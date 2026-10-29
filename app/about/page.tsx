"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { localityFromPostcode } from "@/lib/localities";
import { useLink } from "@/lib/link-context";

const AGES = ["Under 18", "18–24", "25–34", "35–49", "50–64", "65+"];
const SITUATIONS = [
  "Looking for work",
  "Caring for someone",
  "Managing money",
  "Settling into the area",
  "Something else",
];
const ACCESS = [
  "No extra requirements",
  "Step-free access",
  "Phone or online only",
  "British Sign Language",
  "Easy read",
];

export default function AboutPage() {
  const router = useRouter();
  const { session, answerQuestions } = useLink();
  const [postcode, setPostcode] = useState(session.answers.postcode ?? "");
  const [age, setAge] = useState(session.answers.age ?? "");
  const [situation, setSituation] = useState(session.answers.situation ?? "");
  const [access, setAccess] = useState(session.answers.access ?? "");
  const canContinue = postcode.trim().length >= 5 && age && situation && access;

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!canContinue) return;
        const locality = localityFromPostcode(postcode);
        answerQuestions({
          postcode: postcode.trim().toUpperCase(),
          age,
          situation,
          access,
          ...(locality ? { localityHint: locality } : {}),
        });
        router.push("/discover");
      }}
    >
      <div>
        <h2 className="text-2xl font-semibold">Tell us about you</h2>
        <p className="mt-2 text-muted">
          This stays on this device and helps us suggest local options.
        </p>
      </div>
      <label className="block text-sm font-medium">
        Postcode
        <input
          className="mt-2 min-h-target w-full rounded-2xl border border-line/20 bg-field px-4"
          value={postcode}
          onChange={(event) => setPostcode(event.target.value)}
          autoComplete="postal-code"
          placeholder="LN1 1AA"
          required
        />
      </label>
      <Field label="Age range" value={age} options={AGES} onChange={setAge} />
      <Field
        label="What best describes your situation?"
        value={situation}
        options={SITUATIONS}
        onChange={setSituation}
      />
      <Field
        label="Anything that would help you take part?"
        value={access}
        options={ACCESS}
        onChange={setAccess}
      />
      <button
        type="submit"
        className="min-h-target w-full rounded-full bg-brand px-4 font-semibold text-paper disabled:opacity-50"
        disabled={!canContinue}
      >
        Continue
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <select
        className="mt-2 min-h-target w-full rounded-2xl border border-line/20 bg-field px-4"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      >
        <option value="">Choose one</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
