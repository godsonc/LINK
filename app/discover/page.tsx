"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { localityFromPostcode } from "@/lib/localities";
import { useLink } from "@/lib/link-context";
import type { LocalityId } from "@/lib/types";

interface SpeechRecognitionLike {
  lang: string;
  start: () => void;
  onresult: ((event: {
    results: ArrayLike<ArrayLike<{ transcript: string }>>;
  }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

const TOPICS = [
  { label: "Benefits & money", phrase: "I need help with benefits and money" },
  { label: "Housing", phrase: "I need help with rent and housing" },
  { label: "Work & skills", phrase: "I need help with work and training" },
  { label: "Health & wellbeing", phrase: "I feel isolated and want local support" },
  { label: "Transport", phrase: "I need help with transport and travel" },
  { label: "Caring", phrase: "I am caring for someone" },
  { label: "Warm homes", phrase: "I can't afford my bills and heating" },
];

export default function DiscoverPage() {
  const router = useRouter();
  const {
    session,
    findPathway,
    acknowledgeSafeguarding,
  } = useLink();
  const [draft, setDraft] = useState(session.story);
  const [listening, setListening] = useState(false);
  const blocked =
    Boolean(session.safeguarding) && !session.safeguardingAcknowledged;

  function addTopic(phrase: string) {
    setDraft((current) =>
      current.includes(phrase)
        ? current
        : `${current}${current.trim() ? " " : ""}${phrase}.`,
    );
  }

  function startVoice() {
    const speechWindow = window as Window & {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const SpeechRecognition =
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-GB";
    recognition.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript ?? "";
      setDraft((current) => `${current} ${text}`.trim());
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  }

  function onFind() {
    const hinted = session.answers.localityHint as LocalityId | undefined;
    const fromPostcode = localityFromPostcode(session.answers.postcode ?? "");
    const locality = fromPostcode ?? hinted ?? session.locality;
    const needsSafety = findPathway(draft, locality);
    if (!needsSafety) router.push("/pathway");
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">How can we help today?</h2>
        <p className="mt-2 text-muted">
          Write in your own words, or tap a topic. We only ask what we need.
        </p>
      </div>

      {blocked ? (
        <section className="rounded-card bg-danger p-5 text-paper">
          <h3 className="text-lg font-semibold">If you are not safe right now</h3>
          <p className="mt-2 text-sm leading-relaxed">
            LINK cannot provide emergency help. If you or someone else is in
            danger, call 999. To talk now, Samaritans are on 116 123. For
            urgent health advice, call 111.
          </p>
          <button
            type="button"
            className="mt-4 min-h-target rounded-full bg-paper px-4 font-medium text-ink"
            onClick={acknowledgeSafeguarding}
          >
            I am safe to continue
          </button>
        </section>
      ) : null}

      <label className="block text-sm font-medium" htmlFor="story">
        Tell us what is happening
        <textarea
          id="story"
          className="mt-2 w-full rounded-card border border-line/20 bg-field p-4 text-base"
          rows={5}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="For example, I need help with rent and finding work."
        />
      </label>

      <div className="flex flex-wrap gap-2">
        {TOPICS.map((topic) => {
          const on = draft.includes(topic.phrase);
          return (
            <button
              key={topic.label}
              type="button"
              className={`min-h-11 rounded-full border px-3 text-sm font-medium ${
                on
                  ? "border-brand bg-brand text-paper"
                  : "border-line/20 bg-paper text-ink"
              }`}
              onClick={() => addTopic(topic.phrase)}
              aria-pressed={on}
            >
              {topic.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="text-sm font-medium text-brand"
        onClick={startVoice}
      >
        {listening ? "Listening…" : "Speak instead"}
      </button>

      <button
        type="button"
        className="min-h-target w-full rounded-full bg-brand px-4 font-semibold text-paper disabled:opacity-50"
        disabled={!draft.trim() || blocked}
        onClick={onFind}
      >
        Find my pathway
      </button>
    </div>
  );
}
