import * as brevo from "@getbrevo/brevo";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase for logging
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(req: Request) {
  let body: any = {};
  try {
    body = await req.json();
    const { email, subject, content } = body;

    const apiInstance = new brevo.TransactionalEmailsApi();

    // Set API Key
    const apiKey = process.env.BREVO_API_KEY || "";
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = `<html><body>${content}</body></html>`;
    sendSmtpEmail.sender = {
      name: process.env.SENDER_NAME || "Admin",
      email: process.env.SENDER_EMAIL || "admin@domainanda.com",
    };
    sendSmtpEmail.to = [{ email: email }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    // LOG SUCCESS
    await supabase.from("email_logs").insert({
      recipient: email,
      subject: subject,
      status: "SUCCESS",
    });

    return NextResponse.json({ message: "Email terkirim!" }, { status: 200 });
  } catch (error: any) {
    console.error("Brevo Error:", error);

    // LOG FAILURE
    try {
      await supabase.from("email_logs").insert({
        recipient: body.email || "unknown",
        subject: body.subject || "No Subject",
        status: "FAILED",
        error_message: error.message || String(error),
      });
    } catch (logErr) {
      console.error("Logging Error:", logErr);
    }

    return NextResponse.json(
      { error: "Gagal mengirim email: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
