"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [textSize, setTextSize] = useState("112%");
  const [contrast, setContrast] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-size", textSize);
    document.documentElement.dataset.contrast = contrast ? "high" : "normal";
  }, [contrast, textSize]);

  return (
    <div className="min-h-screen text-ink">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="border-b border-pine/15 bg-paper/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pine text-sand">
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
                From need to opportunity
              </span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
            <Link className={navClass(pathname, "/")} href="/">
              Home
            </Link>
            <Link className={navClass(pathname, "/discover")} href="/discover">
              Get help
            </Link>
            <Link className={navClass(pathname, "/help")} href="/help">
              Navigator
            </Link>
            <Link className={navClass(pathname, "/admin")} href="/admin">
              Admin
            </Link>
            <Link className={navClass(pathname, "/privacy")} href="/privacy">
              Privacy
            </Link>
          </nav>
          <div className="flex items-center gap-2 text-sm">
            <button
              className="rounded-full border border-pine/20 px-3 py-1"
              type="button"
              onClick={() =>
                setTextSize((size) => (size === "112%" ? "128%" : "112%"))
              }
            >
              {textSize === "112%" ? "Larger text" : "Standard text"}
            </button>
            <button
              className="rounded-full border border-pine/20 px-3 py-1"
              type="button"
              onClick={() => setContrast((value) => !value)}
            >
              {contrast ? "Standard contrast" : "High contrast"}
            </button>
          </div>
        </div>
      </header>
      <div className="bg-clay text-paper">
        <p className="mx-auto max-w-6xl px-4 py-2 text-sm">
          If you or someone else is in immediate danger, call 999. LINK is not an
          emergency or statutory service.
        </p>
      </div>
      <main id="main" className="mx-auto max-w-6xl px-4 py-10">
        {children}
      </main>
      <footer className="border-t border-pine/15 bg-paper/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-pine sm:flex-row sm:justify-between">
          <p>
            LINK is a Community Interest Company concept for Lincolnshire. This
            MVP uses a verified demo directory — recommendations never invent
            services.
          </p>
          <p>
            Samaritans: 116 123 · NHS: 111 · Adult care information remains with
            Lincolnshire County Council.
          </p>
        </div>
      </footer>
    </div>
  );
}

function navClass(pathname: string, href: string) {
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return active ? "text-clay" : "text-pine hover:text-clay";
}
