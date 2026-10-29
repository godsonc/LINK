"use client";

import { useRouter } from "next/navigation";
import { AuthCard, PrimaryButton } from "@/components/auth/ui";

export default function AccountReadyPage() {
  const router = useRouter();
  return (
    <AuthCard
      title="Your account is ready!"
      subtitle="You can now sign in and start exploring support and opportunities."
    >
      <PrimaryButton type="button" onClick={() => router.push("/login/welcome")}>
        Continue to sign in
      </PrimaryButton>
    </AuthCard>
  );
}
