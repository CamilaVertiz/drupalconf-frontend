import type {
  JsonApiResponse,
  JsonApiResource,
  ResolvedEntity,
  Conference,
  Session,
  Speaker,
  Sponsor,
  SponsorEntity,
} from './types';
import { drupalFetch, buildIncludedMap, resolveRel, ensureArray } from './client';
import {
  mapConference,
  mapSession,
  mapSpeaker,
  mapSponsor,
  mapSponsorEntity,
  mapPage,
} from './mappers';

const JSON_API_PREFIX = '/api/jsonapi';

const INCLUDES: Record<string, string> = {
  'node--basic_page': 'content',
  'node--blog': 'content',
  'node--conference': 'venue,logo.field_media_image,hero_image.field_media_image',
  'node--session': 'speakers,speakers.photo.field_media_image,track,skill_level',
  'node--speaker': 'photo.field_media_image',
  'node--sponsor': 'logo.field_media_image',
};

interface TranslatePathResponse {
  resolved?: string;
  entity?: { type: string; bundle: string; id: string; uuid: string };
  jsonapi?: { individual: string; resourceName: string };
}

// decoupled_router resolves the alias to a JSON:API URL, which we then fetch.
export async function resolveByPath(
  path: string,
): Promise<ResolvedEntity | null> {
  let route: TranslatePathResponse;
  try {
    route = await drupalFetch<TranslatePathResponse>(
      `/router/translate-path?path=${encodeURIComponent(path)}`,
    );
  } catch {
    return null;
  }

  const resourceName = route.jsonapi?.resourceName;
  const individual = route.jsonapi?.individual;
  if (!resourceName || !individual) return null;

  // Use only the path portion so requests go through our configured BASE_URL.
  const individualPath = new URL(individual).pathname;
  const include = INCLUDES[resourceName] ?? '';
  const url = include ? `${individualPath}?include=${include}` : individualPath;

  let json: JsonApiResponse;
  try {
    json = await drupalFetch<JsonApiResponse>(url);
  } catch {
    return null;
  }

  if (!json.data) return null;

  const resource = Array.isArray(json.data) ? json.data[0] : json.data;
  const includedMap = buildIncludedMap(json.included);

  switch (resourceName) {
    case 'node--basic_page':
    case 'node--blog':
      return { type: resourceName, data: mapPage(json) };

    case 'node--conference': {
      const sponsors = await fetchSponsorsForConference(resource.id);
      return {
        type: 'node--conference',
        data: mapConference(resource, includedMap, sponsors),
      };
    }

    case 'node--session':
      return { type: 'node--session', data: mapSession(resource, includedMap) };

    case 'node--speaker': {
      const sessions = await fetchSessionsForSpeaker(resource.id);
      return {
        type: 'node--speaker',
        data: mapSpeaker(resource, sessions, includedMap),
      };
    }

    case 'node--sponsor':
      return {
        type: 'node--sponsor',
        data: mapSponsorEntity(resource, includedMap),
      };

    default:
      return { type: 'unknown' };
  }
}

export async function listSessionsByConference(
  conferenceUuid: string,
): Promise<Session[]> {
  const json = await drupalFetch<JsonApiResponse>(
    `${JSON_API_PREFIX}/node/session?filter[conference.id]=${conferenceUuid}&include=speakers,speakers.photo.field_media_image,track,skill_level&sort=start_time`,
  );
  const sessions = ensureArray(json.data);
  const includedMap = buildIncludedMap(json.included);
  return sessions.map((s) => mapSession(s, includedMap));
}

export async function listSpeakersByConference(
  conferenceUuid: string,
): Promise<Speaker[]> {
  const json = await drupalFetch<JsonApiResponse>(
    `${JSON_API_PREFIX}/node/session?filter[conference.id]=${conferenceUuid}&include=speakers,speakers.photo.field_media_image`,
  );
  const includedMap = buildIncludedMap(json.included);
  const sessions = ensureArray(json.data);

  const speakerMap = new Map<string, JsonApiResource>();
  for (const session of sessions) {
    const speakersRel = session.relationships?.speakers?.data;
    const speakerRefs = Array.isArray(speakersRel)
      ? speakersRel
      : speakersRel
        ? [speakersRel]
        : [];
    for (const ref of speakerRefs) {
      if (!speakerMap.has(ref.id)) {
        const speakerResource = resolveRel(ref, includedMap);
        if (speakerResource) speakerMap.set(ref.id, speakerResource);
      }
    }
  }

  return Array.from(speakerMap.values()).map((s) =>
    mapSpeaker(s, [], includedMap),
  );
}

export async function listByBundle(
  bundle: 'conference' | 'session' | 'speaker' | 'sponsor' | 'blog',
  opts?: { limit?: number; sort?: string },
): Promise<unknown[]> {
  const limit = opts?.limit ?? 6;
  const sort = opts?.sort ?? '-created';

  switch (bundle) {
    case 'conference':
      return listConferences(limit, sort);
    case 'session':
      return listSessions(limit, sort);
    case 'speaker':
      return listSpeakers(limit, sort);
    case 'sponsor':
      return listSponsors(limit, sort);
    case 'blog':
      return listBlogs(limit, sort);
    default:
      return [];
  }
}

async function listConferences(
  limit: number,
  sort: string,
): Promise<Conference[]> {
  const [confJson, sponsorJson] = await Promise.all([
    drupalFetch<JsonApiResponse>(
      `${JSON_API_PREFIX}/node/conference?page[limit]=${limit}&sort=${sort}&include=venue,logo.field_media_image,hero_image.field_media_image`,
    ),
    drupalFetch<JsonApiResponse>(
      `${JSON_API_PREFIX}/node/sponsor?include=conferences,logo.field_media_image&sort=sort_weight`,
    ),
  ]);

  const conferences = ensureArray(confJson.data);
  const confIncludedMap = buildIncludedMap(confJson.included);
  const sponsors = ensureArray(sponsorJson.data);
  const sponsorIncludedMap = buildIncludedMap(sponsorJson.included);
  const sponsorObjects = sponsors.map((s) =>
    mapSponsor(s, sponsorIncludedMap),
  );

  const sponsorsByConf = new Map<string, Sponsor[]>();
  for (let i = 0; i < sponsors.length; i++) {
    const confRel = sponsors[i].relationships?.conferences?.data;
    const confIds: string[] = Array.isArray(confRel)
      ? confRel.map((r: any) => r.id)
      : confRel
        ? [confRel.id]
        : [];
    for (const confId of confIds) {
      if (!sponsorsByConf.has(confId)) sponsorsByConf.set(confId, []);
      sponsorsByConf.get(confId)!.push(sponsorObjects[i]);
    }
  }

  return conferences.map((conf) =>
    mapConference(conf, confIncludedMap, sponsorsByConf.get(conf.id) || []),
  );
}

async function listSessions(
  limit: number,
  sort: string,
): Promise<Session[]> {
  const json = await drupalFetch<JsonApiResponse>(
    `${JSON_API_PREFIX}/node/session?page[limit]=${limit}&sort=${sort}&include=speakers,speakers.photo.field_media_image,track,skill_level`,
  );
  const sessions = ensureArray(json.data);
  const includedMap = buildIncludedMap(json.included);
  return sessions.map((s) => mapSession(s, includedMap));
}

async function listSpeakers(
  limit: number,
  sort: string,
): Promise<Speaker[]> {
  const json = await drupalFetch<JsonApiResponse>(
    `${JSON_API_PREFIX}/node/speaker?page[limit]=${limit}&sort=${sort}&include=photo.field_media_image`,
  );
  const speakers = ensureArray(json.data);
  const includedMap = buildIncludedMap(json.included);
  return speakers.map((s) => mapSpeaker(s, [], includedMap));
}

async function listSponsors(
  limit: number,
  sort: string,
): Promise<SponsorEntity[]> {
  const json = await drupalFetch<JsonApiResponse>(
    `${JSON_API_PREFIX}/node/sponsor?page[limit]=${limit}&sort=${sort}&include=logo.field_media_image`,
  );
  const sponsors = ensureArray(json.data);
  const includedMap = buildIncludedMap(json.included);
  return sponsors.map((s) => mapSponsorEntity(s, includedMap));
}

async function listBlogs(
  limit: number,
  sort: string,
): Promise<unknown[]> {
  // Returned raw; ListingParagraph maps them.
  const json = await drupalFetch<JsonApiResponse>(
    `${JSON_API_PREFIX}/node/blog?page[limit]=${limit}&sort=${sort}`,
  );
  return ensureArray(json.data);
}

async function fetchSponsorsForConference(
  conferenceUuid: string,
): Promise<Sponsor[]> {
  try {
    const json = await drupalFetch<JsonApiResponse>(
      `${JSON_API_PREFIX}/node/sponsor?filter[conferences.id]=${conferenceUuid}&include=logo.field_media_image&sort=sort_weight`,
    );
    const includedMap = buildIncludedMap(json.included);
    return ensureArray(json.data).map((s) => mapSponsor(s, includedMap));
  } catch {
    return [];
  }
}

async function fetchSessionsForSpeaker(
  speakerUuid: string,
): Promise<Speaker['sessions']> {
  try {
    const json = await drupalFetch<JsonApiResponse>(
      `${JSON_API_PREFIX}/node/session?filter[speakers.id]=${speakerUuid}&include=track,skill_level&sort=start_time`,
    );
    const sessions = ensureArray(json.data);
    const includedMap = buildIncludedMap(json.included);

    return sessions.map((s) => {
      const attrs = s.attributes;
      const trackRel = s.relationships?.track?.data;
      const trackResource = trackRel ? resolveRel(trackRel, includedMap) : null;
      const trackName = trackResource?.attributes?.name || '';

      const skillRel = s.relationships?.skill_level?.data;
      const skillResource = skillRel ? resolveRel(skillRel, includedMap) : null;
      const skillLevel = skillResource?.attributes?.name || '';

      const startTime = attrs.start_time || '';
      const endTime = attrs.end_time || '';

      return {
        id: s.id,
        title: attrs.title || '',
        track: trackName,
        type: (attrs.session_type || '').charAt(0).toUpperCase() + (attrs.session_type || '').slice(1),
        skillLevel,
        startTime,
        endTime,
        date: startTime
          ? new Date(startTime).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })
          : '',
        pathAlias: (attrs.path?.alias || '').split('/').filter(Boolean).pop() || '',
        // Link to the full alias — a speaker's sessions can span conferences.
        url: attrs.path?.alias || '',
      };
    });
  } catch {
    return [];
  }
}
