import { json, requireAdmin } from '../_lib/http.js';

export async function POST(request: Request): Promise<Response> {
  return (await requireAdmin(request)) ?? json({ ok: true });
}
