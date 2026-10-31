import { newId } from "./store";

export type ProfileDetails = {
  fullName: string;
  dateOfBirth: string;
  address: string;
  phone: string;
  email: string;
  avatarDataUrl: string;
};

export type ProfilePreferences = {
  email: boolean;
  sms: boolean;
  phone: boolean;
  post: boolean;
  language: string;
  largePrint: boolean;
  easyRead: boolean;
  hearing: boolean;
};

export type ProfileConsent = {
  navigator: boolean;
  reminders: boolean;
};

export type ProfileDocument = {
  id: string;
  name: string;
  addedAt: string;
};

export type ProfileState = {
  details: ProfileDetails;
  preferences: ProfilePreferences;
  consents: ProfileConsent;
  documents: ProfileDocument[];
};

const STORAGE_KEY = "link-profile";

export function emptyProfile(): ProfileState {
  return {
    details: {
      fullName: "",
      dateOfBirth: "",
      address: "",
      phone: "",
      email: "",
      avatarDataUrl: "",
    },
    preferences: {
      email: true,
      sms: false,
      phone: false,
      post: false,
      language: "English",
      largePrint: false,
      easyRead: false,
      hearing: false,
    },
    consents: {
      navigator: false,
      reminders: true,
    },
    documents: [],
  };
}

export function loadProfile(): ProfileState {
  if (typeof window === "undefined") return emptyProfile();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyProfile();
  const parsed = JSON.parse(raw) as Partial<ProfileState>;
  const empty = emptyProfile();
  return {
    details: { ...empty.details, ...parsed.details },
    preferences: { ...empty.preferences, ...parsed.preferences },
    consents: { ...empty.consents, ...parsed.consents },
    documents: Array.isArray(parsed.documents) ? parsed.documents : [],
  };
}

export function saveProfile(state: ProfileState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearProfile() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function documentRecord(name: string): ProfileDocument {
  return {
    id: newId("doc"),
    name,
    addedAt: new Date().toISOString(),
  };
}
