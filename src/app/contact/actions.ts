"use server";

import { sendMail } from "@/lib/mail";
import { adminNotificationEmail, acknowledgementEmail } from "@/lib/email-templates";

export type ContactFormState = { error?: string; success?: true } | undefined;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim() || "Something else";
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { error: "Please fill in your name, email, and message." };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const adminInbox = process.env.CONTACT_ADMIN_EMAIL;
  if (!adminInbox) {
    console.error("[contact] CONTACT_ADMIN_EMAIL is not set.");
    return { error: "Something went wrong on our end. Please try again later." };
  }

  const submission = { name, email, reason, message };

  try {
    const admin = adminNotificationEmail(submission);
    const ack = acknowledgementEmail(submission);

    await Promise.all([
      sendMail({ to: adminInbox, replyTo: email, ...admin }),
      sendMail({ to: email, ...ack }),
    ]);
  } catch (err) {
    console.error("[contact] Failed to send email:", err);
    return { error: "Something went wrong sending your message. Please try again." };
  }

  return { success: true };
}
