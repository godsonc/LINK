"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  AuthCard,
  Banner,
  PrimaryButton,
  SecondaryButton,
  TextField,
  TextLink,
} from "@/components/auth/ui";
import { friendlyAuthError, getSiteUrl } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

function SignInForm() {
  const router = useRouter();
  const paramsError = useSearchParams().get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(paramsError ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!email.includes("@")) nextErrors.email = "Please enter a valid email address.";
    if (!password) nextErrors.password = "Please enter your password.";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setBusy(true);
    setError("");
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (signInError) {
      setError(friendlyAuthError(signInError.message));
      return;
    }
    router.push("/login/welcome-back");
    router.refresh();
  }

  async function oauth(provider: "google" | "apple") {
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${getSiteUrl()}/auth/callback?next=/login/welcome-back` },
    });
    if (oauthError) {
      setBusy(false);
      setError(friendlyAuthError(oauthError.message));
    }
  }

  return (
    <AuthCard
      title="Sign in"
      subtitle="Welcome back! Please sign in to continue."
      footer={
        <p>
          Don’t have an account? <TextLink href="/login/sign-up">Sign up</TextLink>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        {error ? (
          <Banner
            tone="error"
            title={
              error.toLowerCase().includes("too many")
                ? "Too many failed attempts"
                : "Could not sign in"
            }
          >
            {error}
          </Banner>
        ) : null}
        <TextField
          id="email"
          label="Email or phone"
          autoComplete="username"
          placeholder="Enter your email or phone"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setFieldErrors((current) => ({ ...current, email: "" }));
          }}
          error={fieldErrors.email || undefined}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setFieldErrors((current) => ({ ...current, password: "" }));
          }}
          error={fieldErrors.password || undefined}
        />
        <p className="text-right text-sm">
          <TextLink href="/login/forgot">Forgot password?</TextLink>
        </p>
        <PrimaryButton disabled={busy}>{busy ? "Signing in…" : "Sign in"}</PrimaryButton>
        <p className="text-center text-sm text-pine">or continue with</p>
        <div className="grid grid-cols-2 gap-3">
          <SecondaryButton disabled={busy} onClick={() => oauth("google")}>
            Google
          </SecondaryButton>
          <SecondaryButton disabled={busy} onClick={() => oauth("apple")}>
            Apple
          </SecondaryButton>
        </div>
        <p className="text-center text-sm">
          Prefer a code? <TextLink href="/login/phone">Sign up with phone</TextLink>
        </p>
      </form>
    </AuthCard>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
