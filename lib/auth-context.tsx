"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { type AuthUser } from "@/lib/auth";
import {
  GUEST_CHANGE_EVENT,
  readGuestFlag,
  writeGuestFlag,
} from "@/lib/guest";

type AuthContextValue = {
  ready: boolean;
  user: AuthUser | null;
  isGuest: boolean;
  continueAsGuest: () => void;
  clearGuest: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function fromSessionUser(user: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
} | null): AuthUser | null {
  if (!user) return null;
  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null;
  return { id: user.id, email: user.email ?? null, fullName };
}

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: AuthUser | null;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isGuest, setIsGuest] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    setIsGuest(readGuestFlag());

    function syncGuest() {
      setIsGuest(readGuestFlag());
    }
    window.addEventListener(GUEST_CHANGE_EVENT, syncGuest);
    window.addEventListener("storage", syncGuest);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(fromSessionUser(session?.user ?? null));
      if (session?.user) {
        writeGuestFlag(false);
        setIsGuest(false);
      }
      setReady(true);
    });

    supabase.auth.getSession().then(({ data }) => {
      setUser(fromSessionUser(data.session?.user ?? null));
      setReady(true);
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener(GUEST_CHANGE_EVENT, syncGuest);
      window.removeEventListener("storage", syncGuest);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      user,
      isGuest,
      continueAsGuest() {
        writeGuestFlag(true);
        setIsGuest(true);
      },
      clearGuest() {
        writeGuestFlag(false);
        setIsGuest(false);
      },
      async signOut() {
        const supabase = createClient();
        await supabase.auth.signOut();
        writeGuestFlag(false);
        setIsGuest(false);
        setUser(null);
      },
    }),
    [isGuest, ready, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
