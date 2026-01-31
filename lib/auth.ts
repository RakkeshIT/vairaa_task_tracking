// lib/supabase/auth.ts
import { supabaseClient } from "@/lib/supabaseClient";

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string;
  created_at: string;
  last_login?: string;
  status: "active" | "inactive" | "pending";
  student_id: string;
};

/**
 * Get authenticated user details from Supabase
 */
export async function getAuthenticatedUser(): Promise<{
  user: UserProfile | null;
  error: any;
}> {
  try {
    // Get current session
    const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      return { user: null, error: sessionError };
    }

    if (!sessionData.session) {
      return { user: null, error: "No active session" };
    }

    // Get user ID from session
    const userId = sessionData.session.user.id;

    // Fetch user profile from users table
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error("User fetch error:", userError);
      return { user: null, error: userError };
    }

    return { 
      user: userData as UserProfile, 
      error: null 
    };

  } catch (error) {
    console.error("Unexpected error in getAuthenticatedUser:", error);
    return { user: null, error };
  }
}
