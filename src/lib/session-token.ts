// Shared by session.ts (Server Components/Actions, via next/headers cookies())
// and proxy.ts (runs on every request, reads the cookie straight off NextRequest).
// Uses the Web Crypto API (crypto.subtle) instead of node:crypto — proxy.ts
// runs on Vercel's Edge runtime, which doesn't support Node's crypto module.

export const SESSION_COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours
export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;

type SessionPayload = { userId: number; expiresAt: number };

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCodePoint(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlDecode(value: string): Uint8Array {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.codePointAt(i) ?? 0;
  return bytes;
}

async function getHmacKey(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set.");
  }
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(userId: number): Promise<string> {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload: SessionPayload = { userId, expiresAt };
  const value = base64UrlEncode(encoder.encode(JSON.stringify(payload)));

  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));

  return `${value}.${base64UrlEncode(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token: string): Promise<{ userId: number } | null> {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const value = token.slice(0, dotIndex);
  const signatureEncoded = token.slice(dotIndex + 1);

  let key: CryptoKey;
  try {
    key = await getHmacKey();
  } catch {
    return null;
  }

  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlDecode(signatureEncoded) as BufferSource,
    encoder.encode(value)
  );
  if (!valid) return null;

  try {
    const payload = JSON.parse(decoder.decode(base64UrlDecode(value))) as SessionPayload;
    if (Date.now() > payload.expiresAt) return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}
