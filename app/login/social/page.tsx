"use client";

import { useState } from "react";
import {
  AuthCard,
  Banner,
  PrimaryButton,
  SecondaryButton,
  TextLink,
} from "@/components/auth/ui";
import { friendlyAuthError, getSiteUrl } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

export default function SocialSignUpPage() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function oauth(provider: "google" | "apple") {
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${getSiteUrl()}/auth/callback?next=/login/welcome` },
    });
    if (oauthError) {
      setBusy(false);
      setError(friendlyAuthError(oauthError.message));
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Sign up quickly using one of your social accounts."
      footer={
        <p>
          <TextLink href="/login/sign-up">Use email instead</TextLink>
        </p>
      }
    >
      <div className="space-y-3">
        {error ? <Banner tone="error" title={error} /> : null}
        <PrimaryButton type="button" disabled={busy} onClick={() => oauth("google")}>
          Continue with Google
        </PrimaryButton>
        <SecondaryButton disabled={busy} onClick={() => oauth("apple")}>
          Continue with Apple
        </SecondaryButton>
      </div>
    </AuthCard>
  );
}
