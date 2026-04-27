import { listByBundle } from '@/lib/drupal/resolve';
import { ConferenceListing } from '@/components/molecules/ConferenceListing';
import { ScheduleSessionGrid } from '@/components/molecules/ScheduleSessionGrid';
import { SpeakerGrid } from '@/components/molecules/SpeakerGrid';
import { SponsorGrid, type SponsorGridItem } from '@/components/molecules/SponsorGrid';
import { BlogList, type BlogListItem } from '@/components/molecules/BlogList';
import type {
  ParagraphListing,
  ConferenceListingItem,
  ScheduleSession,
  Speaker as SpeakerViewModel,
  SessionType,
  SkillLevel,
  Track,
} from '@/types';
import type {
  Conference,
  Session,
  Speaker as SpeakerEntity,
  SponsorEntity,
  JsonApiResource,
} from '@/lib/drupal/types';
import { conferenceStatusColor, conferenceStatusLabel } from '@/components/colors';
import styles from './ListingParagraph.module.scss';

export default async function ListingParagraph(props: ParagraphListing) {
  const items = await listByBundle(props.bundle, { limit: 6, sort: '-created' });

  return (
    <section className={styles.listing}>
      <div className={styles.container}>
        <ListingContent bundle={props.bundle} items={items} />
      </div>
    </section>
  );
}

function ListingContent({ bundle, items }: { bundle: string; items: unknown[] }) {
  switch (bundle) {
    case 'conference': {
      const conferences: ConferenceListingItem[] = (items as Conference[]).map((conf) => {
        return {
          id: conf.id,
          name: conf.title || '',
          city: conf.venue ? `${conf.venue.city}, ${conf.venue.country}` : 'TBD',
          dates:
            conf.date_start && conf.date_end
              ? formatDateRange(conf.date_start, conf.date_end)
              : 'Dates TBA',
          status: conferenceStatusLabel(conf.status),
          statusColor: conferenceStatusColor(conf.status),
          pathAlias: conf.pathAlias || '',
        };
      });
      return (
        <ConferenceListing
          data={{
            conferences,
            heading: 'Conferences',
            subtitle: 'Browse upcoming conferences',
            viewAllLink: '/conferences',
            viewAllText: 'View All',
          }}
        />
      );
    }
    case 'session': {
      const sessions: ScheduleSession[] = (items as Session[]).map((s) => ({
        id: s.id,
        conferenceId: '',
        title: s.title || '',
        speaker: s.speakers?.[0]?.name || 'TBD',
        type: (s.type || 'Talk') as SessionType,
        skillLevel: (s.skillLevel || 'Beginner') as SkillLevel,
        track: (s.track || 'Frontend') as Track,
        room: s.room || '',
        startTime: extractTime(s.startTime),
        duration: computeDuration(s.startTime, s.endTime),
        pathAlias: s.pathAlias || '',
        url: s.url || '',
      }));
      return <ScheduleSessionGrid sessions={sessions} />;
    }
    case 'speaker': {
      const speakers: SpeakerViewModel[] = (items as SpeakerEntity[]).map((s) => ({
        id: s.id,
        conferenceId: '',
        name: s.name || '',
        avatar: s.avatar ?? null,
        title: s.title || '',
        company: s.company || '',
        featured: s.featured ?? false,
        pathAlias: s.pathAlias || '',
      }));
      return <SpeakerGrid speakers={speakers} />;
    }
    case 'sponsor': {
      const sponsors: SponsorGridItem[] = (items as SponsorEntity[]).map((s) => ({
        id: s.id,
        name: s.title || '',
        tier: s.tier || '',
        tagline: s.tagline || '',
        pathAlias: s.pathAlias || '',
        logo: s.logo ?? null,
      }));
      return <SponsorGrid sponsors={sponsors} />;
    }
    case 'blog': {
      const posts: BlogListItem[] = (items as JsonApiResource[]).map((b) => ({
        id: b.id,
        title: b.attributes?.title || '',
        pathAlias: extractSlug(b.attributes?.path?.alias),
        date: b.attributes?.created
          ? new Date(b.attributes.created).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })
          : undefined,
      }));
      return <BlogList posts={posts} />;
    }
    default:
      return null;
  }
}

function extractSlug(pathAlias: string | undefined | null): string {
  if (!pathAlias) return '';
  const segments = pathAlias.split('/').filter(Boolean);
  return segments.pop() || '';
}

function extractTime(isoString: string): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  } catch {
    return isoString;
  }
}

function computeDuration(startTime: string, endTime: string): number {
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    return Math.round(diffMinutes / 30);
  } catch {
    return 2;
  }
}

function formatDateRange(dateStart: string, dateEnd: string): string {
  try {
    const start = new Date(dateStart);
    const end = new Date(dateEnd);
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  } catch {
    return `${dateStart} - ${dateEnd}`;
  }
}
