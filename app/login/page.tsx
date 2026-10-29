"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  AuthCard,
  Banner,
  PrimaryButton,
  SecondaryButton,
  TextLink,
} from "@/components/auth/ui";
import { useAuth } from "@/lib/auth-context";

function GetStarted() {
  const router = useRouter();
  const error = useSearchParams().get("error");
  const { continueAsGuest } = useAuth();

  return (
    <AuthCard
      title="Welcome"
      subtitle="LINK is an account to start finding support and opportunities that are right for you."
      footer={
        <p>
          Need help?{" "}
          <TextLink href="/help">Speak to a Community Navigator</TextLink>
        </p>
      }
    >
      <div className="space-y-3">
        {error ? <Banner tone="error" title={error} /> : null}
        <PrimaryButton onClick={() => router.push("/login/sign-up")}>
          Create account
        </PrimaryButton>
        <SecondaryButton onClick={() => router.push("/login/sign-in")}>
          Sign in
        </SecondaryButton>
        <button
          type="button"
          className="min-h-11 w-full py-3 text-sm font-medium text-pine"
          onClick={() => {
            continueAsGuest();
            router.push("/login/guest");
          }}
        >
          Continue as guest
        </button>
      </div>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <GetStarted />
    </Suspense>
  );
}
