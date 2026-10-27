import { isSupportedImage, saveImage } from '../_lib/content.js';
import { json, requireAdmin } from '../_lib/http.js';

// Vercel limits function request bodies to 4.5 MB; the admin panel resizes photos before upload
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request): Promise<Response> {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const contentType = (request.headers.get('content-type') ?? '').split(';')[0].trim();
  if (!isSupportedImage(contentType)) return json({ error: 'unsupported_type' }, 415);

  const body = await request.arrayBuffer();
  if (body.byteLength === 0) return json({ error: 'bad_request' }, 400);
  if (body.byteLength > MAX_IMAGE_BYTES) return json({ error: 'too_large' }, 413);

  try {
    return json({ url: await saveImage(body, contentType) });
  } catch (error) {
    console.error('Failed to upload image', error);
    return json({ error: 'storage_error' }, 502);
  }
}
