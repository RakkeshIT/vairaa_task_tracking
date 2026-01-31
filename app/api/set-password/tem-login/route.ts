import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import { supabaseRoleClient } from "@/lib/supabaseRoleClient";
import { sendPasswordEmail } from "@/app/services/sendMail";

export const runtime = "nodejs"; // IMPORTANT

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Get user
    const { data: user, error } = await supabaseRoleClient
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { message: "Database error", error: error.message },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Generate token
    const token = crypto.randomBytes(32).toString("hex");

    await supabaseRoleClient.from("password_resets").insert({
      user_id: user.id,
      token,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // 3️⃣ Send email in background (DON'T await)
    sendPasswordEmail(email, token);

    // 4️⃣ Respond immediately
    return NextResponse.json({
      success: true,
      message: "Password setup email sent",
    });

  } catch (error) {
    console.error("TEMP LOGIN ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
