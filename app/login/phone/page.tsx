"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AuthCard,
  Banner,
  PrimaryButton,
  TextField,
  TextLink,
} from "@/components/auth/ui";
import { friendlyAuthError } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

export default function PhoneSignUpPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const digits = phone.replace(/\s+/g, "");
    if (digits.length < 10) {
      setFieldError("Please enter a valid UK mobile number.");
      return;
    }
    const e164 = digits.startsWith("+") ? digits : `+44${digits.replace(/^0/, "")}`;
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({ phone: e164 });
    setBusy(false);
    if (otpError) {
      setError(friendlyAuthError(otpError.message));
      return;
    }
    sessionStorage.setItem("link-pending-phone", e164);
    router.push("/login/phone/verify");
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Enter your mobile number and we’ll send you a verification code."
      footer={
        <p>
          <TextLink href="/login/sign-up">Use email instead</TextLink>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        {error ? <Banner tone="error" title={error} /> : null}
        <TextField
          id="phone"
          label="Mobile number"
          type="tel"
          autoComplete="tel"
          placeholder="07123 456789"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          error={fieldError}
        />
        <PrimaryButton disabled={busy}>
          {busy ? "Sending…" : "Send code"}
        </PrimaryButton>
      </form>
    </AuthCard>
  );
}
