import { resolveData } from '../src/content/merge.js';
import { readContent } from './_lib/content.js';
import { clientIp, json } from './_lib/http.js';
import { reserveAttempt, reviewGlobalRule, reviewIpRule, TooManyRetriesError } from './_lib/lockout.js';
import { parseReview, savePendingReview } from './_lib/reviews.js';

// Public: the review form on the site. Reviews wait for moderation in the admin panel.
export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  // Honeypot: a field hidden from people that bots fill in. Pretend success.
  if (typeof body.website === 'string' && body.website !== '') return json({ ok: true });

  const services = resolveData(await readContent().then((c) => c.data).catch(() => ({}))).services;
  const review = parseReview(body, services);
  if (!review) return json({ error: 'invalid' }, 400);

  try {
    const wait = (await reserveAttempt(reviewIpRule(clientIp(request)))) || (await reserveAttempt(reviewGlobalRule));
    if (wait) return json({ error: 'too_many' }, 429, { 'Retry-After': String(wait) });
    await savePendingReview(review);
  } catch (error) {
    if (error instanceof TooManyRetriesError) return json({ error: 'too_many' }, 429);
    console.error('Failed to save review', error);
    return json({ error: 'storage_error' }, 503);
  }
  return json({ ok: true });
}
