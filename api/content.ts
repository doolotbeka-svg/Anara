import { emptyContent } from '../src/content/merge.js';
import { readContent } from './_lib/content.js';
import { json } from './_lib/http.js';

// Public: the site loads its texts, data and photos from here before rendering.
export async function GET(): Promise<Response> {
  try {
    const content = await readContent();
    // Short CDN cache: a save shows up for visitors within a few seconds
    return json(content, 200, { 'Cache-Control': 'public, max-age=0, s-maxage=5, stale-while-revalidate=60' });
  } catch (error) {
    console.error('Failed to read site content', error);
    return json(emptyContent(), 200, { 'Cache-Control': 'no-store' });
  }
}
