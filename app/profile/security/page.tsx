"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { PasswordHints } from "@/components/auth/PasswordHints";
import { useAuth } from "@/lib/auth-context";
import { checkPassword, friendlyAuthError, isPasswordValid } from "@/lib/auth";
import { clearProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/client";

export default function SecurityPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const checks = checkPassword(password);

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    setNotice("");
    setError("");
    if (!isPasswordValid(password) || password !== confirm) {
      setError("Enter a valid password and make sure both fields match.");
      return;
    }
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(friendlyAuthError(updateError.message));
        return;
      }
      setPassword("");
      setConfirm("");
      setNotice("Password updated.");
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  async function deleteLocalAccount() {
    window.localStorage.removeItem("link-appointments");
    window.localStorage.removeItem("link-session");
    window.localStorage.removeItem("link-guest");
    clearProfile();
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="font-semibold">Password</h2>
        {user ? (
          <form className="space-y-3" onSubmit={changePassword}>
            <label className="block text-sm font-medium">
              New password
              <input
                type="password"
                autoComplete="new-password"
                className="mt-2 min-h-target w-full rounded-2xl border border-line/20 bg-field px-4"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <PasswordHints checks={checks} />
            <label className="block text-sm font-medium">
              Confirm password
              <input
                type="password"
                autoComplete="new-password"
                className="mt-2 min-h-target w-full rounded-2xl border border-line/20 bg-field px-4"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
              />
            </label>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            {notice ? <p className="text-sm text-success">{notice}</p> : null}
            <button
              type="submit"
              className="min-h-target w-full rounded-full bg-brand px-4 font-semibold text-paper"
            >
              Change password
            </button>
          </form>
        ) : (
          <p className="text-muted">
            <Link href="/login" className="font-medium text-brand">
              Sign in
            </Link>{" "}
            to change a password. You can also{" "}
            <Link href="/login/forgot" className="font-medium text-brand">
              reset it by email
            </Link>
            .
          </p>
        )}
      </section>

      <section className="rounded-card bg-paper p-4 shadow-card text-sm">
        <h2 className="font-semibold">Sign-in method</h2>
        <p className="mt-1 text-muted">
          {user?.email ? `Email and password · ${user.email}` : "No account on this device."}
        </p>
        <h2 className="mt-4 font-semibold">Two-step verification</h2>
        <p className="mt-1 text-muted">Not available on this project yet.</p>
        <h2 className="mt-4 font-semibold">Active sessions</h2>
        <p className="mt-1 text-muted">This browser.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-danger">Delete my account</h2>
        {confirmDelete ? (
          <>
            <p className="text-sm text-muted">
              This removes your profile, bookings and pathway stored on this
              device, then signs you out. Your email sign-in is not deleted.
            </p>
            <button
              type="button"
              className="min-h-target w-full rounded-full bg-danger px-4 font-semibold text-paper"
              onClick={deleteLocalAccount}
            >
              Delete data on this device
            </button>
            <button
              type="button"
              className="min-h-target w-full rounded-full border border-line/30 px-4 font-semibold"
              onClick={() => setConfirmDelete(false)}
            >
              Keep my account
            </button>
          </>
        ) : (
          <button
            type="button"
            className="min-h-target w-full rounded-full border border-danger/40 font-semibold text-danger"
            onClick={() => setConfirmDelete(true)}
          >
            Delete my account
          </button>
        )}
      </section>
    </div>
  );
}
