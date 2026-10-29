export const GUEST_KEY = "link-guest";

export type AuthUser = {
  id: string;
  email: string | null;
  fullName: string | null;
};

export type PasswordChecks = {
  length: boolean;
  upper: boolean;
  lower: boolean;
  numberOrSymbol: boolean;
};

export function checkPassword(password: string): PasswordChecks {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    numberOrSymbol: /[0-9]|[^A-Za-z0-9]/.test(password),
  };
}

export function isPasswordValid(password: string) {
  const checks = checkPassword(password);
  return Object.values(checks).every(Boolean);
}

export function friendlyAuthError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login")) {
    return "That email or password is not quite right. Please try again.";
  }
  if (lower.includes("already registered")) {
    return "An account with this email already exists. Sign in instead.";
  }
  if (lower.includes("email rate") || lower.includes("rate limit")) {
    return "Email sending is paused for this hour. Try again shortly, or sign in if you already created an account.";
  }
  if (lower.includes("too many")) {
    return "Too many attempts. Please wait a few minutes and try again.";
  }
  if (lower.includes("locked")) {
    return "This account is locked. Please try again later.";
  }
  if (lower.includes("provider") || lower.includes("oauth")) {
    return "That sign-in method is not enabled yet on this project.";
  }
  if (lower.includes("phone") || lower.includes("sms") || lower.includes("unsupported")) {
    return "Phone sign-in is not enabled yet on this project.";
  }
  return message;
}

export function getSiteUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
