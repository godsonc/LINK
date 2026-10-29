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
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pine text-sand">
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
          <span className="block text-sm text-pine/80">
            Lincolnshire Inclusion &amp; Navigation Network
          </span>
        </span>
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {subtitle ? (
        <p className="mt-2 text-base leading-relaxed text-pine">{subtitle}</p>
      ) : null}
      <div className="mt-6">{children}</div>
      {footer ? <div className="mt-6 text-sm text-pine">{footer}</div> : null}
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
        className="min-h-11 w-full rounded-2xl border border-pine/15 bg-sand px-4 py-2.5 outline-none placeholder:text-pine/50"
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-clay" role="alert">
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
      className="min-h-11 w-full rounded-full bg-pine px-5 py-3 font-medium text-sand disabled:opacity-60"
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
      className="min-h-11 w-full rounded-full border border-pine/20 px-5 py-3 font-medium"
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
    <Link href={href} className="font-medium text-pine underline-offset-4 hover:underline">
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
          ? "border-clay/40 bg-clay/10 text-clay"
          : "border-pine/15 bg-moss/10 text-pine"
      }`}
    >
      <p className="font-semibold">{title}</p>
      {children ? <p className="mt-1">{children}</p> : null}
    </div>
  );
}
