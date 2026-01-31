// Bulk Users Mail
import { NextRequest, NextResponse } from "next/server";
import * as nodemailer from "nodemailer";
import { supabaseRoleClient } from "@/lib/supabaseRoleClient";
// POST: /api/mail
interface Student {
  full_name: string;
  email: string;
  student_id: string;
  password: string;
}
export async function POST(req: NextRequest) {
  try {
    const { data: students, error } = await supabaseRoleClient
      .from("users")
      .select("full_name, email, password, student_id")
      .eq("role", "student");

    if (error) {
      return NextResponse.json(
        { message: "Somthing Error", error: error },
        { status: 400 },
      );
    }


    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_APP_PASSWORD,
      },
    });
    for(const student of students as Student[]){
        await transporter.sendMail({
          from: `"Vairaa Coders" <${process.env.EMAIL}>`,
          to: student?.email,
          subject: "📊 Student Login Details - Excel Report",
          html: `
            <h2>Your Password</h2>
            <p>Welcome ${student?.full_name}</p>
            <p>Your Email ${student?.email}</p>
            <p>Your Password Setup Code ${student?.password}</p>
            <a href='https://vairaa-task-tracking.vercel.app/auth/set-password'>Click Password Set-up Page</a>
          `,
        });

    }

    return NextResponse.json(
      { message: "User Fetched Success", data: students },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "User Can not fetch", error: error },
      { status: 500 },
    );
  }
}
