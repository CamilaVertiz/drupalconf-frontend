import type { JsonApiResource } from './types';

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

export async function drupalFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...init,
    ...(init?.method !== 'POST' ? { next: { revalidate: 300 } } : {}),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText} for ${url}`);
  }

  return res.json();
}

export function buildIncludedMap(
  included?: JsonApiResource[],
): Map<string, JsonApiResource> {
  return new Map(
    (included || []).map((item) => [`${item.type}--${item.id}`, item]),
  );
}

export function resolveRel(
  relData: { type: string; id: string } | null | undefined,
  map: Map<string, JsonApiResource>,
): JsonApiResource | null {
  if (!relData) return null;
  return map.get(`${relData.type}--${relData.id}`) ?? null;
}

export function resolveRels(
  relData: Array<{ type: string; id: string }> | null | undefined,
  map: Map<string, JsonApiResource>,
): JsonApiResource[] {
  if (!Array.isArray(relData)) return [];
  return relData
    .map((item) => map.get(`${item.type}--${item.id}`))
    .filter((item): item is JsonApiResource => item !== undefined);
}

export function ensureArray(
  data: JsonApiResource | JsonApiResource[],
): JsonApiResource[] {
  return Array.isArray(data) ? data : [data];
}

/**
 * Image fields point at a media entity, not a file, so this is two hops:
 *   node.<field> -> media--image -> field_media_image -> file--file -> uri.url
 * The request must have included that chain, e.g. `include=photo.field_media_image`.
 */
export function resolveImageUrl(
  relData: { type: string; id: string } | null | undefined,
  map: Map<string, JsonApiResource>,
): string | null {
  const media = resolveRel(relData, map);
  if (!media) return null;

  const fileRel = media.relationships?.field_media_image?.data;
  const file = resolveRel(
    Array.isArray(fileRel) ? fileRel[0] : fileRel,
    map,
  );
  if (!file) return null;

  const url: unknown = file.attributes?.uri?.url ?? file.attributes?.url;
  if (typeof url !== 'string' || url === '') return null;

  // Drupal returns a site-relative path.
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
}
