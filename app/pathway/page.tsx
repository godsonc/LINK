"use client";

import Link from "next/link";
import { serviceById } from "@/lib/catalog";
import { NEED_COPY } from "@/lib/needs";
import { ServiceCard } from "@/components/ServiceCard";
import { useLink } from "@/lib/link-context";

export default function PathwayPage() {
  const { session } = useLink();
  const topMatches = session.matches
    .slice(0, 4)
    .map((match) => ({ match, service: serviceById(match.serviceId) }))
    .filter(
      (
        item,
      ): item is {
        match: (typeof session.matches)[number];
        service: NonNullable<ReturnType<typeof serviceById>>;
      } => Boolean(item.service),
    );

  if (!session.story) {
    return (
      <div className="rounded-3xl bg-paper p-8 shadow-card">
        <h1 className="text-3xl font-semibold">Your pathway will appear here</h1>
        <p className="mt-3 text-pine">
          Start by telling us what is happening. We only recommend verified
          services from the local directory.
        </p>
        <Link className="mt-4 inline-block text-clay" href="/discover">
          Describe your situation
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">
          Personalised pathway
        </p>
        <h1 className="mt-2 text-4xl font-semibold">Your recommended pathway</h1>
        <p className="mt-3 max-w-3xl text-lg text-pine">
          This is not a search result list. It is a sequence based on what you
          told us. Based on the information you provided, you may be eligible —
          organisations make the final decision.
        </p>
      </header>

      <ol className="grid gap-4">
        {session.pathway.map((step, index) => {
          const service = serviceById(step.serviceId);
          return (
            <li
              key={step.needId}
              className="rounded-3xl border border-pine/10 bg-paper p-6 shadow-card"
            >
              <p className="text-sm text-clay">Step {index + 1}</p>
              <h2 className="text-2xl font-semibold">
                {NEED_COPY[step.needId].pathwayTitle}
              </h2>
              <p className="mt-2 text-pine">{step.why}</p>
              {service ? (
                <p className="mt-2 font-medium">
                  Suggested: {service.name} — {service.organisation}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>

      <section>
        <h2 className="text-3xl font-semibold">Your next three steps</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {session.nextSteps.map((step, index) => (
            <article key={step.id} className="rounded-3xl bg-pine p-5 text-sand">
              <p className="text-sm text-wheat">Step {index + 1}</p>
              <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sand/90">{step.detail}</p>
              {step.serviceId ? (
                <Link
                  className="mt-4 inline-block underline"
                  href={`/services/${step.serviceId}`}
                >
                  Open this option
                </Link>
              ) : (
                <Link className="mt-4 inline-block underline" href="/help">
                  Connect with a navigator
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Best matches</h2>
        {topMatches.map(({ service, match }) => (
          <ServiceCard key={service.id} service={service} match={match} />
        ))}
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          className="rounded-full bg-clay px-5 py-3 font-medium text-paper"
          href="/help"
        >
          Need someone to help?
        </Link>
        <Link
          className="rounded-full border border-pine/20 px-5 py-3"
          href="/follow-up"
        >
          Later: tell us if you got the help
        </Link>
      </div>
    </div>
  );
}
