import { createHash } from 'node:crypto';
import { BlobPreconditionFailedError, get, put } from '@vercel/blob';

// Rate limits (admin login, review submissions), shared by all function instances
// through Blob storage. An attempt is counted *before* it is processed, with a
// compare-and-swap write, so parallel requests can't squeeze in more than the limit.

interface Rule {
  path: string;
  limit: number;
  windowMs: number;
  lockMs: number;
}

interface State {
  count: number;
  since: number;
  lockedUntil: number;
}

const MINUTE = 60 * 1000;
const MAX_WRITE_RETRIES = 8;

const ipHash = (ip: string) => createHash('sha256').update(ip).digest('hex').slice(0, 24);

/** Login: 5 attempts per 15 minutes from one address. */
export const ipRule = (ip: string): Rule => ({
  path: `security/ip-${ipHash(ip)}.json`,
  limit: 5,
  windowMs: 15 * MINUTE,
  lockMs: 15 * MINUTE,
});

/** Login: 30 attempts per hour from all addresses together: stops guessing from many IPs. */
export const globalRule: Rule = {
  path: 'security/global.json',
  limit: 30,
  windowMs: 60 * MINUTE,
  lockMs: 60 * MINUTE,
};

/** Reviews: 3 per hour from one address. */
export const reviewIpRule = (ip: string): Rule => ({
  path: `security/review-ip-${ipHash(ip)}.json`,
  limit: 3,
  windowMs: 60 * MINUTE,
  lockMs: 60 * MINUTE,
});

/** Reviews: 30 per day from everyone, so spam can't flood the moderation list. */
export const reviewGlobalRule: Rule = {
  path: 'security/review-global.json',
  limit: 30,
  windowMs: 24 * 60 * MINUTE,
  lockMs: 60 * MINUTE,
};

export class TooManyRetriesError extends Error {}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const freshState = (now: number): State => ({ count: 0, since: now, lockedUntil: 0 });

async function readState(path: string): Promise<{ state: State | null; etag: string | null }> {
  const result = await get(path, { access: 'public', useCache: false });
  if (!result || result.statusCode !== 200) return { state: null, etag: null };
  return { state: JSON.parse(await new Response(result.stream).text()), etag: result.blob.etag };
}

const writeOptions = {
  access: 'public' as const,
  contentType: 'application/json',
  addRandomSuffix: false,
  cacheControlMaxAge: 60,
};

const isWriteConflict = (error: unknown) =>
  error instanceof BlobPreconditionFailedError || (error instanceof Error && /already exists/i.test(error.message));

/**
 * Counts one attempt against the rule.
 * Returns 0 if the attempt may proceed, otherwise the number of seconds until the lock ends.
 */
export async function reserveAttempt(rule: Rule, now = Date.now()): Promise<number> {
  for (let i = 0; i < MAX_WRITE_RETRIES; i++) {
    const { state: stored, etag } = await readState(rule.path);
    let state = stored ?? freshState(now);

    if (state.lockedUntil > now) return Math.ceil((state.lockedUntil - now) / 1000);
    if (state.lockedUntil || now - state.since > rule.windowMs) state = freshState(now);

    const locks = state.count >= rule.limit;
    state = locks ? { ...state, lockedUntil: now + rule.lockMs } : { ...state, count: state.count + 1 };

    try {
      // ifMatch: the write fails if another request changed the state since we read it
      await put(rule.path, JSON.stringify(state), etag ? { ...writeOptions, ifMatch: etag } : writeOptions);
    } catch (error) {
      if (!isWriteConflict(error)) throw error;
      await sleep(30 + Math.random() * 120);
      continue;
    }
    return locks ? Math.ceil(rule.lockMs / 1000) : 0;
  }
  throw new TooManyRetriesError();
}

/** After a correct password: the counter starts over. */
export async function resetAttempts(rule: Rule) {
  await put(rule.path, JSON.stringify(freshState(Date.now())), { ...writeOptions, allowOverwrite: true });
}
