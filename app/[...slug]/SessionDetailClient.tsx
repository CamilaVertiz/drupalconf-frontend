'use client';

import { useState } from 'react';
import { RegistrationModal } from '@/components/organisms/RegistrationModal';
import SessionDetailTemplate from '@/components/templates/SessionDetail';
import type { Session } from '@/lib/drupal/types';
import type { SessionType, SkillLevel, Track } from '@/types';
import { trackColor, skillLevelColor } from '@/components/colors';

interface SessionDetailClientProps {
  data: Session;
}

export default function SessionDetailClient({ data }: SessionDetailClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const firstSpeaker = data.speakers[0];

  // 2nd segment of /conferences/{conf}/schedule/{slug}.
  const conferenceId = data.url.split('/').filter(Boolean)[1] ?? '';

  const sessionDetail = {
    id: data.id,
    conferenceId,
    title: data.title,
    pathAlias: data.pathAlias,
    speaker: firstSpeaker
      ? {
          id: firstSpeaker.id,
          name: firstSpeaker.name,
          avatar: firstSpeaker.avatar,
          title: firstSpeaker.title,
          company: firstSpeaker.company,
          pathAlias: firstSpeaker.pathAlias,
        }
      : { id: '', name: '', avatar: null, title: '', company: '', pathAlias: '' },
    type: data.type as SessionType,
    skillLevel: data.skillLevel as SkillLevel,
    track: data.track as Track,
    startTime: formatTime12(data.startTime),
    endTime: formatTime12(data.endTime),
    date: data.date,
    room: data.room,
    seatsRemaining: data.seatsRemaining ?? data.maxSeats ?? 0,
    totalSeats: data.maxSeats ?? 0,
    description: data.body ? data.body.replace(/<[^>]*>/g, '').trim() : '',
    slidesUrl: data.slidesUrl ?? '',
    videoUrl: data.videoUrl ?? '',
  };

  return (
    <>
      <SessionDetailTemplate
        session={sessionDetail}
        onRegister={() => setIsModalOpen(true)}
      />

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        session={{
          id: sessionDetail.id,
          title: sessionDetail.title,
          speaker: sessionDetail.speaker,
          date: sessionDetail.date,
          startTime: sessionDetail.startTime,
          endTime: sessionDetail.endTime,
          room: sessionDetail.room,
          track: sessionDetail.track,
          trackColor: trackColor(sessionDetail.track),
          skillLevel: sessionDetail.skillLevel,
          skillLevelColor: skillLevelColor(sessionDetail.skillLevel),
          seatsRemaining: sessionDetail.seatsRemaining,
        }}
      />
    </>
  );
}

function formatTime12(isoString: string): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const h = date.getHours();
    const m = date.getMinutes();
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
  } catch {
    return isoString;
  }
}
