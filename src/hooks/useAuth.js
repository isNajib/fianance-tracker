import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(null);

  useEffect(() => {
    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setAuthLoading(false);
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function Logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("Gagal Logout:", error);
      return false;
    }

    return true;
  }

  return {
    session,
    user: session?.user ?? null,
    authLoading,
    Logout,
  };
}
