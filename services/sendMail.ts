import nodemailer from "nodemailer";

export async function sendPasswordEmail(email: string, token: string) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_EMAIL_APP_PASSWORD,
            },
        });

        const URL =
            process.env.NODE_ENV === "production"
                ? process.env.NEXT_PUBLIC_FRONTEND_URL
                : process.env.NEXT_PUBLIC_LOCAL_URL;

        await transporter.sendMail({
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: "Set your account password",
            html: `<div style="font-family: Arial, sans-serif; background:#f6f9fc; padding:40px 0;"> <table width="100%" cellpadding="0" cellspacing="0"> <tr> <td align="center"> <table width="100%" style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08)"> <!-- Header --> <tr> <td style="background:linear-gradient(135deg,#f59e0b,#fbbf24);padding:24px;text-align:center;"> <h2 style="margin:0;color:#ffffff;">Vairaa Learning Portal</h2> </td> </tr> <!-- Body --> <tr> <td style="padding:32px;color:#333333;"> <h3 style="margin-top:0;">Hello 👋</h3> <p style="font-size:15px;line-height:1.6;"> Your account has been created successfully. Click the button below to set your password and access your dashboard. </p> <div style="text-align:center;margin:32px 0;"> <a href="${URL}/auth/set-password/${encodeURIComponent(token)}" style=" background:#f59e0b; color:white; text-decoration:none; padding:14px 28px; border-radius:8px; display:inline-block; font-weight:bold; "> Set Password </a> </div> <p style="font-size:14px;color:#666;"> ⏰ This link will expire in <strong>24 hours</strong>. </p> <p style="font-size:14px;color:#666;"> If you did not request this, please ignore this email. </p> <p style="margin-top:32px;font-size:14px;"> Regards,<br/> <strong>Vairaa Team</strong> </p> </td> </tr> <!-- Footer --> <tr> <td style="background:#f3f4f6;padding:16px;text-align:center;font-size:12px;color:#888;"> © ${new Date().getFullYear()} Vairaa Learning. All rights reserved. </td> </tr> </table> </td> </tr> </table> </div>`,
        });
    } catch (err) {
        console.error("Email send failed:", err);
    }
}
