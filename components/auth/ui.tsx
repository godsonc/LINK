import Link from "next/link";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-md rounded-[2rem] bg-paper p-7 shadow-card">
      <Link href="/login" className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-paper">
          <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden>
            <path
              d="M6 22c6-2 8-12 20-12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <circle cx="8" cy="22" r="2.2" fill="currentColor" />
            <circle cx="16" cy="14" r="2.2" fill="currentColor" />
            <circle cx="26" cy="10" r="2.2" fill="currentColor" />
          </svg>
        </span>
        <span>
          <span className="block text-lg font-semibold tracking-tight">LINK</span>
          <span className="block text-sm text-muted">
            Lincolnshire Inclusion &amp; Navigation Network
          </span>
        </span>
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {subtitle ? (
        <p className="mt-2 text-base leading-relaxed text-muted">{subtitle}</p>
      ) : null}
      <div className="mt-6">{children}</div>
      {footer ? <div className="mt-6 text-sm text-muted">{footer}</div> : null}
    </div>
  );
}

export function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
      {children}
    </label>
  );
}

export function TextField({
  id,
  label,
  error,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  error?: string;
}) {
  const describedBy = error ? `${id}-error` : undefined;
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className="min-h-target w-full rounded-2xl border border-line/20 bg-field px-4 py-2.5 outline-none placeholder:text-muted/60"
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      className="min-h-target w-full rounded-full bg-brand px-5 py-3 font-medium text-paper disabled:opacity-60"
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="min-h-target w-full rounded-full border border-line/30 px-5 py-3 font-medium"
      {...props}
    >
      {children}
    </button>
  );
}

export function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="font-medium text-muted underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}

export function Banner({
  tone,
  title,
  children,
}: {
  tone: "error" | "info";
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      role="alert"
      className={`rounded-2xl border px-4 py-3 text-sm ${
        tone === "error"
          ? "border-danger/40 bg-danger/15 text-danger"
          : "border-line/20 bg-success/15 text-muted"
      }`}
    >
      <p className="font-semibold">{title}</p>
      {children ? <p className="mt-1">{children}</p> : null}
    </div>
  );
}
