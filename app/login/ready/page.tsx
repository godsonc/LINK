"use client";

import { useRouter } from "next/navigation";
import { POST_SIGNUP_PATH } from "@/lib/auth";
import { AuthCard, PrimaryButton } from "@/components/auth/ui";

export default function AccountReadyPage() {
  const router = useRouter();
  return (
    <AuthCard
      title="Your account is ready!"
      subtitle="Tell us what you need and we will build your pathway."
    >
      <PrimaryButton type="button" onClick={() => router.push(POST_SIGNUP_PATH)}>
        Create my pathway
      </PrimaryButton>
    </AuthCard>
  );
}
