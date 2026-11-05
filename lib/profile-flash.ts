export const PROFILE_FLASH_KEY = "link-profile-flash";

export function setProfileFlash(message: string) {
  sessionStorage.setItem(PROFILE_FLASH_KEY, message);
}

export function consumeProfileFlash() {
  const message = sessionStorage.getItem(PROFILE_FLASH_KEY);
  if (message) sessionStorage.removeItem(PROFILE_FLASH_KEY);
  return message;
}
