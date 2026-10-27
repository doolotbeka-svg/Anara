import { json, requireAdmin } from '../_lib/http.js';
import { deletePendingReview, listPendingReviews, publishPendingReview } from '../_lib/reviews.js';

/** Reviews from the site waiting for moderation, newest first. */
export async function GET(request: Request): Promise<Response> {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    return json(await listPendingReviews());
  } catch (error) {
    console.error('Failed to list pending reviews', error);
    return json({ error: 'storage_error' }, 502);
  }
}

/** { action: 'publish' | 'delete', pathname }. Publishing returns the saved site content. */
export async function POST(request: Request): Promise<Response> {
  const denied = requireAdmin(request);
  if (denied) return denied;

  let action: unknown;
  let pathname: unknown;
  try {
    ({ action, pathname } = await request.json());
  } catch {
    return json({ error: 'bad_request' }, 400);
  }
  if (typeof pathname !== 'string' || (action !== 'publish' && action !== 'delete')) {
    return json({ error: 'bad_request' }, 400);
  }

  try {
    if (action === 'delete') {
      return (await deletePendingReview(pathname)) ? json({ ok: true }) : json({ error: 'not_found' }, 404);
    }
    const content = await publishPendingReview(pathname);
    return content ? json(content) : json({ error: 'not_found' }, 404);
  } catch (error) {
    console.error(`Failed to ${action} review`, error);
    return json({ error: 'storage_error' }, 502);
  }
}
