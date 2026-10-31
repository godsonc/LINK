"use client";

import { useRouter } from "next/navigation";
import { AuthCard, PrimaryButton, SecondaryButton, TextLink } from "@/components/auth/ui";
import { useAuth } from "@/lib/auth-context";
import { GUEST_BENEFITS, GUEST_LIMITS } from "@/lib/guest";

export default function GuestPage() {
  const router = useRouter();
  const { continueAsGuest } = useAuth();

  return (
    <AuthCard
      title="Continue as guest?"
      subtitle="Explore LINK without an account. Your pathway and bookings stay on this device only."
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold">You can</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
            {GUEST_BENEFITS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Please note</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
            {GUEST_LIMITS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <PrimaryButton
          type="button"
          onClick={() => {
            continueAsGuest();
            router.push("/who");
          }}
        >
          Continue as guest
        </PrimaryButton>
        <SecondaryButton onClick={() => router.push("/login/sign-up")}>
          Create account
        </SecondaryButton>
      </div>
      <p className="mt-4 text-sm">
        Prefer to sign in? <TextLink href="/login/sign-in">Sign in</TextLink>
      </p>
    </AuthCard>
  );
}
