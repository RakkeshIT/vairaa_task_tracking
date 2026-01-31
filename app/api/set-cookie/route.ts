import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body?.token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 },
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: "auth-cookie",
      value: body.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to set cookie" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
  response.cookies.delete({
    name: "auth-cookie",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}
