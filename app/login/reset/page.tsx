"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PasswordHints } from "@/components/auth/PasswordHints";
import {
  AuthCard,
  Banner,
  PrimaryButton,
  TextField,
} from "@/components/auth/ui";
import {
  checkPassword,
  friendlyAuthError,
  isPasswordValid,
} from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const checks = useMemo(() => checkPassword(password), [password]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!isPasswordValid(password)) {
      nextErrors.password = "Please choose a stronger password.";
    }
    if (password !== confirm) nextErrors.confirm = "Passwords do not match.";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setBusy(true);
    setError("");
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) {
      setError(friendlyAuthError(updateError.message));
      return;
    }
    router.push("/login/reset-success");
  }

  return (
    <AuthCard
      title="Create new password"
      subtitle="Choose a new password for your account."
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        {error ? <Banner tone="error" title={error} /> : null}
        <TextField
          id="password"
          label="New password"
          type="password"
          autoComplete="new-password"
          placeholder="Enter new password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
        />
        <PasswordHints checks={checks} />
        <TextField
          id="confirm"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          error={fieldErrors.confirm}
        />
        <PrimaryButton disabled={busy}>
          {busy ? "Saving…" : "Reset password"}
        </PrimaryButton>
      </form>
    </AuthCard>
  );
}
