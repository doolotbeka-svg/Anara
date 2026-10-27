import { readContent, writeContent } from '../_lib/content.js';
import { json, requireAdmin } from '../_lib/http.js';

const MAX_BODY_BYTES = 2 * 1024 * 1024;

export async function GET(request: Request): Promise<Response> {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    return json(await readContent());
  } catch (error) {
    console.error('Failed to read site content', error);
    return json({ error: 'storage_error' }, 502);
  }
}

export async function PUT(request: Request): Promise<Response> {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return json({ error: 'too_large' }, 413);

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  try {
    return json(await writeContent(body as Parameters<typeof writeContent>[0]));
  } catch (error) {
    console.error('Failed to save site content', error);
    return json({ error: 'storage_error' }, 502);
  }
}
