"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Tone = "purple" | "green" | "neutral" | "danger";
type Flow = "signup" | "login" | "alternative" | "states";

type Screen = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  helper?: string;
  action: string;
  tone: Tone;
  icon?: "logo" | "check" | "lock" | "person" | "party" | "error";
  fields?: string[];
  links?: string[];
};

const flows: Record<Exclude<Flow, "states">, Screen[]> = {
  signup: [
    {
      id: "signup-start",
      label: "Get Started",
      title: "LINK",
      subtitle: "Welcome",
      helper: "Create an account to start finding support and opportunities.",
      action: "Create account",
      tone: "purple",
      icon: "logo",
      links: ["Sign in", "Continue as guest"],
    },
    {
      id: "signup-account",
      label: "Create Account",
      title: "Create your account",
      subtitle: "Let’s get started",
      action: "Create account",
      tone: "purple",
      fields: ["Full name", "Email address", "Create password", "Confirm password"],
      links: ["Agree to the Terms of Use and Privacy Policy"],
    },
    {
      id: "signup-verify",
      label: "Verify Email",
      title: "Check your email",
      subtitle: "We’ve sent a verification link to",
      helper: "Click the link in the email to verify your account.",
      action: "Resend email",
      tone: "green",
      icon: "person",
      links: ["Change email address"],
    },
    {
      id: "signup-created",
      label: "Account Created",
      title: "Your account is ready!",
      subtitle: "You can now sign in and start exploring support and opportunities.",
      action: "Continue to sign in",
      tone: "green",
      icon: "check",
    },
    {
      id: "signup-welcome",
      label: "Welcome",
      title: "Welcome to LINK!",
      subtitle: "Let’s personalise your experience.",
      action: "Tell us about you",
      tone: "purple",
      icon: "party",
      links: ["I’ll do this later"],
    },
  ],
  login: [
    {
      id: "login",
      label: "Sign In",
      title: "Sign in",
      subtitle: "Welcome back! Please sign in to continue.",
      action: "Sign in",
      tone: "purple",
      icon: "logo",
      fields: ["Email or phone", "Your password"],
      links: ["Forgot password?", "or continue with", "Google", "Apple", "Don’t have an account? Sign up"],
    },
    {
      id: "logged-in",
      label: "Logged In",
      title: "Welcome back!",
      subtitle: "You’ve successfully signed in.",
      action: "Continue",
      tone: "green",
      icon: "check",
    },
    {
      id: "forgot-password",
      label: "Forgot Password",
      title: "Forgot password?",
      subtitle: "Enter your email address and we’ll send you a reset link.",
      action: "Send reset link",
      tone: "purple",
      fields: ["Email address"],
      links: ["Back to sign in"],
    },
    {
      id: "reset-password",
      label: "Reset Password",
      title: "Create new password",
      subtitle: "Choose a new password for your account.",
      action: "Reset password",
      tone: "purple",
      fields: ["New password", "Confirm new password"],
      links: ["At least 8 characters", "Include uppercase letter", "Include lowercase letter", "Include number or symbol"],
    },
    {
      id: "reset-success",
      label: "Password Reset Success",
      title: "Password reset successful",
      subtitle: "You can now sign in with your new password.",
      action: "Go to sign in",
      tone: "green",
      icon: "lock",
    },
  ],
  alternative: [
    {
      id: "phone-signup",
      label: "Sign Up with Phone",
      title: "Create your account",
      subtitle: "Enter your mobile number and we’ll send you a verification code.",
      action: "Send code",
      tone: "purple",
      fields: ["Mobile number"],
      links: ["Use email instead"],
    },
    {
      id: "phone-verify",
      label: "Verify Phone Code",
      title: "Enter verification code",
      subtitle: "We’ve sent a 6-digit code to +44 7025 456789.",
      action: "Verify code",
      tone: "purple",
      fields: ["4", "2", "7", "1", "9", "6"],
      links: ["Didn’t receive the code?", "Resend code (00:46)", "Use email instead"],
    },
    {
      id: "social",
      label: "Social Sign Up",
      title: "Create your account",
      subtitle: "Sign up quickly using one of your social accounts.",
      action: "Continue with Google",
      tone: "purple",
      icon: "person",
      links: ["Continue with Apple", "Use email instead"],
    },
    {
      id: "guest",
      label: "Continue as Guest",
      title: "Continue as guest?",
      subtitle: "You can explore LINK with limited access. Create an account later to save information.",
      action: "Continue as guest",
      tone: "purple",
      icon: "person",
      links: ["Search opportunities", "View information", "Contact support", "Create account"],
    },
  ],
};

const states: Screen[] = [
  {
    id: "field-error",
    label: "Field Error",
    title: "Email address",
    subtitle: "Please enter a valid email address.",
    action: "Try again",
    tone: "danger",
    fields: ["hello"],
  },
  {
    id: "loading",
    label: "Loading State",
    title: "Please wait",
    subtitle: "We’re creating your account.",
    action: "Loading…",
    tone: "purple",
    icon: "person",
  },
  {
    id: "server-error",
    label: "Server Error",
    title: "Something went wrong.",
    subtitle: "Please try again.",
    action: "Try again",
    tone: "danger",
    icon: "error",
  },
  {
    id: "account-locked",
    label: "Account Locked",
    title: "Too many failed attempts.",
    subtitle: "Please try again later.",
    action: "Back to sign in",
    tone: "danger",
    icon: "lock",
  },
];

const flowLabels: Array<{ id: Flow; label: string }> = [
  { id: "signup", label: "Sign up flow" },
  { id: "login", label: "Log in flow" },
  { id: "alternative", label: "Alternative methods" },
  { id: "states", label: "States" },
];

function BrandIcon({ kind }: { kind?: Screen["icon"] }) {
  if (kind === "check") return <div className="flex h-16 w-16 items-center justify-center rounded-full border border-green-500 bg-green-100 text-3xl font-bold text-green-700">✓</div>;
  if (kind === "lock") return <div className="flex h-16 w-16 items-center justify-center rounded-full border border-violet-300 bg-violet-100 text-3xl">♙</div>;
  if (kind === "party") return <div className="text-5xl">🎉</div>;
  if (kind === "error") return <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-300 bg-red-100 text-3xl text-red-600">!</div>;
  if (kind === "person") return <div className="flex h-16 w-16 items-center justify-center rounded-full border border-violet-200 bg-violet-100 text-3xl text-violet-700">♙</div>;
  return (
    <div className="mb-2 text-center">
      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
        <span className="text-xl">✣</span>
      </div>
      <div className="text-4xl font-extrabold tracking-[-0.1em] text-pine">LINK</div>
    </div>
  );
}

function PhoneScreen({
  screen,
  onAction,
}: {
  screen: Screen;
  onAction: () => void;
}) {
  return (
    <div className="mx-auto max-w-[350px] rounded-[30px] border border-black/10 bg-white p-3 shadow-[0_16px_35px_rgba(20,24,28,0.12)]">
      <div className="mb-3 flex items-center justify-between px-2 text-[10px] font-medium text-slate-600">
        <span>9:41</span><span className="tracking-[0.2em]">◉◉◉</span>
      </div>
      <div className="min-h-[500px] rounded-[22px] border border-black/5 bg-[#f8f5f2] p-5">
        <div className="mb-5 flex justify-center"><BrandIcon kind={screen.icon} /></div>
        <h2 className="text-center text-xl font-semibold text-slate-800">{screen.title}</h2>
        <p className="mt-2 text-center text-xs leading-5 text-slate-500">{screen.subtitle}</p>
        {screen.helper && <p className="mt-3 text-center text-xs leading-5 text-slate-600">{screen.helper}</p>}
        <div className="mt-6 space-y-2">
          {screen.fields?.map((field, index) => (
            <div key={`${field}-${index}`} className={`rounded-xl border bg-white px-3 py-3 text-xs text-slate-500 shadow-sm ${screen.tone === "danger" && index === 0 ? "border-red-400 text-red-600" : "border-black/5"}`}>
              {field}
            </div>
          ))}
        </div>
        <button type="button" onClick={onAction} className={`mt-5 w-full rounded-xl px-3 py-3 text-xs font-semibold text-white ${screen.tone === "green" ? "bg-gradient-to-b from-[#2d8b5b] to-[#1f7045]" : screen.tone === "danger" ? "bg-red-600" : screen.tone === "neutral" ? "bg-slate-700" : "bg-gradient-to-b from-[#4a3a66] to-[#2d2346]"}`}>
          {screen.action}
        </button>
        {screen.links && <div className="mt-5 space-y-2 text-center text-[10px] text-violet-700">{screen.links.map((link) => <div key={link}>{link}</div>)}</div>}
      </div>
    </div>
  );
}

export default function AuthFlowPage() {
  const [flow, setFlow] = useState<Flow>("signup");
  const [activeIndex, setActiveIndex] = useState(0);

  const currentScreens = flow === "states" ? states : flows[flow];
  const activeScreen = useMemo(() => currentScreens[activeIndex] ?? currentScreens[0], [activeIndex, currentScreens]);

  const selectFlow = (nextFlow: Flow) => {
    setFlow(nextFlow);
    setActiveIndex(0);
  };

  const next = () => setActiveIndex((value) => Math.min(currentScreens.length - 1, value + 1));
  const previous = () => setActiveIndex((value) => Math.max(0, value - 1));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 text-ink">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pine/80">Sign up / log in</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-pine">Screen-by-screen auth flow</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">Use the flow tabs and screen controls to walk through every state from the reference.</p>
        </div>
        <Link href="/" className="rounded-full border border-pine/20 bg-white px-4 py-2 text-sm font-medium text-pine transition hover:border-pine/40 hover:bg-sand">Back to overview</Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {flowLabels.map((item) => (
          <button key={item.id} type="button" onClick={() => selectFlow(item.id)} className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition ${flow === item.id ? "border-pine bg-pine text-sand" : "border-pine/20 bg-white text-pine hover:border-pine/50"}`}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {currentScreens.map((screen, index) => (
          <button key={screen.id} type="button" onClick={() => setActiveIndex(index)} className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${index === activeIndex ? "border-violet-500 bg-violet-100 text-violet-800" : "border-pine/10 bg-white text-slate-600 hover:border-violet-300"}`}>
            {index + 1}. {screen.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-pine/10 bg-[#f7f4f1] p-4 shadow-card sm:p-8">
          <PhoneScreen screen={activeScreen} onAction={next} />
        </div>
        <aside className="rounded-[28px] border border-pine/10 bg-white/70 p-5 shadow-card">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pine/80">Current screen</p>
          <h2 className="mt-2 text-2xl font-semibold text-pine">{activeScreen.label}</h2>
          <div className="mt-5 rounded-2xl border border-pine/10 bg-sand p-4">
            <p className="text-sm font-medium text-pine">Interaction</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">The primary button advances to the next screen in this flow. Select any step above to jump directly to it.</p>
          </div>
          <div className="mt-5 flex gap-3">
            <button type="button" onClick={previous} disabled={activeIndex === 0} className="flex-1 rounded-full border border-pine/20 bg-white px-4 py-3 text-sm font-medium text-pine disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
            <button type="button" onClick={next} disabled={activeIndex === currentScreens.length - 1} className="flex-1 rounded-full bg-pine px-4 py-3 text-sm font-medium text-sand disabled:cursor-not-allowed disabled:opacity-40">Next</button>
          </div>
          <div className="mt-6 border-t border-pine/10 pt-5">
            <p className="text-sm font-medium text-pine">Included in this prototype</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <li>• Email sign-up and verification</li>
              <li>• Login, forgot password and reset success</li>
              <li>• Phone, social and guest alternatives</li>
              <li>• Error, loading and locked account states</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
