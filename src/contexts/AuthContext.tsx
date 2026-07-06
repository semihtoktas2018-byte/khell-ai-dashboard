import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
export type Plan = "free" | "pro" | "enterprise";
interface AppUser {
  id: string;
  email: string;
  name: string;
  plan: Plan;
}
interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  plan: Plan;
  isPro: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | null>(null);
function buildAppUser(su: SupabaseUser, plan: Plan): AppUser {
  const email = su.email ?? "";
  const name = (su.user_metadata as { name?: string } | null)?.name || email.split("@")[0] || "User";
  return { id: su.id, email, name, plan };
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const loadPlan = useCallback(async (su: SupabaseUser) => {
    const { data } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", su.id)
      .maybeSingle();
    const plan = (data?.plan as Plan | undefined) ?? "free";
    setUser(buildAppUser(su, plan));
  }, []);

  // Giriş kaydı: last_login + login_count güncelle
  const recordLogin = useCallback(async (su: SupabaseUser) => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("login_count")
        .eq("id", su.id)
        .maybeSingle();
      const current = (data?.login_count as number | undefined) ?? 0;
      await supabase
        .from("profiles")
        .update({ last_login: new Date().toISOString(), login_count: current + 1 })
        .eq("id", su.id);
    } catch {
      // sessiz geç, girişi bloklamasın
    }
  }, []);
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        setTimeout(() => { loadPlan(newSession.user); }, 0);
        if (_event === "SIGNED_IN") {
          setTimeout(() => { recordLogin(newSession.user); }, 0);
        }
      } else {
        setUser(null);
      }
    });
    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
      if (existing?.user) {
        loadPlan(existing.user).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
    return () => { sub.subscription.unsubscribe(); };
  }, [loadPlan, recordLogin]);
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return true;
  }, []);
  const signup = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { name },
      },
    });
    if (error) throw error;
    return true;
  }, []);
  const loginWithGoogle = useCallback(async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) throw error;
  }, []);
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);
  const plan: Plan = user?.plan ?? "free";
  const isPro = plan === "pro" || plan === "enterprise";
  return (
    <AuthContext.Provider
      value={{ user, session, isAuthenticated: !!session, loading, plan, isPro, login, signup, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
