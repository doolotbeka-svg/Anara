import { del, get, list, put } from '@vercel/blob';
import { emptyContent, normalizeContent, SiteContent } from '../../src/content/merge.js';

// Files in api/_lib are helpers, Vercel doesn't expose them as endpoints.

const CONTENT_PATH = 'content/site.json';
const HISTORY_PREFIX = 'content/history/';
const HISTORY_LIMIT = 30;

const readJson = async (pathname: string): Promise<unknown | null> => {
  // useCache: false reads from storage, so a save is visible right away
  const result = await get(pathname, { access: 'public', useCache: false });
  if (!result || result.statusCode !== 200) return null;
  return JSON.parse(await new Response(result.stream).text());
};

export async function readContent(): Promise<SiteContent> {
  const raw = await readJson(CONTENT_PATH);
  return raw ? normalizeContent(raw) : emptyContent();
}

export async function writeContent(content: SiteContent): Promise<SiteContent> {
  const saved = { ...normalizeContent(content), updatedAt: new Date().toISOString() };
  const body = JSON.stringify(saved);
  const options = { access: 'public' as const, contentType: 'application/json', addRandomSuffix: false, cacheControlMaxAge: 60 };

  await put(CONTENT_PATH, body, { ...options, allowOverwrite: true });
  // Every save is also kept as a version that can be restored
  await put(`${HISTORY_PREFIX}${saved.updatedAt.replace(/[:.]/g, '-')}.json`, body, options);

  const versions = await listHistory();
  const stale = versions.slice(HISTORY_LIMIT).map((v) => v.url);
  if (stale.length) await del(stale);
  return saved;
}

export interface HistoryVersion {
  pathname: string;
  url: string;
  uploadedAt: string;
  size: number;
}

/** Saved versions, newest first. */
export async function listHistory(): Promise<HistoryVersion[]> {
  const { blobs } = await list({ prefix: HISTORY_PREFIX, limit: 1000 });
  return blobs
    .map((b) => ({ pathname: b.pathname, url: b.url, uploadedAt: new Date(b.uploadedAt).toISOString(), size: b.size }))
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

export async function readHistoryVersion(pathname: string): Promise<SiteContent | null> {
  if (!pathname.startsWith(HISTORY_PREFIX) || pathname.includes('..')) return null;
  const raw = await readJson(pathname);
  return raw ? normalizeContent(raw) : null;
}

const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
};

export const isSupportedImage = (contentType: string) => contentType in IMAGE_TYPES;

export async function saveImage(body: ArrayBuffer, contentType: string): Promise<string> {
  const { url } = await put(`images/photo.${IMAGE_TYPES[contentType]}`, body, {
    access: 'public',
    contentType,
    addRandomSuffix: true,
  });
  return url;
}
