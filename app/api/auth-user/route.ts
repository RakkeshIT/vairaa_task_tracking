import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  try {
    const { user, error } = await getAuthenticatedUser();

    if (error || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Auth User Fetch Success", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auth API Error:", error);

    return NextResponse.json(
      { message: "Auth User Fetch Failed" },
      { status: 500 }
    );
  }
}
