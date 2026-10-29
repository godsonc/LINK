"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLink } from "@/lib/link-context";

const EXAMPLES = [
  "I can't afford my bills.",
  "I look after my mother and I'm exhausted.",
  "I left college and don't know what to do.",
  "I've lost my job and I'm struggling to pay rent.",
  "I'm looking after my husband, I've reduced my working hours and we're struggling to pay our bills.",
];

export default function HomePage() {
  const router = useRouter();
  const { setStory, session } = useLink();

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-3xl bg-paper p-8 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">
          Lincolnshire pilot
        </p>
        <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-tight tracking-tight">
          Tell us what is happening. We will help you find the next best step.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-pine">
          You do not need to know which organisation, form or phone number to
          start with. LINK turns a situation into a local pathway — with a
          person available if technology is not enough.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/discover"
            className="rounded-full bg-pine px-6 py-3 font-medium text-sand"
          >
            Describe your situation
          </Link>
          <Link
            href="/help"
            className="rounded-full border border-pine/20 px-6 py-3 font-medium"
          >
            Speak to a Community Navigator
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-pine/20 px-6 py-3 font-medium"
          >
            Sign in / create account
          </Link>
        </div>
        <div className="mt-10">
          <p className="text-sm font-medium text-pine">Try an example</p>
          <div className="mt-3 flex flex-col gap-2">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                className="rounded-2xl border border-pine/10 bg-sand px-4 py-3 text-left hover:border-clay"
                onClick={() => {
                  setStory(example, session.locality);
                  router.push("/discover");
                }}
              >
                “{example}”
              </button>
            ))}
          </div>
        </div>
      </section>
      <aside className="space-y-4">
        <div className="rounded-3xl bg-pine p-6 text-sand">
          <h2 className="text-xl font-semibold">Need → Opportunity</h2>
          <ol className="mt-4 space-y-3 text-sand/90">
            <li>1. Describe what is happening in ordinary language.</li>
            <li>2. Confirm the areas we think you may need help with.</li>
            <li>3. Receive a ranked local pathway, not a directory dump.</li>
            <li>4. Take one next step — or ask a navigator to do it with you.</li>
          </ol>
        </div>
        <div className="rounded-3xl border border-pine/10 bg-paper p-6">
          <h2 className="text-xl font-semibold">This MVP proves</h2>
          <p className="mt-2 leading-relaxed">
            Can technology reduce the friction between a stated need and an
            appropriate local service? Recommendations only come from a verified
            demo catalogue. AI does not invent organisations.
          </p>
        </div>
      </aside>
    </div>
  );
}
