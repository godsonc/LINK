"use client";

import { useEffect, useState } from "react";
import {
  AuthCard,
  Banner,
  PrimaryButton,
  TextLink,
} from "@/components/auth/ui";
import { friendlyAuthError, getSiteUrl } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("your inbox");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("link-pending-email");
    if (stored) setEmail(stored);
  }, []);

  async function resend() {
    const stored = sessionStorage.getItem("link-pending-email");
    if (!stored) {
      setError("We do not have an email to resend to. Please create your account again.");
      return;
    }
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: stored,
      options: { emailRedirectTo: `${getSiteUrl()}/auth/confirm?next=/login/ready` },
    });
    setBusy(false);
    if (resendError) {
      setError(friendlyAuthError(resendError.message));
      return;
    }
    setMessage("We’ve sent another email.");
  }

  return (
    <AuthCard
      title="Check your email"
      subtitle={`We’ve sent a verification link to ${email}. Open the link to verify your account.`}
      footer={
        <p>
          Change email address?{" "}
          <TextLink href="/login/sign-up">Go back</TextLink>
        </p>
      }
    >
      <div className="space-y-4">
        {error ? <Banner tone="error" title={error} /> : null}
        {message ? <Banner tone="info" title={message} /> : null}
        <p className="text-sm text-muted">Didn’t receive it?</p>
        <PrimaryButton type="button" disabled={busy} onClick={resend}>
          {busy ? "Sending…" : "Resend email"}
        </PrimaryButton>
      </div>
    </AuthCard>
  );
}
