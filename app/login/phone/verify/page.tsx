"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AuthCard,
  Banner,
  PrimaryButton,
  TextField,
  TextLink,
} from "@/components/auth/ui";
import { friendlyAuthError } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

export default function VerifyPhonePage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPhone(sessionStorage.getItem("link-pending-phone") ?? "");
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!phone) {
      setError("We do not have a phone number to verify. Please start again.");
      return;
    }
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone,
      token: code.trim(),
      type: "sms",
    });
    setBusy(false);
    if (verifyError) {
      setError(friendlyAuthError(verifyError.message));
      return;
    }
    router.push("/login/welcome-back");
    router.refresh();
  }

  return (
    <AuthCard
      title="Enter verification code"
      subtitle={
        phone
          ? `We’ve sent a 6-digit code to ${phone}.`
          : "Enter the 6-digit code from your text message."
      }
      footer={
        <p>
          <TextLink href="/login/sign-up">Use email instead</TextLink>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        {error ? <Banner tone="error" title={error} /> : null}
        <TextField
          id="code"
          label="Verification code"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="4 2 7 1 9 6"
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />
        <PrimaryButton disabled={busy || code.trim().length < 6}>
          {busy ? "Checking…" : "Verify"}
        </PrimaryButton>
      </form>
    </AuthCard>
  );
}
