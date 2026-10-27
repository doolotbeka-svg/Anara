import { createHash, timingSafeEqual } from 'node:crypto';

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });

const sha256 = (value: string) => createHash('sha256').update(value).digest();
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Checks the x-admin-password header against ADMIN_PASSWORD.
 * Returns an error response to send back, or null when the request is allowed.
 */
export async function requireAdmin(request: Request): Promise<Response | null> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return json({ error: 'admin_not_configured' }, 503);

  let given = '';
  try {
    given = decodeURIComponent(request.headers.get('x-admin-password') ?? '');
  } catch {
    // malformed header counts as a wrong password
  }
  if (timingSafeEqual(sha256(given), sha256(expected))) return null;

  // Slows down password guessing
  await sleep(1000);
  return json({ error: 'unauthorized' }, 401);
}
