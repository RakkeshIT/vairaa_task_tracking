import { NextResponse, NextRequest } from "next/server";
import { supabaseClient } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";
import { supabaseRoleClient } from "@/lib/supabaseRoleClient";
interface props {
  token?: string;
  password?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: props = await req.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and Password Must" },
      );
    }

    const { data: tokenRec, error: tokenError } = await supabaseClient
      .from("password_resets")
      .select("*")
      .eq("token", token)
      .single();

    if (tokenError || !tokenRec) {
      return NextResponse.json(
        {
          message:
            "Invalid Token or User Not Found. Error From Token Reset API",
          error: tokenError?.message,
        },
        { status: 404 },
      );
    }

    if (new Date(tokenRec.expires_at) < new Date()) {
      return NextResponse.json({ message: "Token expired" }, { status: 410 });
    }

    const userId = tokenRec.user_id;

    const hashPassword = await bcrypt.hashSync(password, 10);
    const { data: updateUser, error: updateError } =
      await supabaseRoleClient.auth.admin.updateUserById(userId, {
        password: password,
      });
    if (updateError) {
      return NextResponse.json(
        { message: "Failed to update password", error: updateError.message },
        { status: 500 },
      );
    }

    const { error: userError } = await supabaseClient
      .from("users")
      .update({
        password: hashPassword,
      })
      .eq("id", userId);
    if (userError) {
      return NextResponse.json(
        {
          message: "Auth updated but DB update failed",
          error: userError.message,
        },
        { status: 500 },
      );
    }

    await supabaseClient.from("password_resets").delete().eq("token", token);

    return NextResponse.json(
      {
        message:
          "Password Created Successfully, You are now Eligible for access your dahbord",
        updateUser,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server Error Password Can not Set. Contact Admin.",
        error: error,
      },
      { status: 500 },
    );
  }
}
