import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center px-6 py-8 text-center">
      <LinkMark />
      <p className="mt-6 text-sm font-medium text-muted">
        Lincolnshire Inclusion &amp; Navigation Network
      </p>
      <h1 className="mt-6 text-5xl font-semibold tracking-tight">LINK</h1>
      <p className="mt-2 text-lg text-ink">From need to opportunity.</p>
      <p className="mt-3 max-w-xs leading-relaxed text-muted">
        We help you find local support, services and opportunities.
      </p>
      <Link
        href="/who"
        className="mt-8 flex min-h-target w-full items-center justify-center rounded-full bg-brand px-6 font-medium text-paper"
      >
        Get started
      </Link>
      <Link
        href="/login/sign-in"
        className="mt-5 min-h-target px-4 py-3 font-medium text-muted"
      >
        I already have an account
      </Link>
      <Link
        href="/login/guest"
        className="min-h-target px-4 py-3 text-sm font-medium text-brand"
      >
        Continue as guest
      </Link>
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
