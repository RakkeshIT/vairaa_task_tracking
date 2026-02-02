import { cookies } from "next/headers";
import { supabaseRoleClient } from "@/lib/supabaseRoleClient";

export async function getAuthenticatedUser() {
  try {
    // 1️⃣ Get token from cookie
    const cookieStore = cookies();
    const token = (await cookieStore).get("auth-cookie")?.value;

    if (!token) {
      return { user: null, error: "No authentication token" };
    }

    // 2️⃣ Validate token with Supabase
    const {
      data: { user: authUser },
      error: authError,
    } = await supabaseRoleClient.auth.getUser(token);

    if (authError || !authUser) {
      return { user: null, error: authError || "Invalid token" };
    }

    // 3️⃣ Fetch from custom users table
    const { data: userData, error: userError } =
      await supabaseRoleClient
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();

    if (userError) {
      return { user: null, error: userError };
    }

    // 4️⃣ If no row exists in users table → fallback to auth user
    if (!userData) {
      return {
        user: {
          id: authUser.id,
          email: authUser.email || "",
          full_name: authUser.user_metadata?.full_name || "User",
          role: authUser.user_metadata?.role || "user",
          avatar_url: authUser.user_metadata?.avatar_url,
          created_at: authUser.created_at,
          status: "active",
          student_id: "",
        },
        error: null,
      };
    }

    return {
      user: userData,
      error: null,
    };
  } catch (error) {
    console.error("Unexpected auth error:", error);
    return { user: null, error };
  }
}



