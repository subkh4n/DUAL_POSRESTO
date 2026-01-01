import * as brevo from "@getbrevo/brevo";
import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy initialization of Supabase to avoid build-time errors
let supabaseInstance: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "Supabase credentials missing. Email logging will be skipped."
    );
    return null;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

interface EmailRequestBody {
  email: string;
  subject: string;
  content: string;
}

export async function POST(req: Request) {
  let body: Partial<EmailRequestBody> = {};
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
    sendSmtpEmail.to = [{ email: email || "" }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    // LOG SUCCESS (skip if Supabase is not configured)
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from("email_logs").insert({
        recipient: email,
        subject: subject,
        status: "SUCCESS",
      });
    }

    return NextResponse.json({ message: "Email terkirim!" }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Brevo Error:", error);

    // LOG FAILURE (skip if Supabase is not configured)
    try {
      const supabase = getSupabase();
      if (supabase) {
        await supabase.from("email_logs").insert({
          recipient: body.email || "unknown",
          subject: body.subject || "No Subject",
          status: "FAILED",
          error_message: errorMessage,
        });
      }
    } catch (logErr) {
      console.error("Logging Error:", logErr);
    }

    return NextResponse.json(
      { error: "Gagal mengirim email: " + errorMessage },
      { status: 500 }
    );
  }
}
