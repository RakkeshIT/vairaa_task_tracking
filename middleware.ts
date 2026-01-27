// middleware.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Server-side Supabase client (service role)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // must be Service Role Key
);

export async function middleware(req: NextRequest) {
  // Get auth token from cookie
  const token = req.cookies.get("auth-cookie")?.value;

  // Not logged in → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Get user info from Supabase Auth
  const { data: userData, error: userError } =
    await supabase.auth.getUser(token);
  const user = userData.user;

  if (!user || userError) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Get role from users table
  const { data, error: dbError } = await supabase
    .from("users")
    .select("role")
    .eq("email", user.email)
    .maybeSingle();

  const role = data?.role;

  // Error fetching role → redirect to login
  console.log("Users: ", userData)
  console.log("Data with role: ", data)
  if (dbError) {
    console.log("DB ERROR: ", dbError.message)
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (!userData) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  const pathname = req.nextUrl.pathname;

  // Admin → access admin routes
  if (role === "admin") {
    if (pathname.startsWith("/admin")) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // Non-admin → redirect to dashboard if trying to access admin
  if (role !== "admin") {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
