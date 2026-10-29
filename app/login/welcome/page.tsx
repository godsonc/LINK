"use client";

import { useRouter } from "next/navigation";
import { AuthCard, PrimaryButton, SecondaryButton } from "@/components/auth/ui";

export default function WelcomePage() {
  const router = useRouter();
  return (
    <AuthCard
      title="Welcome to LINK!"
      subtitle="Let’s personalise your experience."
    >
      <div className="space-y-3">
        <PrimaryButton type="button" onClick={() => router.push("/discover")}>
          Tell us about you
        </PrimaryButton>
        <SecondaryButton onClick={() => router.push("/")}>
          I’ll do this later
        </SecondaryButton>
      </div>
    </AuthCard>
  );
}
