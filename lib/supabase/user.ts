import type { AuthUser } from "@/lib/auth";
import { createClient } from "./server";
import { hasSupabaseEnv } from "./env";

export async function getAuthUser(): Promise<AuthUser | null> {
  if (!hasSupabaseEnv) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims?.sub) return null;

    const claims = data.claims;
    const metadata = claims.user_metadata as
      | Record<string, unknown>
      | undefined;

    return {
      id: claims.sub,
      email: typeof claims.email === "string" ? claims.email : null,
      fullName:
        typeof metadata?.full_name === "string" ? metadata.full_name : null,
    };
  } catch {
    return null;
  }
}
