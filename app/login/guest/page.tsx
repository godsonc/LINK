"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthCard, PrimaryButton, SecondaryButton, TextLink } from "@/components/auth/ui";
import { useAuth } from "@/lib/auth-context";

export default function GuestPage() {
  const router = useRouter();
  const { continueAsGuest } = useAuth();

  useEffect(() => {
    continueAsGuest();
  }, [continueAsGuest]);

  return (
    <AuthCard
      title="Continue as guest?"
      subtitle="You can explore LINK with limited access. Create an account later to save your pathway, referrals and follow-up."
    >
      <ul className="mb-6 list-disc space-y-1 pl-5 text-sm text-pine">
        <li>View opportunities</li>
        <li>Describe a situation</li>
        <li>See local services</li>
        <li>Ask for a navigator</li>
      </ul>
      <div className="space-y-3">
        <PrimaryButton type="button" onClick={() => router.push("/")}>
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
