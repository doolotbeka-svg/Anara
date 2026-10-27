import { get, put } from '@vercel/blob';
import type { PendingReview } from './reviews.js';

// Telegram notifications about new reviews. The bot token is the
// TELEGRAM_BOT_TOKEN env var; the chat to notify is found by "connect" (the
// master presses Start in the bot, then "Подключить" in the admin panel) and kept
// in Blob, so nobody has to look up a chat id by hand.

const SETTINGS_PATH = 'settings/telegram.json';
const REQUEST_TIMEOUT_MS = 8000;

export interface TelegramSettings {
  chatId: number;
  chatTitle: string;
}

export const botToken = () => process.env.TELEGRAM_BOT_TOKEN || null;

export class TelegramError extends Error {}

async function callTelegram<T>(method: string, body: Record<string, unknown> = {}): Promise<T> {
  const token = botToken();
  if (!token) throw new TelegramError('not_configured');
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.ok) throw new TelegramError(data.description || `HTTP ${res.status}`);
  return data.result as T;
}

export async function readTelegramSettings(): Promise<TelegramSettings | null> {
  const result = await get(SETTINGS_PATH, { access: 'public', useCache: false });
  if (!result || result.statusCode !== 200) return null;
  const settings = JSON.parse(await new Response(result.stream).text());
  return typeof settings?.chatId === 'number' ? settings : null;
}

const writeSettings = (settings: TelegramSettings | null) =>
  put(SETTINGS_PATH, JSON.stringify(settings), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });

const sendMessage = (chatId: number, text: string) =>
  callTelegram('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true });

interface Update {
  message?: { chat: { id: number; type: string; first_name?: string; last_name?: string; username?: string; title?: string } };
}

/** Uses the latest private chat that wrote to the bot (the master pressing Start). */
export async function connectTelegram(): Promise<TelegramSettings | null> {
  const updates = await callTelegram<Update[]>('getUpdates', { allowed_updates: ['message'] });
  const chat = [...updates].reverse().find((u) => u.message?.chat.type === 'private')?.message?.chat;
  if (!chat) return null;

  const name = [chat.first_name, chat.last_name].filter(Boolean).join(' ');
  const settings = { chatId: chat.id, chatTitle: chat.username ? `${name} (@${chat.username})` : name || String(chat.id) };
  await sendMessage(settings.chatId, '✅ Уведомления подключены. Сюда будут приходить новые отзывы с сайта.');
  await writeSettings(settings);
  return settings;
}

export const disconnectTelegram = () => writeSettings(null);

export async function sendTestMessage(): Promise<boolean> {
  const settings = await readTelegramSettings();
  if (!settings) return false;
  await sendMessage(settings.chatId, '🔔 Проверка: уведомления о новых отзывах работают.');
  return true;
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Best effort: a failed notification must never lose the review itself. */
export async function notifyNewReview(review: PendingReview, adminUrl: string) {
  try {
    if (!botToken()) return;
    const settings = await readTelegramSettings();
    if (!settings) return;

    const author = [review.name, review.age > 0 ? `${review.age} лет` : '', review.location].filter(Boolean).join(', ');
    const text = [
      `${'⭐'.repeat(review.rating)} <b>Новый отзыв на сайте</b>`,
      `<b>${escapeHtml(author)}</b>`,
      ...(review.service ? [`Услуга: ${escapeHtml(review.service)}`] : []),
      '',
      `«${escapeHtml(review.text)}»`,
      '',
      `Опубликовать или удалить: ${adminUrl}`,
    ].join('\n');
    await sendMessage(settings.chatId, text);
  } catch (error) {
    console.error('Telegram notification failed', error);
  }
}
