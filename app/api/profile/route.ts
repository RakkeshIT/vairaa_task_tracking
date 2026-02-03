import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { supabaseRoleClient } from "@/lib/supabaseRoleClient";
import cloudinary from "@/lib/cloudinary";
import { Upload } from "lucide-react";
interface FormFields {
  [key: string]: string | number | boolean
}

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
    const { data: userDetails, error: userDetailsError } = await supabaseRoleClient
      .from("users")
      .select("*")
      .eq("email", user.email)
      .maybeSingle();
     if (userDetailsError || !userDetails) {
      console.error("User upsert error:", userDetailsError);
      return NextResponse.json(
        { error: userDetailsError?.message },
        { status: 500 },
      );
    }
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
    const authCookie = req.cookies.get("auth-cookie")?.value;
    if (!authCookie) {
      return NextResponse.json(
        { error: "Unauthorized - No token" },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const fields: FormFields = {};
    const keys = [
      "user_id",
      "phone",
      "location",
      "bio",
      "department",
      "linkedin_url",
      "twitter_url",
      "github_url",
      "email_notifications",
      "push_notifications",
      "two_factor_auth",
      "avatar_url",
    ];

    keys.forEach((key) => {
      const value = formData.get(key);
      if (value !== null) fields[key] = value.toString();
    });
    // Cloudinary
    const avatarURL = formData.get("avatar") as File | null;
    if (avatarURL && avatarURL.size > 0) {
      const buffer = Buffer.from(await avatarURL?.arrayBuffer());
      const uploadFile: any = await new Promise((res, rej) =>
        cloudinary.uploader.upload_stream(
          { folder: "Profiles_images" },
          (err, result) =>
            err ? rej(err) : res(result)
        ).end(buffer)
      )
      fields.avatar_url = uploadFile.secure_url;
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
          phone: fields.phone,
          bio: fields.bio,
          location: fields.location,
          department: fields.department,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" },
      )
      .select("*")
      .maybeSingle();

    if (userError || !updatedUser) {
      console.error("User upsert error:", userError);
      return NextResponse.json(
        { error: userError?.message },
        { status: 500 },
      );
    }
    const userId = updatedUser.id;
    console.log("User If form Profile: ", userId);
    console.log("Fields: ", fields);
    // Update or create profile
    const { data: profileData, error: profileError } = await supabaseRoleClient
      .from("user_profiles")
      .upsert(
        {
          user_id: updatedUser.id,
          ...fields,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )
      .select("*")
      .maybeSingle();
    if (profileError) {
      return NextResponse.json({
        message: "Profile not Updated",
        error: profileError.message,
      });
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
