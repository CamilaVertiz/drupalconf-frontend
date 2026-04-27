export type {
  Conference,
  Session,
  Sponsor as SponsorEntity,
  Venue,
  Page,
  Paragraph,
  ParagraphHero,
  ParagraphCopy,
  ParagraphListing,
  ParagraphContactForm,
  MenuItem,
  ResolvedEntity,
} from '@/lib/drupal/types';

export type SessionType = "Keynote" | "Talk" | "Workshop" | "Panel" | "Lightning";
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";
export type Track = "Frontend" | "Backend" | "DevOps" | "UX";
export type SponsorTier = "platinum" | "gold" | "silver";
export type ReservationStatus = "Confirmed" | "Pending";

export interface FeaturedSession {
  id: string;
  conferenceId: string;
  title: string;
  speaker: string;
  /** Speaker photo URL from Drupal; null falls back to initials. */
  avatar: string | null;
  track: Track;
  trackColor: string;
  time: string;
  pathAlias: string;
  /** Full path alias of the session — link to this directly. */
  url: string;
}

export interface SponsorTierGroup {
  name: SponsorTier;
  label: string;
  sponsors: string[];
}

export interface SessionDetail {
  id: string;
  conferenceId: string;
  title: string;
  pathAlias: string;
  speaker: {
    id: string;
    name: string;
    /** Speaker photo URL from Drupal; null falls back to initials. */
    avatar: string | null;
    title: string;
    company: string;
    pathAlias: string;
  };
  type: SessionType;
  skillLevel: SkillLevel;
  track: Track;
  startTime: string;
  endTime: string;
  date: string;
  room: string;
  seatsRemaining: number;
  totalSeats: number;
  description: string;
  slidesUrl: string;
  videoUrl: string;
}

export interface SpeakerProfile {
  id: string;
  conferenceId: string;
  name: string;
  /** Speaker photo URL from Drupal; null falls back to initials. */
  avatar: string | null;
  title: string;
  company: string;
  bio: string;
  pathAlias: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  sessions: {
    id: string;
    title: string;
    track: Track;
    trackColor: string;
    type: SessionType;
    skillLevel: SkillLevel;
    time: string;
    day: string;
    pathAlias: string;
    /** Full path alias of the session (includes its conference). */
    url: string;
  }[];
}

export interface ConferenceListingItem {
  id: string;
  name: string;
  city: string;
  dates: string;
  status: string;
  statusColor: string;
  pathAlias: string;
}

export interface ScheduleSession {
  id: string;
  conferenceId: string;
  title: string;
  speaker: string;
  type: SessionType;
  skillLevel: SkillLevel;
  track: Track;
  room: string;
  startTime: string;
  duration: number;
  pathAlias: string;
  /** Full path alias of the session — link to this directly. */
  url: string;
}

export interface Speaker {
  id: string;
  conferenceId: string;
  name: string;
  /** Speaker photo URL from Drupal; null falls back to initials. */
  avatar: string | null;
  title: string;
  company: string;
  featured: boolean;
  bio?: string;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  pathAlias: string;
}

export interface Reservation {
  id: number;
  conferenceAlias: string;
  sessionPathAlias: string;
  /** Full path alias of the session — link to this directly. */
  url: string;
  title: string;
  date: string;
  time: string;
  room: string;
  track: Track;
  status: ReservationStatus;
}

export interface ReservationsResponse {
  data: Reservation[];
  meta?: {
    total: number;
    page?: number;
    pageSize?: number;
  };
}

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
