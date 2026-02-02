import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { supabaseRoleClient } from "@/lib/supabaseRoleClient";

/**
 * GET /api/profile
 * Fetch authenticated user details + profile
 */
export async function GET(req: NextRequest) {
  try {
    const authCookie = req.cookies.get("auth-cookie")?.value;
    if (!authCookie) {
      return NextResponse.json(
        { error: "Unauthorized - No token" },
        { status: 401 },
      );
    }

    // Verify user via Supabase Auth
    const {
      data: { user },
      error,
    } = await supabaseRoleClient.auth.getUser(authCookie);
    if (error || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Fetch user info from custom 'users' table
    const { data: userDetails } = await supabaseRoleClient
      .from("users")
      .select("*")
      .eq("email", user.email)
      .maybeSingle();

    const userId = userDetails.id;
    // Fetch profile info from 'user_profiles'
    const { data: userProfile } = await supabaseRoleClient
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    return NextResponse.json({
      user: userDetails || user, // fallback to Auth user if no row in 'users'
      profile: userProfile,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * PUT /api/profile
 * Update authenticated user info + profile
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const authCookie = req.cookies.get("auth-cookie")?.value;
    console.log("Body: ", body);
    if (!authCookie) {
      return NextResponse.json(
        { error: "Unauthorized - No token" },
        { status: 401 },
      );
    }

    // Verify user via Supabase Auth
    const {
      data: { user },
      error,
    } = await supabaseRoleClient.auth.getUser(authCookie);
    if (error || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userEmail = user.email;
    // Update or create user info in 'users'
    const { data: updatedUser, error: userError } = await supabaseRoleClient
      .from("users")
      .upsert(
        {
          email: userEmail,
          phone: body.phone,
          location: body.location,
          bio: body.bio,
          department: body.department,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" },
      )
      .select("*")
      .maybeSingle();

    const userId = updatedUser.id;
    console.log("User If form Profile: ", userId);

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    // Update or create profile
    const { data: existingProfile } = await supabaseRoleClient
      .from("user_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    let profileData;
    if (existingProfile) {
      const { data: updatedProfile, error: updateError } = await supabaseRoleClient
        .from("user_profiles")
        .update({
          phone: body.phone || "",
          location: body.location || "",
          bio: body.bio || "",
          department: body.department || "",
          linkedin_url: body.linkedin_url || "",
          twitter_url: body.twitter_url || "",
          github_url: body.github_url || "",
          email_notifications: body.email_notifications ?? false,
          push_notifications: body.push_notifications ?? false,
          two_factor_auth: body.two_factor_auth ?? false,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .select("*")
        .maybeSingle();

      if (updateError) console.error("Profile update error:", updateError);
      profileData = updatedProfile;
    } else {
      const { data: newProfile, error: profileError } = await supabaseRoleClient
        .from("user_profiles")
        .insert({
          user_id: userId,
          phone: body.phone || "",
          location: body.location || "",
          bio: body.bio || "",
          department: body.department || "",
          linkedin_url: body.linkedin_url || "",
          twitter_url: body.twitter_url || "",
          github_url: body.github_url || "",
          email_notifications: body.email_notifications ?? false,
          push_notifications: body.push_notifications ?? false,
          two_factor_auth: body.two_factor_auth ?? false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select("*") // fetch full row back
        .maybeSingle();

      if (profileError) {
        console.error("Profile insert error:", profileError);
      }
      profileData = newProfile;
    }

    // Log activity
    await supabaseRoleClient.from("activity_logs").insert({
      user_id: userId,
      action: "profile_updated",
      details: "Updated profile information",
    });

    return NextResponse.json(
      {
        user: updatedUser,
        profile: profileData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
