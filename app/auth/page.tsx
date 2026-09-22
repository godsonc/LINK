"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Provider } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Flow = "signup" | "login" | "alternative";
type ScreenId =
  | "start"
  | "create"
  | "verify"
  | "created"
  | "welcome"
  | "signin"
  | "logged"
  | "forgot"
  | "reset"
  | "reset-success"
  | "phone"
  | "phone-verify"
  | "social"
  | "guest";

const flowScreens: Record<Flow, Array<{ id: ScreenId; label: string }>> = {
  signup: [
    { id: "start", label: "Get Started" },
    { id: "create", label: "Create Account" },
    { id: "verify", label: "Verify Email" },
    { id: "created", label: "Account Created" },
    { id: "welcome", label: "Welcome" },
  ],
  login: [
    { id: "signin", label: "Sign In" },
    { id: "logged", label: "Logged In" },
    { id: "forgot", label: "Forgot Password" },
    { id: "reset", label: "Reset Password" },
    { id: "reset-success", label: "Password Reset Success" },
  ],
  alternative: [
    { id: "phone", label: "Sign Up with Phone" },
    { id: "phone-verify", label: "Verify Phone Code" },
    { id: "social", label: "Social Sign Up" },
    { id: "guest", label: "Continue as Guest" },
  ],
};

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

export default function AuthFlowPage() {
  const [flow, setFlow] = useState<Flow>("signup");
  const [screenIndex, setScreenIndex] = useState(0);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const screens = flowScreens[flow];
  const current = screens[screenIndex];
  const supabase = useMemo(() => {
    try {
      return createSupabaseBrowserClient();
    } catch {
      return null;
    }
  }, []);
  const configured = supabase !== null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const callbackError = params.get("error");
    if (callbackError) setError(callbackError);
    const requestedFlow = params.get("flow");
    const requestedScreen = params.get("screen");
    if (requestedFlow === "login" || requestedFlow === "alternative" || requestedFlow === "signup") {
      setFlow(requestedFlow);
      const requestedIndex = flowScreens[requestedFlow].findIndex(
        (screen) => screen.id === requestedScreen,
      );
      if (requestedIndex >= 0) setScreenIndex(requestedIndex);
    }
  }, []);

  const selectFlow = (next: Flow) => {
    setFlow(next);
    setScreenIndex(0);
    setMessage("");
    setError("");
  };

  const goTo = (id: ScreenId) => {
    const index = screens.findIndex((screen) => screen.id === id);
    if (index >= 0) setScreenIndex(index);
  };

  const action = async () => {
    setMessage("");
    setError("");
    if (current.id === "start") {
      goTo("create");
      return;
    }
    if (current.id === "created") {
      selectFlow("login");
      return;
    }
    if (current.id === "reset-success") {
      selectFlow("login");
      return;
    }
    if (current.id === "welcome" || current.id === "logged") {
      setMessage("This screen is complete.");
      return;
    }
    if (!supabase) {
      setError("Supabase is not configured. Copy .env.example to .env.local and add your project URL and anon key.");
      return;
    }

    setBusy(true);
    try {
      if (current.id === "create") {
        if (!fullName.trim() || !email.trim() || password.length < 8) {
          throw new Error("Enter your name, a valid email, and a password of at least 8 characters.");
        }
        if (password !== confirmPassword) throw new Error("Your passwords do not match.");
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim() } },
        });
        if (signUpError) throw signUpError;
        if (data.session) goTo("created");
        else goTo("verify");
        setMessage("Check your inbox for the verification email.");
      } else if (current.id === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
        goTo("logged");
      } else if (current.id === "forgot") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth?flow=login&screen=reset`,
        });
        if (resetError) throw resetError;
        setMessage("If an account exists for that email, a reset link is on its way.");
      } else if (current.id === "reset") {
        if (password.length < 8 || password !== confirmPassword) {
          throw new Error("Use at least 8 characters and make both passwords match.");
        }
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) throw updateError;
        goTo("reset-success");
      } else if (current.id === "phone") {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          phone: phone.trim(),
          options: { shouldCreateUser: true },
        });
        if (otpError) throw otpError;
        goTo("phone-verify");
        setMessage("Verification code sent by SMS.");
      } else if (current.id === "phone-verify") {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          phone: phone.trim(),
          token: code.trim(),
          type: "sms",
        });
        if (verifyError) throw verifyError;
        setMessage("Phone verified successfully.");
        setFlow("signup");
        setScreenIndex(4);
      } else if (current.id === "social") {
        const provider: Provider = "google";
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
          provider,
          options: { redirectTo: `${window.location.origin}/auth/callback?next=/auth` },
        });
        if (oauthError) throw oauthError;
      } else if (current.id === "guest") {
        const { error: guestError } = await supabase.auth.signInAnonymously();
        if (guestError) throw guestError;
        setMessage("You are browsing as a guest. Create an account later to save your progress.");
      } else if (current.id === "verify") {
        const { error: resendError } = await supabase.auth.resend({ type: "signup", email: email.trim() });
        if (resendError) throw resendError;
        setMessage("A new verification email has been sent.");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The auth request failed.");
    } finally {
      setBusy(false);
    }
  };

  const renderFields = () => {
    if (current.id === "create") {
      return (
        <>
          <input aria-label="Full name" className={inputClass} placeholder="Full name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
          <input aria-label="Email address" className={inputClass} type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input aria-label="Create password" className={inputClass} type="password" placeholder="Create password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <input aria-label="Confirm password" className={inputClass} type="password" placeholder="Confirm password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
        </>
      );
    }
    if (current.id === "signin") {
      return (
        <>
          <input aria-label="Email address" className={inputClass} type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input aria-label="Password" className={inputClass} type="password" placeholder="Your password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </>
      );
    }
    if (current.id === "forgot") return <input aria-label="Email address" className={inputClass} type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} />;
    if (current.id === "reset") return <><input aria-label="New password" className={inputClass} type="password" placeholder="New password" value={password} onChange={(event) => setPassword(event.target.value)} /><input aria-label="Confirm new password" className={inputClass} type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></>;
    if (current.id === "phone") return <input aria-label="Mobile number" className={inputClass} type="tel" placeholder="+44 7025 456789" value={phone} onChange={(event) => setPhone(event.target.value)} />;
    if (current.id === "phone-verify") return <input aria-label="Verification code" className={inputClass} inputMode="numeric" maxLength={6} placeholder="6-digit code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} />;
    return null;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 text-ink">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pine/80">Sign up / log in</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-pine">Functional auth screens</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">Every primary action now calls Supabase Auth. Configure the project before using live requests.</p>
        </div>
        <Link href="/" className="rounded-full border border-pine/20 bg-white px-4 py-2 text-sm font-medium text-pine">Back to overview</Link>
      </div>

      {!configured && <div className="mb-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">Supabase is not configured yet. Add the two values from <code>.env.example</code> to <code>.env.local</code>, then restart Next.js.</div>}
      {error && <div role="alert" className="mb-5 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
      {message && <div role="status" className="mb-5 rounded-2xl border border-green-300 bg-green-50 p-4 text-sm text-green-800">{message}</div>}

      <div className="mb-6 flex flex-wrap gap-2">
        {(Object.keys(flowScreens) as Flow[]).map((item) => (
          <button key={item} type="button" onClick={() => selectFlow(item)} className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] ${flow === item ? "border-pine bg-pine text-sand" : "border-pine/20 bg-white text-pine"}`}>{item === "signup" ? "Sign up flow" : item === "login" ? "Log in flow" : "Alternative methods"}</button>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {screens.map((screen, index) => <button key={screen.id} type="button" onClick={() => setScreenIndex(index)} className={`rounded-lg border px-3 py-2 text-xs ${index === screenIndex ? "border-violet-500 bg-violet-100 text-violet-800" : "border-pine/10 bg-white text-slate-600"}`}>{index + 1}. {screen.label}</button>)}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-pine/10 bg-[#f7f4f1] p-4 shadow-card sm:p-8">
          <div className="mx-auto max-w-[350px] rounded-[30px] border border-black/10 bg-white p-3 shadow-xl">
            <div className="mb-3 flex justify-between px-2 text-[10px] text-slate-600"><span>9:41</span><span>◉◉◉</span></div>
            <div className="min-h-[490px] rounded-[22px] bg-[#f8f5f2] p-5">
              <div className="mb-5 text-center"><div className="text-4xl font-extrabold tracking-[-0.1em] text-pine">LINK</div><p className="mt-2 text-xs text-slate-500">{current.label}</p></div>
              <h2 className="text-center text-xl font-semibold text-slate-800">{current.id === "start" ? "Welcome" : current.id === "created" ? "Your account is ready!" : current.id === "logged" ? "Welcome back!" : current.id === "welcome" ? "Welcome to LINK!" : current.id === "guest" ? "Continue as guest?" : current.id === "reset-success" ? "Password reset successful" : current.label}</h2>
              <p className="mt-2 text-center text-xs leading-5 text-slate-500">{current.id === "create" ? "Let’s get started" : current.id === "signin" ? "Welcome back! Please sign in to continue." : current.id === "verify" ? "We’ve sent a verification link to your email." : "Use the controls below to complete this step."}</p>
              <div className="mt-6 space-y-2">{renderFields()}</div>
              <button type="button" onClick={action} disabled={busy} className="mt-5 w-full rounded-xl bg-gradient-to-b from-[#4a3a66] to-[#2d2346] px-3 py-3 text-xs font-semibold text-white disabled:opacity-50">{busy ? "Please wait…" : current.id === "start" ? "Create account" : current.id === "signin" ? "Sign in" : current.id === "forgot" ? "Send reset link" : current.id === "phone" ? "Send code" : current.id === "phone-verify" ? "Verify code" : current.id === "reset" ? "Reset password" : current.id === "guest" ? "Continue as guest" : current.id === "social" ? "Continue with Google" : current.id === "verify" ? "Resend email" : current.id === "created" ? "Continue to sign in" : current.id === "reset-success" ? "Go to sign in" : current.id === "welcome" ? "Tell us about you" : "Continue"}</button>
              {current.id === "signin" && <button type="button" onClick={() => goTo("forgot")} className="mt-4 w-full text-center text-xs text-violet-700">Forgot password?</button>}
              {current.id === "social" && <button type="button" onClick={() => { if (!supabase) { setError("Supabase is not configured."); return; } void supabase.auth.signInWithOAuth({ provider: "apple", options: { redirectTo: `${window.location.origin}/auth/callback?next=/auth` } }).then(({ error: oauthError }) => { if (oauthError) setError(oauthError.message); }); }} className="mt-3 w-full text-center text-xs text-violet-700">Continue with Apple</button>}
            </div>
          </div>
        </div>
        <aside className="rounded-[28px] border border-pine/10 bg-white/70 p-5 shadow-card">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pine/80">Current screen</p>
          <h2 className="mt-2 text-2xl font-semibold text-pine">{current.label}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">Primary actions call Supabase Auth APIs. OAuth returns through <code>/auth/callback</code>; email and SMS verification use Supabase’s configured templates and providers.</p>
          <div className="mt-5 flex gap-3"><button type="button" onClick={() => setScreenIndex((value) => Math.max(0, value - 1))} disabled={screenIndex === 0} className="flex-1 rounded-full border border-pine/20 bg-white px-4 py-3 text-sm text-pine disabled:opacity-40">Previous</button><button type="button" onClick={() => setScreenIndex((value) => Math.min(screens.length - 1, value + 1))} disabled={screenIndex === screens.length - 1} className="flex-1 rounded-full bg-pine px-4 py-3 text-sm text-sand disabled:opacity-40">Next</button></div>
        </aside>
      </div>
    </div>
  );
}
