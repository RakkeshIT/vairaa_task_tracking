import { supabaseRoleClient } from "@/lib/supabaseRoleClient";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"
interface UserForm {
  full_name: string;
  email: string;
  role: "student" | "admin";
}

function generateStudentId(count: number) {
  return `VCMERN${(101 + count).toString().padStart(3, "0")}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { users } = body; // Array of users for bulk, or single user

    if (!users || !Array.isArray(users)) {
      return NextResponse.json({ error: "Invalid users data" }, { status: 400 });
    }

    const createdUsers = [];

    // Count existing students
    const { count } = await supabaseRoleClient.from("users").select("*", { count: "exact", head: true });
    let currentCount = count || 0;

    for (const u of users) {
      const student_id = generateStudentId(++currentCount);
      const password = Math.random().toString(36).slice(-8);

      // Create Supabase Auth User
      const { data: authData, error: authError } = await supabaseRoleClient.auth.admin.createUser({
        email: u.email,
        password: password,
        email_confirm: true,
        user_metadata: { full_name: u.full_name, role: u.role, student_id },
      });

      if (authError) {
        console.error("Auth Error:", authError);
        continue; // skip this user but continue bulk
      }

      // Insert into users table
      const { error: dbError } = await supabaseRoleClient.from("users").insert({
        id: authData.user?.id,
        full_name: u.full_name,
        email: u.email,
        role: u.role || 'student',
        student_id,
        password: password,
        confirm_at: true,
        created_by: 'admin'
      });

      if (dbError) {
        console.error("DB Error:", dbError);
        continue;
      }

      createdUsers.push({ ...u, student_id, password });
    }

    return NextResponse.json({ success: true, users: createdUsers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "User Can not created", error: error }, { status: 500 });
  }
}
