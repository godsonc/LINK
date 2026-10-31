"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type ProfileConsent,
  type ProfileDetails,
  type ProfileDocument,
  type ProfilePreferences,
  type ProfileState,
  emptyProfile,
  loadProfile,
  saveProfile,
} from "@/lib/profile";

export function useProfile() {
  const [state, setState] = useState<ProfileState>(emptyProfile);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  const reload = useCallback(() => {
    try {
      setState(loadProfile());
      setError(false);
    } catch {
      setError(true);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === "link-profile") reload();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [reload]);

  function persist(next: ProfileState) {
    saveProfile(next);
    setState(next);
  }

  function saveDetails(details: ProfileDetails) {
    persist({ ...state, details });
  }

  function savePreferences(preferences: ProfilePreferences) {
    persist({ ...state, preferences });
  }

  function saveConsents(consents: ProfileConsent) {
    persist({ ...state, consents });
  }

  function saveDocuments(documents: ProfileDocument[]) {
    persist({ ...state, documents });
  }

  return {
    ready,
    error,
    reload,
    ...state,
    saveDetails,
    savePreferences,
    saveConsents,
    saveDocuments,
  };
}
