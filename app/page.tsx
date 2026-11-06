import { HomeActions } from "@/components/HomeActions";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-8 text-center sm:px-6 sm:py-10 md:max-w-xl md:py-12">
      <LinkMark />
      <p className="mt-6 text-sm font-medium text-muted">
        Lincolnshire Inclusion &amp; Navigation Network
      </p>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
        LINK
      </h1>
      <p className="mt-2 text-base text-ink sm:text-lg md:text-xl">
        From need to opportunity.
      </p>
      <p className="mt-3 max-w-md leading-relaxed text-muted sm:max-w-lg">
        We help you find local support, services and opportunities.
      </p>
      <HomeActions />
    </div>
  );
}

function LinkMark() {
  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28" aria-hidden>
      <circle cx="28" cy="78" r="10" fill="#2F6FED" />
      <circle cx="46" cy="42" r="9" fill="#16A34A" />
      <circle cx="72" cy="28" r="11" fill="#5B2A86" />
      <circle cx="92" cy="58" r="8" fill="#E07A2F" />
      <circle cx="78" cy="88" r="9" fill="#DB2777" />
      <path
        d="M28 78 L46 42 L72 28 L92 58 L78 88 L46 42"
        fill="none"
        stroke="#5B2A86"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
