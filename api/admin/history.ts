import { listHistory, readHistoryVersion, writeContent } from '../_lib/content.js';
import { json, requireAdmin } from '../_lib/http.js';

/** Saved versions, newest first. */
export async function GET(request: Request): Promise<Response> {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const versions = await listHistory();
    return json(versions.map(({ pathname, uploadedAt, size }) => ({ pathname, uploadedAt, size })));
  } catch (error) {
    console.error('Failed to list history', error);
    return json({ error: 'storage_error' }, 502);
  }
}

/** Restores a saved version: it becomes the current content (and a new version itself). */
export async function POST(request: Request): Promise<Response> {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  let pathname: unknown;
  try {
    ({ pathname } = await request.json());
  } catch {
    return json({ error: 'bad_request' }, 400);
  }
  if (typeof pathname !== 'string') return json({ error: 'bad_request' }, 400);

  try {
    const version = await readHistoryVersion(pathname);
    if (!version) return json({ error: 'not_found' }, 404);
    return json(await writeContent(version));
  } catch (error) {
    console.error('Failed to restore version', error);
    return json({ error: 'storage_error' }, 502);
  }
}
