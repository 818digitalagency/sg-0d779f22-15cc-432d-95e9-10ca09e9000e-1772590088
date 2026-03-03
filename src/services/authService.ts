/**
 * Authentication Service
 * Handles all authentication-related operations with Supabase
 */

import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session, AuthError } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  role?: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  error: AuthError | null;
}

export class AuthService {
  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      // Get profile data
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      return {
        id: user.id,
        email: user.email || "",
        fullName: profile?.full_name || undefined,
        avatarUrl: profile?.avatar_url || undefined
      };
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  /**
   * Get current session
   */
  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error("Error getting session:", error);
      return null;
    }
  }

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, fullName?: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        return { user: null, error };
      }

      if (!data.user) {
        return { 
          user: null, 
          error: { 
            message: "Sign up failed", 
            name: "SignUpError",
            status: 400
          } as AuthError 
        };
      }

      // Create profile entry
      if (fullName) {
        await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            full_name: fullName,
            email: data.user.email
          });
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email || "",
          fullName
        },
        error: null
      };
    } catch (error) {
      console.error("Sign up error:", error);
      return { 
        user: null, 
        error: error as AuthError 
      };
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { user: null, error };
      }

      if (!data.user) {
        return { 
          user: null, 
          error: { 
            message: "Sign in failed", 
            name: "SignInError",
            status: 400
          } as AuthError 
        };
      }

      // Get profile data
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", data.user.id)
        .single();

      return {
        user: {
          id: data.user.id,
          email: data.user.email || "",
          fullName: profile?.full_name || undefined,
          avatarUrl: profile?.avatar_url || undefined
        },
        error: null
      };
    } catch (error) {
      console.error("Sign in error:", error);
      return { 
        user: null, 
        error: error as AuthError 
      };
    }
  }

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      return { error };
    } catch (error) {
      console.error("Google sign in error:", error);
      return { error: error as AuthError };
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error("Sign out error:", error);
      return { error: error as AuthError };
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      return { error };
    } catch (error) {
      console.error("Reset password error:", error);
      return { error: error as AuthError };
    }
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      return { error };
    } catch (error) {
      console.error("Update password error:", error);
      return { error: error as AuthError };
    }
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void): { unsubscribe: () => void } {
    const { data } = supabase.auth.onAuthStateChange(callback);
    return data.subscription;
  }
}

export const authService = new AuthService();