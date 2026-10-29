import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNext(value: string | null, fallback: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  return value;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(
    searchParams.get("next"),
    type === "recovery" ? "/login/reset" : "/login/ready",
  );
  const description = searchParams.get("error_description");

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) redirect(next);
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) redirect(next);
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (description) {
    redirect(`/login?error=${encodeURIComponent(description)}`);
  }

  redirect(
    `/login?error=${encodeURIComponent("This link is missing or has expired. Request a new email from the sign-up page.")}`,
  );
}
