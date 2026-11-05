export const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000;
export const LAST_ACTIVITY_KEY = "link-last-activity";

export const ACTIVITY_EVENTS = [
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "click",
] as const;

export function readLastActivity() {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(LAST_ACTIVITY_KEY) || "0");
}

export function writeLastActivity(at = Date.now()) {
  window.localStorage.setItem(LAST_ACTIVITY_KEY, String(at));
}

export function clearLastActivity() {
  window.localStorage.removeItem(LAST_ACTIVITY_KEY);
}

export function inactiveForMs(now = Date.now()) {
  const last = readLastActivity();
  if (!last) return false;
  return now - last >= INACTIVITY_TIMEOUT_MS;
}
