import { adminPassword, clientIp, isCorrectPassword, issueToken, json } from '../_lib/http.js';
import { globalRule, ipRule, reserveAttempt, resetAttempts, TooManyRetriesError } from '../_lib/lockout.js';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const locked = (retryAfter: number) =>
  json({ error: 'locked', retryAfter }, 429, { 'Retry-After': String(retryAfter) });

export async function POST(request: Request): Promise<Response> {
  if (!adminPassword()) return json({ error: 'admin_not_configured' }, 503);

  const ip = ipRule(clientIp(request));
  try {
    // The address is checked first, so one blocked address can't use up the shared limit
    const ipWait = await reserveAttempt(ip);
    if (ipWait) return locked(ipWait);
    const globalWait = await reserveAttempt(globalRule);
    if (globalWait) return locked(globalWait);
  } catch (error) {
    if (error instanceof TooManyRetriesError) return locked(60);
    // Fail closed: without the attempt counter there is no login
    console.error('Login attempt counter unavailable', error);
    return json({ error: 'storage_error' }, 503);
  }

  let password = '';
  try {
    ({ password } = await request.json());
  } catch {
    // treated as a wrong password
  }

  if (typeof password !== 'string' || !isCorrectPassword(password)) {
    await sleep(1000);
    return json({ error: 'unauthorized' }, 401);
  }

  await Promise.all([resetAttempts(ip), resetAttempts(globalRule)]).catch((error) =>
    console.error('Failed to reset login attempts', error)
  );
  return json(issueToken());
}
