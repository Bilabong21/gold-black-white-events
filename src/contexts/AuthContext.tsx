import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isSecretary: boolean;
  profile: { first_name: string; last_name: string; phone: string } | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  isSecretary: false,
  profile: null,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSecretary, setIsSecretary] = useState(false);
  const [profile, setProfile] = useState<{ first_name: string; last_name: string; phone: string } | null>(null);

  const checkRoles = async (userId: string, email: string) => {
    // Check admin role from user_roles table
    const { data } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' });
    setIsAdmin(!!data);
    // Secretary check: email contains "secretary"
    setIsSecretary(email.toLowerCase().includes('secretary'));
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('first_name, last_name, phone')
      .eq('user_id', userId)
      .maybeSingle();
    setProfile(data);
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // Defer to avoid Supabase deadlock
        setTimeout(() => {
          checkRoles(session.user.id, session.user.email || '');
          fetchProfile(session.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
        setIsSecretary(false);
        setProfile(null);
      }
      setLoading(false);
    });

    // THEN check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkRoles(session.user.id, session.user.email || '');
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, isSecretary, profile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
