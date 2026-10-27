import { del, get, list, put } from '@vercel/blob';
import { resolveData, SiteContent, SiteData } from '../../src/content/merge.js';
import { readContent, writeContent } from './content.js';

// Reviews sent from the site wait here until the master publishes or deletes them.
const PENDING_PREFIX = 'reviews/pending/';

export interface PendingReview {
  id: string;
  name: string;
  age: number;
  location: string;
  service: string;
  tag: string;
  text: string;
  rating: number;
  createdAt: string;
}

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

// Tags the site's review filters look for (see ReviewsSection)
const TAGS_BY_SERVICE: Record<string, string> = {
  'back-neck': 'Спина и поясница',
  shvz: 'Остеохондроз и шея',
  'relax-antistress': 'Релакс и отдых',
  lymphatic: 'Отеки и легкость',
};

const clean = (value: unknown, max: number) =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '';

/** Validates a review from the site form; returns null if it can't be accepted. */
export function parseReview(body: Record<string, unknown>, services: SiteData['services']): PendingReview | null {
  const name = clean(body.name, 60);
  const text = typeof body.text === 'string' ? body.text.trim().slice(0, 2000) : '';
  const rating = Number(body.rating);
  const age = Number(body.age);
  if (name.length < 2 || text.length < 10 || !Number.isInteger(rating) || rating < 1 || rating > 5) return null;

  const service = services.find((s) => s.id === body.serviceId);
  const now = new Date();
  return {
    id: `rev-${now.getTime().toString(36)}`,
    name,
    age: Number.isInteger(age) && age >= 14 && age <= 110 ? age : 0,
    // The form prefills "Бежецк, ": drop a dangling comma if nothing was added
    location: clean(body.location, 80).replace(/[\s,]+$/, ''),
    service: service?.title ?? clean(body.service, 100),
    tag: (service && TAGS_BY_SERVICE[service.id]) ?? service?.title ?? 'Отзыв клиента',
    text,
    rating,
    createdAt: now.toISOString(),
  };
}

export async function savePendingReview(review: PendingReview) {
  await put(`${PENDING_PREFIX}${review.createdAt.replace(/[:.]/g, '-')}.json`, JSON.stringify(review), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: true, // the file name can't be guessed from outside
  });
}

export async function listPendingReviews(): Promise<{ pathname: string; review: PendingReview }[]> {
  const { blobs } = await list({ prefix: PENDING_PREFIX, limit: 1000 });
  const items = await Promise.all(
    blobs.map(async (b) => ({ pathname: b.pathname, review: await readPending(b.pathname) }))
  );
  return items
    .filter((i): i is { pathname: string; review: PendingReview } => i.review !== null)
    .sort((a, b) => b.review.createdAt.localeCompare(a.review.createdAt));
}

const isPendingPath = (pathname: string) => pathname.startsWith(PENDING_PREFIX) && !pathname.includes('..');

async function readPending(pathname: string): Promise<PendingReview | null> {
  if (!isPendingPath(pathname)) return null;
  const result = await get(pathname, { access: 'public', useCache: false });
  if (!result || result.statusCode !== 200) return null;
  return JSON.parse(await new Response(result.stream).text());
}

export async function deletePendingReview(pathname: string): Promise<boolean> {
  if (!isPendingPath(pathname)) return false;
  await del(pathname);
  return true;
}

/** Adds the review to the top of the site's reviews and removes it from the queue. */
export async function publishPendingReview(pathname: string): Promise<SiteContent | null> {
  const pending = await readPending(pathname);
  if (!pending) return null;

  const content = await readContent();
  const reviews = resolveData(content.data).reviews;
  const created = new Date(pending.createdAt);
  const published = {
    id: pending.id,
    name: pending.name,
    age: pending.age,
    location: pending.location,
    tag: pending.tag,
    text: pending.text,
    service: pending.service,
    date: `${MONTHS[created.getMonth()]} ${created.getFullYear()}`,
    rating: pending.rating,
    verified: false,
  };
  const saved = await writeContent({
    ...content,
    data: { ...content.data, reviews: [published, ...reviews.filter((r) => r.id !== pending.id)] },
  });
  await del(pathname);
  return saved;
}
