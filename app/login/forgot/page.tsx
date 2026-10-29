"use client";

import { useState } from "react";
import {
  AuthCard,
  Banner,
  PrimaryButton,
  TextField,
  TextLink,
} from "@/components/auth/ui";
import { friendlyAuthError, getSiteUrl } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.includes("@")) {
      setFieldError("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: `${getSiteUrl()}/auth/confirm?next=/login/reset` },
    );
    setBusy(false);
    if (resetError) {
      setError(friendlyAuthError(resetError.message));
      return;
    }
    setSent(true);
  }

  return (
    <AuthCard
      title="Forgot password?"
      subtitle="Enter your email address and we’ll send you a link to reset your password."
      footer={
        <p>
          <TextLink href="/login/sign-in">Back to sign in</TextLink>
        </p>
      }
    >
      {sent ? (
        <Banner tone="info" title="Check your email">
          If an account exists for {email}, you will receive a reset link shortly.
        </Banner>
      ) : (
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          {error ? <Banner tone="error" title={error} /> : null}
          <TextField
            id="email"
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={fieldError}
          />
          <PrimaryButton disabled={busy}>
            {busy ? "Sending…" : "Send reset link"}
          </PrimaryButton>
        </form>
      )}
    </AuthCard>
  );
}
