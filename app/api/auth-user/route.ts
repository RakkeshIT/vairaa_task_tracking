import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { supabaseRoleClient } from "@/lib/supabaseRoleClient";

export async function GET() {
  try {
    const { user, error } = await getAuthenticatedUser();
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { data: userdata, error: userError } = await supabaseRoleClient
      .from("users")
      .select("*")
      .eq("email", user.email)
      .maybeSingle();

    if (!userdata || userError) {
      console.log("user data Error: ", userError?.message);
      return NextResponse.json({ error: "user not fetch" }, { status: 500 });
    }
    const userId = userdata.id;

    const { data: profileData, error: profileError } = await supabaseRoleClient
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileError) {
      console.log("Profile data Error: ", profileError?.message);
      return NextResponse.json({ error: profileError?.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Auth User Fetch Success",
        data: {
          user,
          profileData,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Auth API Error:", error);

    return NextResponse.json(
      { message: "Auth User Fetch Failed" },
      { status: 500 },
    );
  }
}
