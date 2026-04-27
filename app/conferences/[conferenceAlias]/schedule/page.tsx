import { notFound } from 'next/navigation';
import { resolveByPath, listSessionsByConference } from '@/lib/drupal/resolve';
import type { ResolvedEntity, Conference } from '@/lib/drupal/types';
import Schedule from '@/components/templates/Schedule';
import type { ScheduleSession, SessionType, SkillLevel, Track } from '@/types';

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ conferenceAlias: string }>;
}) {
  const { conferenceAlias } = await params;

  const entity: ResolvedEntity | null = await resolveByPath(
    `/conferences/${conferenceAlias}`,
  );
  if (!entity || entity.type !== 'node--conference') notFound();

  const conf = entity as { type: 'node--conference'; data: Conference };
  const sessions = await listSessionsByConference(conf.data.id);

  const scheduleSessions: ScheduleSession[] = sessions.map((s) => {
    const startTime = s.startTime;
    const endTime = s.endTime;
    const duration = computeDuration(startTime, endTime);

    return {
      id: s.id,
      conferenceId: conferenceAlias,
      title: s.title,
      speaker: s.speakers[0]?.name || 'TBD',
      type: s.type as SessionType,
      skillLevel: s.skillLevel as SkillLevel,
      track: s.track as Track,
      room: s.room,
      startTime: extractTime(startTime),
      duration,
      pathAlias: s.pathAlias,
      url: s.url,
    };
  });

  return (
    <Schedule
      schedule={{
        sessions: scheduleSessions,
        heading: `${conf.data.title} Schedule`,
        subtitle:
          'Browse all sessions. Click on any session to see details and register.',
      }}
    />
  );
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
