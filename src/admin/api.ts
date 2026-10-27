import { SiteContent } from '../content/merge';

const TOKEN_KEY = 'anara-admin-session';

export const getSavedToken = (): string => {
  try {
    return sessionStorage.getItem(TOKEN_KEY) ?? '';
  } catch {
    return '';
  }
};

export const saveToken = (token: string | null) => {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // sessionStorage unavailable: the session just won't survive a reload
  }
};

export class UnauthorizedError extends Error {}

/** Too many wrong passwords: login is closed for retryAfter seconds. */
export class LockedError extends Error {
  constructor(public retryAfter: number) {
    super('locked');
  }
}

async function request<T>(token: string, path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...init.headers },
  });
  if (res.status === 401) throw new UnauthorizedError();
  const data = await res.json().catch(() => ({}));
  if (res.status === 429) throw new LockedError(Number(data.retryAfter) || 60);
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data as T;
}

export interface PendingReview {
  pathname: string;
  review: {
    id: string;
    name: string;
    age: number;
    location: string;
    service: string;
    text: string;
    rating: number;
    createdAt: string;
  };
}

export interface HistoryVersion {
  pathname: string;
  uploadedAt: string;
  size: number;
}

export const adminApi = {
  login: (password: string) =>
    request<{ token: string; expiresAt: string }>('', '/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    }),
  getContent: (token: string) => request<SiteContent>(token, '/api/admin/content'),
  saveContent: (token: string, content: SiteContent) =>
    request<SiteContent>(token, '/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    }),
  getHistory: (token: string) => request<HistoryVersion[]>(token, '/api/admin/history'),
  restore: (token: string, pathname: string) =>
    request<SiteContent>(token, '/api/admin/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pathname }),
    }),
  getPendingReviews: (token: string) => request<PendingReview[]>(token, '/api/admin/reviews'),
  publishReview: (token: string, pathname: string) =>
    request<SiteContent>(token, '/api/admin/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'publish', pathname }),
    }),
  deleteReview: (token: string, pathname: string) =>
    request<{ ok: true }>(token, '/api/admin/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', pathname }),
    }),
  getTelegram: (token: string) =>
    request<{ tokenConfigured: boolean; chatTitle: string | null }>(token, '/api/admin/telegram'),
  telegramAction: (token: string, action: 'connect' | 'test' | 'disconnect') =>
    request<{ chatTitle?: string; ok?: true }>(token, '/api/admin/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    }),
  uploadImage: (token: string, file: Blob) =>
    request<{ url: string }>(token, '/api/admin/upload', {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    }),
};

export const ERROR_MESSAGES: Record<string, string> = {
  admin_not_configured: 'На сервере не задан пароль ADMIN_PASSWORD.',
  storage_error: 'Хранилище недоступно. Попробуйте ещё раз через минуту.',
  too_large: 'Файл слишком большой.',
  telegram_not_configured: 'Токен бота не задан в Vercel (TELEGRAM_BOT_TOKEN).',
  telegram_error: 'Telegram не ответил. Проверьте токен бота и попробуйте ещё раз.',
  no_start_message: 'Бот пока не получал сообщений. Откройте бота в Telegram, нажмите «Старт» и попробуйте снова.',
  unsupported_type: 'Этот формат файла не поддерживается. Загрузите JPG, PNG или WebP.',
};

export const errorText = (error: unknown) =>
  (error instanceof Error && ERROR_MESSAGES[error.message]) || 'Не получилось. Проверьте интернет и попробуйте ещё раз.';
