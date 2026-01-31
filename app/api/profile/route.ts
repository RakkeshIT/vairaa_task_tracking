import { NextRequest, NextResponse } from "next/server";
import { supabaseRoleClient } from "@/lib/supabaseRoleClient";

export async function GET(req: NextRequest) {
  try {
    // Get session
    const { data: { session } } = await supabaseRoleClient.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user data with profile
    const { data: userData, error: userError } = await supabaseRoleClient
      .from('users')
      .select(`
        *,
        user_profiles (*)
      `)
      .eq('id', userId)
      .single();

    if (userError) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get activity logs
    const { data: activities } = await supabaseRoleClient
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

  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { data: { session } } = await supabaseRoleClient.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();

    // Update basic user info
    const { data: updatedUser, error: userError } = await supabaseRoleClient
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
    const { data: existingProfile } = await supabaseRoleClient
      .from('user_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    let profileData;
    if (existingProfile) {
      // Update existing profile
      const { data: updatedProfile } = await supabaseRoleClient
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
      const { data: newProfile } = await supabaseRoleClient
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
    await supabaseRoleClient
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