"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

export type UserRole = "AdminPusat" | "BranchAdmin" | "Customer";

interface UserProfile {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  role: UserRole;
  branchId?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  login: (
    phone: string,
    role: UserRole,
    name?: string,
    branchId?: string
  ) => void; // Legacy
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdminPusat: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check active session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        await fetchUserProfile(session.user);
      } else {
        // Fallback to localStorage for legacy simple login
        const savedUser = localStorage.getItem("resto_user");
        if (savedUser) setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    getInitialSession();

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchUserProfile(session.user);
      } else {
        // Only clear if no legacy user
        if (!localStorage.getItem("resto_user")) setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", supabaseUser.id)
      .single();

    if (data) {
      setUser({
        id: data.id,
        email: data.email || supabaseUser.email,
        name: data.name || supabaseUser.user_metadata?.full_name,
        role: data.role as UserRole,
        branchId: data.branch_id,
      });
    } else {
      // New user from Google/Auth
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.full_name,
        role: "Customer",
      });
    }
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/app",
      },
    });
  };

  const signInWithEmail = async (email: string) => {
    // For simplicity in this demo, we'll use OTP or direct sign in if configured
    // This logic can be refined based on user preference (OTP vs Password)
    await supabase.auth.signInWithOtp({ email });
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) throw error;
  };

  const login = (
    phone: string,
    role: UserRole,
    name?: string,
    branchId?: string
  ) => {
    const legacyUser = { id: "legacy", phone, name, role, branchId };
    setUser(legacyUser);
    localStorage.setItem("resto_user", JSON.stringify(legacyUser));
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("resto_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithEmail,
        resetPassword,
        login,
        logout,
        isAuthenticated: !!user,
        isAdminPusat: user?.role === "AdminPusat",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
