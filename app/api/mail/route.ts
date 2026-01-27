// Bulk Users Mail
import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "../../../lib/supabaseClient";
import ExcelJS from "exceljs";
import * as nodemailer from "nodemailer";
interface Student {
  full_name: string;
  email: string;
  student_id: string;
  password: string;
}
// POST: /api/mail
export async function POST(req: NextRequest) {
  try {
    const { data: students, error } = await supabaseClient
      .from("users")
      .select("full_name, email, password, student_id")
      .eq("role", "student");

    if (error) {
      return NextResponse.json(
        { message: "Somthing Error", error: error },
        { status: 400 },
      );
    }

    const workBook = new ExcelJS.Workbook();
    const worksheet = workBook.addWorksheet("Students");
    worksheet.columns = [
      { header: "Student ID", key: "student_id", width: 15 },
      { header: "Full Name", key: "full_name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Password", key: "password", width: 20 },
    ];
    if (!students) throw new Error("No students found");
    students?.forEach((stu: Student) => {
      worksheet.addRow({
        student_id: stu.student_id,
        full_name: stu.full_name,
        email: stu.email,
        password: stu.password,
      });
    });

    const buffer = await workBook.xlsx.writeBuffer();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_APP_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: `"Vairaa Coders" <${process.env.EMAIL}>`,
      to: "rakkeshit@gmail.com",
      subject: "📊 Student Login Details - Excel Report",
      html: `
        <h2>Student Report</h2>
        <p>Attached is the Excel file with student login details.</p>
      `,
      attachments: [
        {
          filename: "students.xlsx",
          content: Buffer.from(buffer),
        },
      ],
    });

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
