import crypto from "node:crypto";

// Shared by session.ts (Server Components/Actions, via next/headers cookies())
// and proxy.ts (runs on every request, reads the cookie straight off NextRequest).
// Kept dependency-free (no next/headers import) so both can use it.

export const SESSION_COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours
export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;

type SessionPayload = { userId: number; expiresAt: number };

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set.");
  }
  return secret;
}

export function createSessionToken(userId: number): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload: SessionPayload = { userId, expiresAt };
  const value = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
  return `${value}.${signature}`;
}

export function verifySessionToken(token: string): { userId: number } | null {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const value = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);
  const expected = crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  try {
    const payload = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as SessionPayload;
    if (Date.now() > payload.expiresAt) return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}
