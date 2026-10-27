// Shared by the site and the Vercel functions (hence the .js import extensions).
import {
  MASTER_INFO,
  SERVICES,
  REVIEWS,
  FAQ_ITEMS,
  LOCATION_BEZHETSK,
  TZ_SPECIFICATION,
} from '../data/massageData.js';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

// Snapshot taken before the site applies any overrides to the exported objects
export const DEFAULT_DATA = clone({
  master: MASTER_INFO,
  services: SERVICES,
  reviews: REVIEWS,
  faq: FAQ_ITEMS,
  location: LOCATION_BEZHETSK,
  tz: TZ_SPECIFICATION,
});

export type SiteData = typeof DEFAULT_DATA;
export type DataKey = keyof SiteData;
export const DATA_KEYS = Object.keys(DEFAULT_DATA) as DataKey[];

export interface GalleryPhoto {
  url: string;
  caption: string;
}

export interface SiteImages {
  masterPhoto: string | null;
  heroPhoto: string | null;
  gallery: GalleryPhoto[];
  /** Slides in each massage card, by service id */
  servicePhotos: Record<string, GalleryPhoto[]>;
}

export interface SiteContent {
  texts: Record<string, string>;
  data: Partial<Record<DataKey, unknown>>;
  images: SiteImages;
  updatedAt?: string;
}

export const emptyContent = (): SiteContent => ({
  texts: {},
  data: {},
  images: { masterPhoto: null, heroPhoto: null, gallery: [], servicePhotos: {} },
});

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const isImageUrl = (v: unknown): v is string => typeof v === 'string' && /^https:\/\//.test(v);

const toPhotoList = (list: unknown): GalleryPhoto[] =>
  Array.isArray(list)
    ? list
        .filter((p): p is Record<string, unknown> => isPlainObject(p) && isImageUrl(p.url))
        .map((p) => ({ url: p.url as string, caption: typeof p.caption === 'string' ? p.caption : '' }))
    : [];

export function normalizeContent(raw: unknown): SiteContent {
  const content = emptyContent();
  if (!isPlainObject(raw)) return content;

  if (isPlainObject(raw.texts)) {
    for (const [key, value] of Object.entries(raw.texts)) {
      if (typeof value === 'string') content.texts[key] = value;
    }
  }
  if (isPlainObject(raw.data)) {
    for (const key of DATA_KEYS) {
      if (key in raw.data) content.data[key] = raw.data[key];
    }
  }
  if (isPlainObject(raw.images)) {
    const images = raw.images;
    content.images.masterPhoto = isImageUrl(images.masterPhoto) ? images.masterPhoto : null;
    content.images.heroPhoto = isImageUrl(images.heroPhoto) ? images.heroPhoto : null;
    content.images.gallery = toPhotoList(images.gallery);
    if (isPlainObject(images.servicePhotos)) {
      for (const [serviceId, list] of Object.entries(images.servicePhotos)) {
        const photos = toPhotoList(list);
        if (photos.length) content.images.servicePhotos[serviceId] = photos;
      }
    }
  }
  if (typeof raw.updatedAt === 'string') content.updatedAt = raw.updatedAt;
  return content;
}

// Objects merge field by field so fields added to the code later keep their defaults;
// arrays (services, reviews, ...) are replaced as a whole; a value of the wrong type is ignored.
function mergeValue(def: unknown, override: unknown): unknown {
  if (override === undefined) return clone(def);
  if (Array.isArray(def)) return Array.isArray(override) ? clone(override) : clone(def);
  if (isPlainObject(def)) {
    if (!isPlainObject(override)) return clone(def);
    const result: Record<string, unknown> = {};
    for (const key of new Set([...Object.keys(def), ...Object.keys(override)])) {
      result[key] = key in def ? mergeValue(def[key], override[key]) : clone(override[key]);
    }
    return result;
  }
  if (def === undefined || typeof override === typeof def) return override;
  return def;
}

export function resolveData(overrides: SiteContent['data']): SiteData {
  const result = {} as Record<DataKey, unknown>;
  for (const key of DATA_KEYS) result[key] = mergeValue(DEFAULT_DATA[key], overrides[key]);
  return result as SiteData;
}
