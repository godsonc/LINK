"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const screens = [
  {
    id: "start",
    label: "Get Started",
    title: "LINK",
    sublabel: "Welcome",
    message: "Create your account",
    cta: "Create account",
    tone: "purple",
  },
  {
    id: "create-account",
    label: "Create Account",
    title: "Create your account",
    sublabel: "Let’s get started",
    message: "Enter your full name",
    cta: "Continue",
    tone: "neutral",
  },
  {
    id: "verify-email",
    label: "Verify Email",
    title: "Check your email",
    sublabel: "We’ve sent a verification link to",
    message: "yourname@example.com",
    cta: "Verify email",
    tone: "green",
  },
  {
    id: "email-success",
    label: "Account Created",
    title: "Your account is ready!",
    sublabel: "You can now sign in and start exploring",
    message: "Continue to sign in",
    cta: "Continue",
    tone: "green",
  },
  {
    id: "welcome",
    label: "Welcome",
    title: "Welcome to LINK!",
    sublabel: "Let’s personalise your experience",
    message: "Tell us about you",
    cta: "Continue",
    tone: "purple",
  },
] as const;

export default function AuthFlowPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeScreen = useMemo(() => screens[activeIndex], [activeIndex]);

  const goPrevious = () => setActiveIndex((value) => Math.max(0, value - 1));
  const goNext = () => setActiveIndex((value) => Math.min(screens.length - 1, value + 1));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 text-ink">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pine/80">
            Sign up / log in
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-pine">
            Screen-by-screen auth flow
          </h1>
        </div>
        <Link
          href="/"
          className="rounded-full border border-pine/20 bg-white px-4 py-2 text-sm font-medium text-pine transition hover:border-pine/40 hover:bg-sand"
        >
          Back to overview
        </Link>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {screens.map((screen, index) => (
          <button
            key={screen.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={[
              "rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition",
              index === activeIndex
                ? "border-pine bg-pine text-sand"
                : "border-pine/20 bg-white text-pine/80 hover:border-pine/40",
            ].join(" ")}
          >
            {screen.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-pine/10 bg-[#f7f4f1] p-4 shadow-card sm:p-6">
          <div className="mx-auto max-w-[360px] rounded-[26px] border border-black/5 bg-white p-3 shadow-[0_12px_25px_rgba(20,24,28,0.08)]">
            <div className="mb-3 flex items-center justify-between px-2 text-[10px] font-medium text-[#464c58]">
              <span>9:41</span>
              <span className="tracking-[0.2em]">◉◉◉</span>
            </div>

            <div className="rounded-[18px] border border-black/5 bg-[#f8f5f2] p-4">
              {activeScreen.title === "LINK" ? (
                <>
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <div className="relative h-6 w-6">
                      <span className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#5a68dc]" />
                      <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#49c9a7]" />
                      <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#f1ad5d]" />
                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-[#ed7f85]" />
                    </div>
                  </div>
                  <div className="text-center text-[2.2rem] font-extrabold tracking-[-0.08em] text-pine">
                    LINK
                  </div>
                  <div className="mt-3 text-center text-[11px] text-pine/75">
                    {activeScreen.sublabel}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-[1.1rem] font-semibold text-[#22262f]">
                    {activeScreen.title}
                  </h2>
                  <p className="mt-2 text-[11px] leading-5 text-slate-500">
                    {activeScreen.sublabel}
                  </p>
                </>
              )}

              <div className="mt-4 rounded-xl border border-black/5 bg-white px-3 py-3 text-[11px] text-slate-500 shadow-sm">
                {activeScreen.message}
              </div>

              <button
                type="button"
                className={[
                  "mt-4 w-full rounded-xl px-3 py-3 text-[11px] font-semibold text-white",
                  activeScreen.tone === "purple" && "bg-gradient-to-b from-[#4a3a66] to-[#2d2346]",
                  activeScreen.tone === "green" && "bg-gradient-to-b from-[#2d8b5b] to-[#1f7045]",
                  activeScreen.tone === "neutral" && "bg-gradient-to-b from-[#3d536d] to-[#2d4057]",
                ].join(" ")}
              >
                {activeScreen.cta}
              </button>

              {activeScreen.id === "email-success" || activeScreen.id === "welcome" ? (
                <div className="mt-4 flex justify-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-b from-[#31b86e] to-[#1c8b58] text-lg font-bold text-white shadow-sm">
                    ✓
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-[28px] border border-pine/10 bg-white/60 p-5 shadow-card">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-pine/80">
              Current screen
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-pine">
              {activeScreen.label}
            </h2>
          </div>

          <div className="rounded-2xl border border-pine/10 bg-sand p-4">
            <p className="text-sm font-medium text-pine">Why this works</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <li>• Clear hierarchy: primary action appears first.</li>
              <li>• Accessibility: large tap targets and high contrast.</li>
              <li>• Trust-building cues: inline validation and success states.</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={goPrevious}
              disabled={activeIndex === 0}
              className="flex-1 rounded-full border border-pine/20 bg-white px-4 py-2 text-sm font-medium text-pine disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={activeIndex === screens.length - 1}
              className="flex-1 rounded-full bg-pine px-4 py-2 text-sm font-medium text-sand disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
