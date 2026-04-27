// Field names here are the jsonapi_extras aliases (the `field_` prefix is stripped).

import type {
  JsonApiResource,
  Conference,
  Session,
  Speaker,
  Sponsor,
  SponsorEntity,
  Venue,
  Page,
  Paragraph,
} from './types';
import { buildIncludedMap, resolveRel, resolveRels, resolveImageUrl } from './client';

function extractBody(body: any): string {
  if (!body) return '';
  if (typeof body === 'string') return body;
  return body.processed || body.value || '';
}

function extractLinkUri(link: any): string | null {
  if (!link) return null;
  if (typeof link === 'string') return link;
  return link.uri || null;
}

/**
 * Drupal stores links as `internal:/path`, `internal:<front>` or
 * `entity:node/123`. External URLs pass through untouched.
 */
function drupalUriToHref(uri: string | null | undefined): string | null {
  if (!uri) return null;
  if (uri.startsWith('internal:')) {
    const path = uri.slice('internal:'.length);
    return path === '<front>' ? '/' : path;
  }
  if (uri.startsWith('entity:')) {
    // e.g. entity:node/3 — resolvable through the catch-all router.
    return '/' + uri.slice('entity:'.length);
  }
  return uri;
}

function extractSlug(pathAlias: string | undefined | null): string {
  if (!pathAlias) return '';
  const segments = pathAlias.split('/').filter(Boolean);
  return segments.pop() || '';
}

function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function extractSocialLinks(
  links: any[],
): { github: string; linkedin: string; twitter: string } {
  const result = { github: '', linkedin: '', twitter: '' };
  if (!Array.isArray(links)) return result;
  for (const link of links) {
    const uri = (link?.uri || '').toLowerCase();
    const title = (link?.title || '').toLowerCase();
    if (uri.includes('github') || title.includes('github')) {
      result.github = link.uri;
    } else if (uri.includes('linkedin') || title.includes('linkedin')) {
      result.linkedin = link.uri;
    } else if (
      uri.includes('twitter') ||
      uri.includes('x.com') ||
      title.includes('twitter')
    ) {
      result.twitter = link.uri;
    }
  }
  return result;
}

export function mapVenue(resource: JsonApiResource): Venue {
  const attrs = resource.attributes;
  // node--venue has no jsonapi_extras config, so it keeps the `field_` prefix.
  return {
    id: resource.id,
    title: attrs.title || '',
    city: attrs.field_city ?? attrs.city ?? '',
    country: attrs.field_country ?? attrs.country ?? '',
  };
}

export function mapSponsor(
  resource: JsonApiResource,
  includedMap?: Map<string, JsonApiResource>,
): Sponsor {
  const attrs = resource.attributes;
  return {
    id: resource.id,
    title: attrs.title || '',
    tier: attrs.tier || '',
    website: extractLinkUri(attrs.website),
    logo: includedMap
      ? resolveImageUrl(resource.relationships?.logo?.data, includedMap)
      : null,
  };
}

export function mapConference(
  resource: JsonApiResource,
  includedMap: Map<string, JsonApiResource>,
  sponsors: Sponsor[] = [],
): Conference {
  const attrs = resource.attributes;

  const venueRel = resource.relationships?.venue?.data;
  const venueResource = venueRel ? resolveRel(venueRel, includedMap) : null;

  return {
    id: resource.id,
    title: attrs.title || '',
    tagline: attrs.tagline || '',
    body: extractBody(attrs.body),
    status: attrs.conference_status || 'upcoming',
    date_start: attrs.date_start || '',
    date_end: attrs.date_end || '',
    max_attendees: attrs.max_attendees ?? null,
    featured: attrs.featured ?? false,
    website: extractLinkUri(attrs.website),
    social_links: (attrs.social_links || []).map((l: any) => ({
      uri: l.uri || '',
      title: l.title || '',
    })),
    pathAlias: extractSlug(attrs.path?.alias),
    logo: resolveImageUrl(resource.relationships?.logo?.data, includedMap),
    heroImage: resolveImageUrl(
      resource.relationships?.hero_image?.data,
      includedMap,
    ),
    venue: venueResource ? mapVenue(venueResource) : null,
    sponsors,
  };
}

export function mapSession(
  resource: JsonApiResource,
  includedMap: Map<string, JsonApiResource>,
): Session {
  const attrs = resource.attributes;

  const speakersRel = resource.relationships?.speakers?.data;
  const speakerResources = resolveRels(
    Array.isArray(speakersRel) ? speakersRel : speakersRel ? [speakersRel] : null,
    includedMap,
  );
  const speakers = speakerResources.map((sr) => ({
    id: sr.id,
    name: sr.attributes.title || '',
    avatar: resolveImageUrl(sr.relationships?.photo?.data, includedMap),
    title: sr.attributes.job_title || '',
    company: sr.attributes.company || '',
    pathAlias: extractSlug(sr.attributes.path?.alias),
  }));

  const trackRel = resource.relationships?.track?.data;
  const trackResource = trackRel ? resolveRel(trackRel, includedMap) : null;
  const trackName = trackResource?.attributes?.name || '';

  const skillRel = resource.relationships?.skill_level?.data;
  const skillResource = skillRel ? resolveRel(skillRel, includedMap) : null;
  const skillLevel = skillResource?.attributes?.name || '';

  const startTime = attrs.start_time || '';
  const endTime = attrs.end_time || '';

  return {
    id: resource.id,
    title: attrs.title || '',
    body: extractBody(attrs.body),
    type: capitalize(attrs.session_type || ''),
    skillLevel,
    track: trackName,
    room: attrs.room || '',
    startTime,
    endTime,
    date: startTime
      ? new Date(startTime).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : '',
    maxSeats: attrs.max_seats ?? null,
    seatsRemaining: attrs.seats_remaining ?? null,
    featured: attrs.featured ?? false,
    slidesUrl: extractLinkUri(attrs.slides_url),
    videoUrl: extractLinkUri(attrs.video_url),
    pathAlias: extractSlug(attrs.path?.alias),
    url: attrs.path?.alias || '',
    speakers,
  };
}

export function mapSpeaker(
  resource: JsonApiResource,
  sessions: Speaker['sessions'] = [],
  includedMap?: Map<string, JsonApiResource>,
): Speaker {
  const attrs = resource.attributes;
  return {
    id: resource.id,
    name: attrs.title || '',
    avatar: includedMap
      ? resolveImageUrl(resource.relationships?.photo?.data, includedMap)
      : null,
    title: attrs.job_title || '',
    company: attrs.company || '',
    country: attrs.country || '',
    bio: extractBody(attrs.body),
    featured: attrs.featured ?? false,
    pathAlias: extractSlug(attrs.path?.alias),
    social: extractSocialLinks(attrs.social_links || []),
    sessions,
  };
}

export function mapSponsorEntity(
  resource: JsonApiResource,
  includedMap?: Map<string, JsonApiResource>,
): SponsorEntity {
  const attrs = resource.attributes;
  return {
    id: resource.id,
    title: attrs.title || '',
    body: extractBody(attrs.body),
    tier: attrs.tier || '',
    tagline: attrs.tagline || '',
    website: extractLinkUri(attrs.website),
    logo: includedMap
      ? resolveImageUrl(resource.relationships?.logo?.data, includedMap)
      : null,
    pathAlias: extractSlug(attrs.path?.alias),
  };
}

export function mapPage(json: {
  data: JsonApiResource | JsonApiResource[];
  included?: JsonApiResource[];
}): Page {
  const resources = Array.isArray(json.data) ? json.data : [json.data];
  const resource = resources[0];
  const includedMap = buildIncludedMap(json.included);

  const contentRel = resource.relationships?.content?.data;
  const paragraphRefs: Array<{ type: string; id: string }> = Array.isArray(
    contentRel,
  )
    ? contentRel
    : contentRel
      ? [contentRel]
      : [];

  const paragraphs: Paragraph[] = paragraphRefs
    .map((ref) => {
      const para = resolveRel(ref, includedMap);
      if (!para) return null;
      const attrs = para.attributes;
      const paraType = para.type as Paragraph['type'];

      switch (paraType) {
        case 'paragraph--hero': {
          const href = drupalUriToHref(attrs.link?.uri);
          return {
            id: para.id,
            type: paraType,
            title: attrs.title || undefined,
            copy: attrs.copy?.processed || attrs.copy?.value || undefined,
            eyebrow: attrs.eyebrow || undefined,
            link: href ? { uri: href, title: attrs.link?.title || '' } : null,
          } as Paragraph;
        }
        case 'paragraph--copy':
          return {
            id: para.id,
            type: paraType,
            title: attrs.title || undefined,
            copy: attrs.copy?.processed || attrs.copy?.value || undefined,
          } as Paragraph;
        case 'paragraph--listing':
          return {
            id: para.id,
            type: paraType,
            title: attrs.title || undefined,
            bundle: attrs.bundle || 'conference',
          } as Paragraph;
        case 'paragraph--contact_form':
          return {
            id: para.id,
            type: paraType,
            title: attrs.title || undefined,
            copy: attrs.copy?.processed || attrs.copy?.value || undefined,
          } as Paragraph;
        default:
          return null;
      }
    })
    .filter((p): p is Paragraph => p !== null);

  return {
    id: resource.id,
    title: resource.attributes.title || '',
    paragraphs,
  };
}
