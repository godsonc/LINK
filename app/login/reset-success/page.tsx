"use client";

import { useRouter } from "next/navigation";
import { AuthCard, PrimaryButton } from "@/components/auth/ui";

export default function ResetSuccessPage() {
  const router = useRouter();
  return (
    <AuthCard
      title="Password reset successful"
      subtitle="You can now sign in with your new password."
    >
      <PrimaryButton type="button" onClick={() => router.push("/login/sign-in")}>
        Go to sign in
      </PrimaryButton>
    </AuthCard>
  );
}
