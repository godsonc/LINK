"use client";

import { useRouter } from "next/navigation";
import { AuthCard, PrimaryButton } from "@/components/auth/ui";
import { useAuth } from "@/lib/auth-context";

export default function WelcomeBackPage() {
  const router = useRouter();
  const { user } = useAuth();
  const name = user?.fullName?.split(" ")[0] ?? "there";

  return (
    <AuthCard
      title="Welcome back!"
      subtitle={`You’re successfully signed in${user?.email ? ` as ${user.email}` : ""}.`}
    >
      <p className="mb-4 text-pine">Hello {name}.</p>
      <PrimaryButton type="button" onClick={() => router.push("/")}>
        Continue
      </PrimaryButton>
    </AuthCard>
  );
}
