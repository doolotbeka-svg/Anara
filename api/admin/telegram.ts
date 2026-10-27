import { json, requireAdmin } from '../_lib/http.js';
import {
  botToken,
  connectTelegram,
  disconnectTelegram,
  readTelegramSettings,
  sendTestMessage,
  TelegramError,
} from '../_lib/telegram.js';

/** Whether notifications are set up, and to which chat. */
export async function GET(request: Request): Promise<Response> {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    const settings = await readTelegramSettings();
    return json({ tokenConfigured: !!botToken(), chatTitle: settings?.chatTitle ?? null });
  } catch (error) {
    console.error('Failed to read Telegram settings', error);
    return json({ error: 'storage_error' }, 502);
  }
}

/** { action: 'connect' | 'test' | 'disconnect' } */
export async function POST(request: Request): Promise<Response> {
  const denied = requireAdmin(request);
  if (denied) return denied;

  let action: unknown;
  try {
    ({ action } = await request.json());
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  try {
    if (action === 'connect') {
      const settings = await connectTelegram();
      return settings ? json({ chatTitle: settings.chatTitle }) : json({ error: 'no_start_message' }, 404);
    }
    if (action === 'test') {
      return (await sendTestMessage()) ? json({ ok: true }) : json({ error: 'not_connected' }, 404);
    }
    if (action === 'disconnect') {
      await disconnectTelegram();
      return json({ ok: true });
    }
    return json({ error: 'bad_request' }, 400);
  } catch (error) {
    console.error(`Telegram ${String(action)} failed`, error);
    if (error instanceof TelegramError) {
      return json({ error: error.message === 'not_configured' ? 'telegram_not_configured' : 'telegram_error', detail: error.message }, 502);
    }
    return json({ error: 'storage_error' }, 502);
  }
}
