"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/lib/auth-context";

const TABS = [
  { href: "/", label: "Home" },
  { href: "/pathway", label: "Pathways" },
  { href: "/messages", label: "Messages" },
  { href: "/bookings", label: "Bookings" },
  { href: "/profile", label: "Profile" },
] as const;

function titleFor(pathname: string) {
  if (pathname === "/") return "Home";
  if (pathname.startsWith("/services/")) return "Opportunity";
  if (pathname.startsWith("/pathway")) return "Your pathway";
  if (pathname.startsWith("/messages/")) return "Message";
  if (pathname.startsWith("/messages")) return "Messages";
  if (pathname.startsWith("/bookings/new")) return "Book appointment";
  if (pathname.startsWith("/bookings/")) return "Appointment";
  if (pathname.startsWith("/bookings")) return "Bookings";
  if (pathname.startsWith("/profile/edit")) return "Personal information";
  if (pathname.startsWith("/profile/preferences")) return "Preferences";
  if (pathname.startsWith("/profile/activity")) return "Activity";
  if (pathname.startsWith("/profile/documents")) return "Documents";
  if (pathname.startsWith("/profile/security")) return "Account & security";
  if (pathname.startsWith("/profile/privacy")) return "Privacy & consent";
  if (pathname.startsWith("/profile/help")) return "Help & support";
  if (pathname.startsWith("/profile")) return "Profile";
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/who")) return "Who is this for?";
  if (pathname.startsWith("/about")) return "About you";
  if (pathname.startsWith("/discover")) return "How can we help?";
  if (pathname.startsWith("/help")) return "Assisted access";
  if (pathname.startsWith("/saved")) return "Saved items";
  if (pathname.startsWith("/feedback")) return "Feedback";
  if (pathname.startsWith("/follow-up")) return "Follow up";
  if (pathname.startsWith("/privacy")) return "Privacy";
  if (pathname.startsWith("/admin")) return "Navigator";
  return "LINK";
}

function tabActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Wider reading column on large screens (sidebar layout). */
function mainColumnMaxClass(pathname: string): string {
  const wide =
    pathname === "/" ||
    pathname.startsWith("/pathway") ||
    pathname.startsWith("/messages") ||
    pathname.startsWith("/bookings") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/discover") ||
    pathname.startsWith("/services/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/saved") ||
    pathname.startsWith("/follow-up");

  if (wide) {
    return "mx-auto w-full min-w-0 max-w-4xl lg:max-w-5xl";
  }
  return "mx-auto w-full min-w-0 max-w-3xl lg:max-w-4xl";
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isGuest } = useAuth();
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/auth");
  const showChrome = !isAuthRoute;
  const isTabRoot = TABS.some((tab) => tab.href === pathname);
  const showAccountMenu = Boolean(user) || isGuest;

  return (
    <div
      className={`flex flex-col bg-canvas text-ink ${
        showChrome
          ? "mx-auto h-dvh min-h-0 w-full max-w-md lg:mx-0 lg:max-w-none"
          : "min-h-screen min-w-0"
      }`}
    >
      <a
        href="#main"
        className="skip-link absolute left-4 z-50 rounded-full bg-brand px-4 py-2 text-paper"
      >
        Skip to content
      </a>
      {showChrome ? (
        <div className="flex min-h-0 flex-1 flex-col lg:min-h-0 lg:flex-row lg:overflow-hidden">
          <aside
            className="hidden shrink-0 border-line/10 bg-paper lg:flex lg:h-dvh lg:w-52 lg:flex-col lg:border-r xl:w-60"
            aria-label="Main"
          >
            <nav className="flex flex-col gap-1 p-3 pt-4">
              {TABS.map((tab) => {
                const active = tabActive(pathname, tab.href);
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`flex min-h-target items-center gap-3 rounded-2xl px-3 text-sm font-medium ${
                      active
                        ? "bg-brand/10 text-brand"
                        : "text-muted hover:bg-field"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <TabIcon name={tab.label} />
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <header className="shrink-0 border-b border-line/10 bg-paper">
              <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-3 sm:px-4 lg:max-w-none lg:px-6">
                {isTabRoot ? (
                  <span className="w-11" aria-hidden />
                ) : (
                  <button
                    type="button"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl text-brand"
                    onClick={() => router.back()}
                    aria-label="Go back"
                  >
                    ‹
                  </button>
                )}
                <h1 className="min-w-0 flex-1 truncate text-center text-base font-semibold sm:text-lg">
                  {titleFor(pathname)}
                </h1>
                {showAccountMenu ? <UserMenu /> : <span className="w-11" aria-hidden />}
              </div>
            </header>
            <main
              id="main"
              className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8 xl:px-10"
            >
              <div className={mainColumnMaxClass(pathname)}>{children}</div>
            </main>
            <nav
              className="shrink-0 border-t border-line/10 bg-paper lg:hidden"
              aria-label="Main"
            >
              <ul className="grid grid-cols-5">
                {TABS.map((tab) => {
                  const active = tabActive(pathname, tab.href);
                  return (
                    <li key={tab.href}>
                      <Link
                        href={tab.href}
                        className={`flex min-h-target flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
                          active ? "text-brand" : "text-muted"
                        }`}
                        aria-current={active ? "page" : undefined}
                      >
                        <TabIcon name={tab.label} />
                        {tab.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      ) : (
        <main
          id="main"
          className="flex min-h-screen flex-1 items-center justify-center px-4 py-8 sm:px-6"
        >
          {children}
        </main>
      )}
    </div>
  );
}

function TabIcon({ name }: { name: string }) {
  const common = "h-5 w-5 shrink-0";
  if (name === "Home") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }
  if (name === "Pathways") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7 4v16M17 4v16M7 8h10M7 16h10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (name === "Messages") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 6h14v9H8l-3 3V6Z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  if (name === "Bookings") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
          x="4"
          y="5"
          width="16"
          height="15"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8 3v4M16 3v4M4 10h16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5.5 19c1.4-3 3.6-4.5 6.5-4.5s5.1 1.5 6.5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
