export type ContactSubmission = {
  name: string;
  email: string;
  reason: string;
  message: string;
};

type Email = { subject: string; html: string; text: string };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Many email clients (Outlook in particular) ignore `white-space: pre-wrap`,
// so line breaks the user typed need to become real <br> tags to survive.
function formatMessageHtml(message: string): string {
  return escapeHtml(message).replace(/\r\n|\r|\n/g, "<br>");
}

// Inline styles + a table-free layout so this renders consistently across
// Gmail, Apple Mail, and Outlook.com — mirrors the "Sticker Studio" look used
// on the live /contact page (cream background, black borders, mango yellow).
function shell(bodyHtml: string): string {
  return `<div style="background:#FFF7DA;padding:40px 16px;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:3px solid #161310;border-radius:18px;overflow:hidden;">
    <div style="background:#FFC21F;padding:24px 32px;border-bottom:3px solid #161310;">
      <div style="font-weight:900;font-size:13px;letter-spacing:0.08em;color:#161310;text-transform:uppercase;">
        At the Crossroads
      </div>
    </div>
    <div style="padding:36px 32px;">
      ${bodyHtml}
    </div>
    <div style="background:#FFF7DA;padding:20px 32px;border-top:2px solid rgba(22,19,16,0.15);font-size:12px;color:rgba(22,19,16,0.6);">
      Sent from the contact form at At the Crossroads.
    </div>
  </div>
</div>`;
}

// Shared "quoted message" block — labeled, roomy, and preserves the line
// breaks the sender actually typed.
function messageBlock(message: string): string {
  return `<div style="margin-top:28px;">
      <div style="margin-bottom:10px;font-weight:bold;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(22,19,16,0.45);">
        Message
      </div>
      <div style="background:#FFF7DA;border:2px solid rgba(22,19,16,0.12);border-radius:12px;padding:20px;color:#161310;font-size:14px;line-height:1.7;">${formatMessageHtml(message)}</div>
    </div>`;
}

export function adminNotificationEmail(data: ContactSubmission): Email {
  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const reason = escapeHtml(data.reason);

  const html = shell(`
    <div style="display:inline-block;background:#161310;color:#FFC21F;font-weight:900;font-size:11px;letter-spacing:0.06em;padding:6px 12px;border-radius:6px;margin-bottom:20px;">
      NEW CONTACT MESSAGE
    </div>
    <h1 style="margin:0 0 24px;font-size:22px;color:#161310;">${reason}</h1>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr>
        <td style="padding:10px 0;font-weight:bold;color:rgba(22,19,16,0.6);width:90px;vertical-align:top;">From</td>
        <td style="padding:10px 0;color:#161310;">${name}</td>
      </tr>
      <tr style="border-top:1px solid rgba(22,19,16,0.08);">
        <td style="padding:10px 0;font-weight:bold;color:rgba(22,19,16,0.6);vertical-align:top;">Email</td>
        <td style="padding:10px 0;"><a href="mailto:${email}" style="color:#2B4E55;">${email}</a></td>
      </tr>
    </table>
    ${messageBlock(data.message)}
  `);

  const text = `New contact message (${data.reason})\n\nFrom: ${data.name}\nEmail: ${data.email}\n\n${data.message}`;

  return { subject: `New message: ${data.reason} — ${data.name}`, html, text };
}

export function acknowledgementEmail(data: ContactSubmission): Email {
  const firstName = escapeHtml(data.name.split(" ")[0] || data.name);

  const html = shell(`
    <div style="display:inline-block;background:#FFC21F;color:#161310;font-weight:900;font-size:11px;letter-spacing:0.06em;padding:6px 12px;border-radius:6px;margin-bottom:20px;">
      MESSAGE RECEIVED
    </div>
    <h1 style="margin:0 0 16px;font-size:22px;color:#161310;">Thanks, ${firstName} — got it.</h1>
    <p style="margin:0;color:rgba(22,19,16,0.6);line-height:1.7;font-size:15px;">
      I read every message myself and reply within a few days. Here&#39;s a copy of what you sent, for your records:
    </p>
    ${messageBlock(data.message)}
  `);

  const firstNamePlain = data.name.split(" ")[0] || data.name;
  const text = `Thanks, ${firstNamePlain} — got it.\n\nI read every message myself and reply within a few days. Here's a copy of what you sent:\n\n${data.message}`;

  return { subject: "We got your message — At The Crossroads", html, text };
}
