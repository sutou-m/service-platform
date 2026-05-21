import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export async function sendEmail(options: {
  to:      string | string[];
  subject: string;
  html:    string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[sendEmail] RESEND_API_KEY is not set");
    return;
  }

  // シングルトンではなくリクエストごとに生成して env var の遅延読み込みを保証する
  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from:    FROM,
      to:      Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html:    options.html,
    });

    if (error) {
      console.error("[sendEmail] Resend API error:", JSON.stringify(error));
    } else {
      console.log("[sendEmail] Sent OK id:", data?.id, "to:", options.to, "subject:", options.subject);
    }
  } catch (err) {
    console.error("[sendEmail] Unexpected error:", err);
  }
}
