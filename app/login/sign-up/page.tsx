"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { loadProfile } from "@/lib/profile";
import { PasswordHints } from "@/components/auth/PasswordHints";
import {
  AuthCard,
  Banner,
  PrimaryButton,
  TextField,
  TextLink,
} from "@/components/auth/ui";
import {
  checkPassword,
  friendlyAuthError,
  getSiteUrl,
  isPasswordValid,
} from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const checks = useMemo(() => checkPassword(password), [password]);

  useEffect(() => {
    const profile = loadProfile();
    if (profile.details.fullName) setFullName(profile.details.fullName);
    if (profile.details.email) setEmail(profile.details.email);
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!fullName.trim()) nextErrors.fullName = "Please enter your full name.";
    if (!email.includes("@")) nextErrors.email = "Please enter a valid email address.";
    if (!isPasswordValid(password)) {
      nextErrors.password = "Please choose a stronger password.";
    }
    if (password !== confirm) nextErrors.confirm = "Passwords do not match.";
    if (!accepted) nextErrors.terms = "Please agree to the terms and privacy notice.";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setBusy(true);
    setError("");
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: `${getSiteUrl()}/auth/confirm?next=/login/ready`,
      },
    });
    setBusy(false);
    if (signUpError) {
      setError(friendlyAuthError(signUpError.message));
      return;
    }
    if (data.session) {
      router.push("/login/welcome");
      router.refresh();
      return;
    }
    sessionStorage.setItem("link-pending-email", email.trim());
    router.push("/login/verify");
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Let’s get started."
      footer={
        <p>
          Already have an account? <TextLink href="/login/sign-in">Sign in</TextLink>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        {error ? <Banner tone="error" title="Something went wrong" >{error}</Banner> : null}
        <TextField
          id="fullName"
          label="Full name"
          autoComplete="name"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(event) => {
            setFullName(event.target.value);
            setFieldErrors((current) => ({ ...current, fullName: "" }));
          }}
          error={fieldErrors.fullName || undefined}
        />
        <TextField
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="name@email.com"
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
          autoComplete="new-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setFieldErrors((current) => ({ ...current, password: "" }));
          }}
          error={fieldErrors.password || undefined}
        />
        <PasswordHints checks={checks} />
        <TextField
          id="confirm"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm your password"
          value={confirm}
          onChange={(event) => {
            setConfirm(event.target.value);
            setFieldErrors((current) => ({ ...current, confirm: "" }));
          }}
          error={fieldErrors.confirm || undefined}
        />
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5"
            checked={accepted}
            onChange={(event) => {
              setAccepted(event.target.checked);
              setFieldErrors((current) => ({ ...current, terms: "" }));
            }}
          />
          <span>
            I agree to the{" "}
            <TextLink href="/privacy">terms of use and privacy notice</TextLink>.
          </span>
        </label>
        {fieldErrors.terms ? (
          <p className="text-sm text-danger" role="alert">
            {fieldErrors.terms}
          </p>
        ) : null}
        <PrimaryButton disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </PrimaryButton>
      </form>
    </AuthCard>
  );
}
