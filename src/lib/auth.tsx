import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { AuthScreen } from "@/screens/AuthScreen";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAnonymous: boolean;
}

const AuthContext = createContext<AuthCtx>({ user: null, session: null, loading: true, isAnonymous: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAnonymous = session?.user?.is_anonymous ?? true;

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ color: "var(--ps-charcoal-3)", fontSize: 14 }}>Loading…</div>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <AuthContext.Provider value={{ user: session.user, session, loading, isAnonymous }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useUserId(): string {
  const { user } = useAuth();
  if (!user) throw new Error("useUserId called before auth resolved");
  return user.id;
}
