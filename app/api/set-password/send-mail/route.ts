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
    for (const student of students as Student[]) {
      await transporter.sendMail({
        from: `"Vairaa Coders" <${process.env.EMAIL}>`,
        to: student?.email,
        subject: "Welcome to Vairaa Coders - Login Details",
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #d97706; margin: 0;">Vairaa Coders</h2>
        <p style="color: #92400e; margin: 5px 0 0 0;">Student Portal Access</p>
      </div>

      <div style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h3 style="color: #374151; margin-top: 0;">Welcome ${student?.full_name} 👋</h3>
        
        <p style="color: #6b7280; line-height: 1.6;">
          Your account has been created successfully. Here are your login details:
        </p>

        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 0 0 10px 0;">
            <strong style="color: #92400e;">Email:</strong><br>
            <span style="color: #374151;">${student?.email}</span>
          </p>
          <p style="margin: 0;">
            <strong style="color: #92400e;">Setup Code:</strong><br>
            <code style="background: #fde68a; padding: 5px 10px; border-radius: 4px; font-size: 16px; color: #92400e; font-weight: bold;">
              ${student?.password}
            </code>
          </p>
        </div>

        <p style="color: #6b7280; line-height: 1.6;">
          Please use this code to set up your password and access your account.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://vairaa-task-tracking.vercel.app/auth/set-password" 
             style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Set Up Your Password
          </a>
        </div>

        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #f3f4f6; color: #9ca3af; font-size: 14px;">
          <p style="margin: 0;">
            <strong>Important:</strong> 
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>This code is for one-time use only</li>
              <li>Do not share your setup code with anyone</li>
              <li>For security reasons, set up your password within 24 hours</li>
            </ul>
          </p>
        </div>
      </div>

      <div style="text-align: center; margin-top: 20px; color: #92400e; font-size: 12px;">
        <p style="margin: 0;">Vairaa Coders &copy; ${new Date().getFullYear()}</p>
        <p style="margin: 5px 0;">Need help? Contact our support team</p>
      </div>
    </div>
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
