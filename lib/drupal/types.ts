
export interface JsonApiResource {
  type: string;
  id: string;
  attributes: Record<string, any>;
  relationships?: Record<string, { data?: any }>;
  links?: Record<string, any>;
}

export interface JsonApiResponse {
  jsonapi?: { version: string; meta: any };
  data: JsonApiResource | JsonApiResource[];
  included?: JsonApiResource[];
  meta?: Record<string, any>;
  links?: Record<string, any>;
}

export interface Venue {
  id: string;
  title: string;
  city: string;
  country: string;
}

export interface Sponsor {
  id: string;
  title: string;
  tier: string;
  website: string | null;
  logo: string | null;
}

export interface Conference {
  id: string;
  title: string;
  tagline: string;
  body: string;
  status: string;
  date_start: string;
  date_end: string;
  max_attendees: number | null;
  featured: boolean;
  website: string | null;
  social_links: { uri: string; title: string }[];
  pathAlias: string;
  logo: string | null;
  heroImage: string | null;
  venue: Venue | null;
  sponsors: Sponsor[];
}

export interface SessionSpeaker {
  id: string;
  name: string;
  avatar: string | null;
  title: string;
  company: string;
  pathAlias: string;
}

export interface Session {
  id: string;
  title: string;
  body: string;
  type: string;
  skillLevel: string;
  track: string;
  room: string;
  startTime: string;
  endTime: string;
  date: string;
  maxSeats: number | null;
  /** Computed remaining capacity from the backend; null = unlimited. */
  seatsRemaining: number | null;
  featured: boolean;
  slidesUrl: string | null;
  videoUrl: string | null;
  pathAlias: string;
  /** Full path alias, e.g. /conferences/{conf}/schedule/{slug}. */
  url: string;
  speakers: SessionSpeaker[];
}

export interface Speaker {
  id: string;
  name: string;
  avatar: string | null;
  title: string;
  company: string;
  country: string;
  bio: string;
  featured: boolean;
  pathAlias: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  sessions: {
    id: string;
    title: string;
    track: string;
    type: string;
    skillLevel: string;
    startTime: string;
    endTime: string;
    date: string;
    pathAlias: string;
    /** Full path alias of the session, including its conference. */
    url: string;
  }[];
}

export interface SponsorEntity {
  id: string;
  title: string;
  body: string;
  tier: string;
  tagline: string;
  website: string | null;
  logo: string | null;
  pathAlias: string;
}

export interface Page {
  id: string;
  title: string;
  paragraphs: Paragraph[];
}

export type ParagraphBase = { id: string; type: string };

export type ParagraphHero = ParagraphBase & {
  type: 'paragraph--hero';
  title?: string;
  copy?: string;
  eyebrow?: string;
  link?: { uri: string; title: string } | null;
};

export type ParagraphCopy = ParagraphBase & {
  type: 'paragraph--copy';
  title?: string;
  copy?: string;
};

export type ParagraphListing = ParagraphBase & {
  type: 'paragraph--listing';
  title?: string;
  bundle: 'conference' | 'session' | 'speaker' | 'sponsor' | 'blog';
};

export type ParagraphContactForm = ParagraphBase & {
  type: 'paragraph--contact_form';
  title?: string;
  copy?: string;
};

export type Paragraph =
  | ParagraphHero
  | ParagraphCopy
  | ParagraphListing
  | ParagraphContactForm;

export type MenuItem = {
  title: string;
  url: string | null;
  weight: number;
  enabled: boolean;
  expanded: boolean;
  description: string | null;
  children: MenuItem[];
};

export type ResolvedEntity =
  | { type: 'node--basic_page'; data: Page }
  | { type: 'node--blog'; data: Page }
  | { type: 'node--conference'; data: Conference }
  | { type: 'node--session'; data: Session }
  | { type: 'node--speaker'; data: Speaker }
  | { type: 'node--sponsor'; data: SponsorEntity }
  | { type: 'unknown' };
