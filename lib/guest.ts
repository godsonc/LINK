import { GUEST_KEY } from "./auth";

export const GUEST_CHANGE_EVENT = "link-guest";

export function readGuestFlag() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(GUEST_KEY) === "1";
}

export function writeGuestFlag(on: boolean) {
  if (on) window.localStorage.setItem(GUEST_KEY, "1");
  else window.localStorage.removeItem(GUEST_KEY);
  window.dispatchEvent(new Event(GUEST_CHANGE_EVENT));
}

export const GUEST_BENEFITS = [
  "Walk through who you are and what you need",
  "See a personalised pathway from verified services",
  "Book example appointments and ask for a navigator",
  "Keep your pathway on this device until you create an account",
] as const;

export const GUEST_LIMITS = [
  "Nothing is synced to other phones or browsers",
  "Messages from bookings and navigator requests stay on this device only",
  "Create an account to keep your name on your profile",
] as const;
