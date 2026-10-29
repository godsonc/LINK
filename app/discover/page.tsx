"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { questionsForNeeds } from "@/lib/questions";
import { LOCALITIES } from "@/lib/localities";
import { NEED_COPY, NEED_ORDER } from "@/lib/needs";
import { useLink } from "@/lib/link-context";
import type { NeedId } from "@/lib/types";

export default function DiscoverPage() {
  const router = useRouter();
  const {
    session,
    setStory,
    answerQuestion,
    toggleNeed,
    confirmNeeds,
    acknowledgeSafeguarding,
  } = useLink();
  const [draft, setDraft] = useState(session.story);
  const [locality, setLocality] = useState(session.locality);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    setDraft(session.story);
    setLocality(session.locality);
  }, [session.locality, session.story]);

  const questions = useMemo(
    () => questionsForNeeds(session.selectedNeeds),
    [session.selectedNeeds],
  );

  function startVoice() {
    const SpeechCtor = (
      window as Window & {
        webkitSpeechRecognition?: new () => {
          lang: string;
          start: () => void;
          onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
          onend: (() => void) | null;
        };
        SpeechRecognition?: new () => {
          lang: string;
          start: () => void;
          onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
          onend: (() => void) | null;
        };
      }
    ).webkitSpeechRecognition ||
      (window as Window & { SpeechRecognition?: new () => never }).SpeechRecognition;
    if (!SpeechCtor) return;
    const recognition = new SpeechCtor();
    recognition.lang = "en-GB";
    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setDraft((current) => (current ? `${current} ${text}` : text));
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  }

  const classified = session.classified.length > 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
          Needs discovery
        </p>
        <h1 className="mt-2 text-4xl font-semibold">What can we help you with?</h1>
        <p className="mt-3 text-lg text-muted">
          Write in your own words. There is no wrong door. We only ask a few
          follow-up questions based on what you tell us.
        </p>
      </header>

      {session.safeguarding ? (
        <section className="rounded-3xl bg-danger p-6 text-paper">
          <h2 className="text-2xl font-semibold">If you are not safe right now</h2>
          <p className="mt-2 leading-relaxed">
            LINK cannot provide emergency help. If you or someone else is in
            danger, call 999. If you need to talk now, Samaritans are available
            on 116 123. For urgent health advice, call 111.
          </p>
          <button
            type="button"
            className="mt-4 rounded-full bg-paper px-4 py-2 font-medium text-ink"
            onClick={acknowledgeSafeguarding}
          >
            I am safe to continue
          </button>
        </section>
      ) : null}

      <section className="rounded-3xl bg-paper p-6 shadow-card">
        <label className="block text-sm font-medium" htmlFor="story">
          Tell us what is happening
        </label>
        <textarea
          id="story"
          className="mt-2 w-full rounded-2xl border border-line/20 bg-field p-4 text-lg"
          rows={6}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Roughly where are you?
            <select
              className="mt-2 w-full rounded-full border border-line/20 bg-field px-4 py-2"
              value={locality}
              onChange={(event) =>
                setLocality(event.target.value as typeof locality)
              }
            >
              {LOCALITIES.filter((item) => item.id !== "online").map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.district})
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end gap-2">
            <button
              type="button"
              className="rounded-full border border-line/30 px-4 py-2"
              onClick={startVoice}
            >
              {listening ? "Listening…" : "Speak instead"}
            </button>
            <button
              type="button"
              className="rounded-full bg-brand px-4 py-2 font-medium text-paper"
              onClick={() => setStory(draft, locality)}
              disabled={!draft.trim() || (session.safeguarding && !session.safeguardingAcknowledged)}
            >
              Continue
            </button>
          </div>
        </div>
      </section>

      {classified ? (
        <>
          <section className="rounded-3xl bg-paper p-6 shadow-card">
            <h2 className="text-2xl font-semibold">
              We think you may need help with
            </h2>
            <p className="mt-2 text-muted">
              Untick anything that is not relevant. You can add another area.
            </p>
            <div className="mt-4 grid gap-2">
              {NEED_ORDER.map((id: NeedId) => {
                const found = session.classified.find((need) => need.id === id);
                const checked = session.selectedNeeds.includes(id);
                return (
                  <label
                    key={id}
                    className="flex items-start gap-3 rounded-2xl border border-line/15 p-3"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleNeed(id)}
                      className="mt-1"
                    />
                    <span>
                      <span className="block font-medium">{NEED_COPY[id].label}</span>
                      {found ? (
                        <span className="block text-sm text-muted">{found.reason}</span>
                      ) : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl bg-paper p-6 shadow-card">
            <h2 className="text-2xl font-semibold">A few questions, not forty</h2>
            <div className="mt-4 space-y-5">
              {questions.map((question) => (
                <fieldset key={question.id}>
                  <legend className="font-medium">{question.prompt}</legend>
                  <div className="mt-2 flex flex-col gap-2">
                    {question.options.map((option) => (
                      <label key={option.value} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={question.id}
                          value={option.value}
                          checked={session.answers[question.id] === option.value}
                          onChange={() => answerQuestion(question.id, option.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
            <button
              type="button"
              className="mt-6 rounded-full bg-brand px-5 py-3 font-medium text-paper"
              onClick={() => {
                confirmNeeds();
                router.push("/pathway");
              }}
              disabled={session.selectedNeeds.length === 0}
            >
              Create my pathway
            </button>
          </section>
        </>
      ) : null}
    </div>
  );
}