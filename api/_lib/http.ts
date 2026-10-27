import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });

const sha256 = (value: string) => createHash('sha256').update(value).digest();
const sameSecret = (a: string, b: string) => timingSafeEqual(sha256(a), sha256(b));

export const adminPassword = () => process.env.ADMIN_PASSWORD || null;

export function isCorrectPassword(given: string): boolean {
  const expected = adminPassword();
  return !!expected && sameSecret(given, expected);
}

/** Vercel sets x-forwarded-for itself and drops the client's value, so it can't be spoofed there. */
export const clientIp = (request: Request) =>
  request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';

// Session tokens: "<expiry>.<hmac>". The key is derived from the password,
// so changing ADMIN_PASSWORD in Vercel ends all sessions.
const SESSION_MS = 24 * 60 * 60 * 1000;
const sign = (payload: string, password: string) =>
  createHmac('sha256', sha256(`anara-admin-session:${password}`)).update(payload).digest('base64url');

export function issueToken(): { token: string; expiresAt: string } {
  const expiresAt = Date.now() + SESSION_MS;
  const payload = String(expiresAt);
  return { token: `${payload}.${sign(payload, adminPassword()!)}`, expiresAt: new Date(expiresAt).toISOString() };
}

function isValidToken(token: string): boolean {
  const password = adminPassword();
  const [payload, signature] = token.split('.');
  if (!password || !payload || !signature) return false;
  return Number(payload) > Date.now() && sameSecret(signature, sign(payload, password));
}

/**
 * Checks the session token (Authorization: Bearer ...) from /api/admin/login.
 * Returns an error response to send back, or null when the request is allowed.
 */
export function requireAdmin(request: Request): Response | null {
  if (!adminPassword()) return json({ error: 'admin_not_configured' }, 503);
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  return isValidToken(token) ? null : json({ error: 'unauthorized' }, 401);
}
