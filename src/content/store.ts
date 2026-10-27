import {
  MASTER_INFO,
  SERVICES,
  REVIEWS,
  FAQ_ITEMS,
  LOCATION_BEZHETSK,
  TZ_SPECIFICATION,
} from '../data/massageData';
import { emptyContent, normalizeContent, resolveData, SiteContent, SiteImages } from './merge';

let content: SiteContent = emptyContent();

/** Text from the admin panel, or the default written in the component. */
export const t = (key: string, fallback: string): string =>
  Object.prototype.hasOwnProperty.call(content.texts, key) ? content.texts[key] : fallback;

export const getImages = (): SiteImages => content.images;

const replaceArray = <T>(target: T[], next: T[]) => {
  target.splice(0, target.length, ...next);
};

const replaceObject = (target: object, next: object) => {
  for (const key of Object.keys(target)) delete (target as Record<string, unknown>)[key];
  Object.assign(target, next);
};

/**
 * Applies saved content. Data overrides are written into the exported data objects,
 * so components keep importing SERVICES, MASTER_INFO etc. as before.
 */
export function applyContent(raw: unknown) {
  content = normalizeContent(raw);
  const data = resolveData(content.data);
  replaceObject(MASTER_INFO, data.master);
  replaceArray(SERVICES, data.services as typeof SERVICES);
  replaceArray(REVIEWS, data.reviews as typeof REVIEWS);
  replaceArray(FAQ_ITEMS, data.faq as typeof FAQ_ITEMS);
  replaceObject(LOCATION_BEZHETSK, data.location);
  replaceObject(TZ_SPECIFICATION, data.tz);
}

/** Loads saved content before the first render; on failure the site shows its defaults. */
export async function loadContent(timeoutMs = 3000) {
  try {
    const res = await fetch('/api/content', { signal: AbortSignal.timeout(timeoutMs) });
    if (res.ok) applyContent(await res.json());
  } catch {
    // Offline, slow network or local dev without the API: keep defaults
  }
}
