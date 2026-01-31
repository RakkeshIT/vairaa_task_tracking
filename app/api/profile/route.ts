import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabaseClient";
import { jwtVerify } from "jose"; // For JWT verification

export async function GET(req: NextRequest) {
  try {
    // Get the JWT token from cookies
    const authCookie = req.cookies.get("auth-cookie")?.value;
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'fallback-secret');
    
    try {
      const { payload } = await jwtVerify(authCookie, secret);
      
      // Now you can access the user ID from the token payload
      const userId = payload.sub; // 'sub' is usually the user ID in JWT
      
      if (!userId) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      // Get user data with profile
      const { data: userData, error: userError } = await supabaseClient
        .from('users')
        .select(`
          *,
          user_profiles (*)
        `)
        .eq('id', userId)
        .single();

      if (userError) {
        console.error("User fetch error:", userError);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Get activity logs
      const { data: activities } = await supabaseClient
        .from('activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      // Format response
      const profileData = {
        ...userData,
        profile: userData.user_profiles?.[0] || {},
        activities: activities || []
      };

      return NextResponse.json(profileData);

    } catch (jwtError) {
      console.error("JWT verification error:", jwtError);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Get the JWT token from cookies
    const authCookie = req.cookies.get("auth-cookie")?.value;
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'fallback-secret');
    
    const { payload } = await jwtVerify(authCookie, secret);
    const userId = payload.sub;
    
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();

    // Update basic user info
    const { data: updatedUser, error: userError } = await supabaseClient
      .from('users')
      .update({
        full_name: body.full_name,
        phone: body.phone,
        location: body.location,
        bio: body.bio,
        department: body.department,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    // Update or create profile
    const { data: existingProfile } = await supabaseClient
      .from('user_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    let profileData;
    if (existingProfile) {
      // Update existing profile
      const { data: updatedProfile } = await supabaseClient
        .from('user_profiles')
        .update({
          linkedin_url: body.linkedin_url,
          twitter_url: body.twitter_url,
          github_url: body.github_url,
          email_notifications: body.email_notifications,
          push_notifications: body.push_notifications,
          two_factor_auth: body.two_factor_auth,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProfile.id)
        .select()
        .single();
      profileData = updatedProfile;
    } else {
      // Create new profile
      const { data: newProfile } = await supabaseClient
        .from('user_profiles')
        .insert({
          user_id: userId,
          linkedin_url: body.linkedin_url,
          twitter_url: body.twitter_url,
          github_url: body.github_url,
          email_notifications: body.email_notifications,
          push_notifications: body.push_notifications,
          two_factor_auth: body.two_factor_auth
        })
        .select()
        .single();
      profileData = newProfile;
    }

    // Log activity
    await supabaseClient
      .from('activity_logs')
      .insert({
        user_id: userId,
        action: 'profile_updated',
        details: 'Updated profile information'
      });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      profile: profileData
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}