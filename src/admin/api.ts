import { SiteContent } from '../content/merge';

const PASSWORD_KEY = 'anara-admin-password';

export const getSavedPassword = (): string => {
  try {
    return sessionStorage.getItem(PASSWORD_KEY) ?? '';
  } catch {
    return '';
  }
};

export const savePassword = (password: string | null) => {
  try {
    if (password) sessionStorage.setItem(PASSWORD_KEY, password);
    else sessionStorage.removeItem(PASSWORD_KEY);
  } catch {
    // sessionStorage unavailable: the password just won't survive a reload
  }
};

export class UnauthorizedError extends Error {}

async function request<T>(password: string, path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'x-admin-password': encodeURIComponent(password), ...init.headers },
  });
  if (res.status === 401) throw new UnauthorizedError();
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data as T;
}

export interface HistoryVersion {
  pathname: string;
  uploadedAt: string;
  size: number;
}

export const adminApi = {
  login: (password: string) => request<{ ok: true }>(password, '/api/admin/login', { method: 'POST' }),
  getContent: (password: string) => request<SiteContent>(password, '/api/admin/content'),
  saveContent: (password: string, content: SiteContent) =>
    request<SiteContent>(password, '/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    }),
  getHistory: (password: string) => request<HistoryVersion[]>(password, '/api/admin/history'),
  restore: (password: string, pathname: string) =>
    request<SiteContent>(password, '/api/admin/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pathname }),
    }),
  uploadImage: (password: string, file: Blob) =>
    request<{ url: string }>(password, '/api/admin/upload', {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    }),
};

export const ERROR_MESSAGES: Record<string, string> = {
  admin_not_configured: 'На сервере не задан пароль ADMIN_PASSWORD.',
  storage_error: 'Хранилище недоступно. Попробуйте ещё раз через минуту.',
  too_large: 'Файл слишком большой.',
  unsupported_type: 'Этот формат файла не поддерживается. Загрузите JPG, PNG или WebP.',
};

export const errorText = (error: unknown) =>
  (error instanceof Error && ERROR_MESSAGES[error.message]) || 'Не получилось. Проверьте интернет и попробуйте ещё раз.';
