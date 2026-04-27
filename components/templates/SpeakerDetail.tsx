import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SpeakerDetailHero } from "@/components/molecules/SpeakerDetailHero";
import { SpeakerDetailBio } from "@/components/molecules/SpeakerDetailBio";
import { SpeakerDetailSessions } from "@/components/molecules/SpeakerDetailSessions";
import type { Speaker as SpeakerType } from '@/lib/drupal/types';
import type { SpeakerProfile, SessionType, SkillLevel, Track } from "@/types";
import { trackColor } from "@/components/colors";
import styles from "./SpeakerDetail.module.scss";

interface SpeakerDetailProps {
  data: SpeakerType;
}

function formatTime12(isoString: string): string {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const h = date.getHours();
    const m = date.getMinutes();
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
  } catch {
    return isoString;
  }
}

export default function SpeakerDetail({ data }: SpeakerDetailProps) {
  const speaker: SpeakerProfile = {
    id: data.id,
    conferenceId: "",
    name: data.name,
    avatar: data.avatar,
    title: data.title,
    company: data.company,
    bio: data.bio ? data.bio.replace(/<[^>]*>/g, "").trim() : "",
    pathAlias: data.pathAlias,
    social: {
      github: data.social.github ?? "",
      linkedin: data.social.linkedin ?? "",
      twitter: data.social.twitter ?? "",
    },
    sessions: data.sessions.map((s) => ({
      id: s.id,
      title: s.title,
      track: s.track as Track,
      trackColor: trackColor(s.track),
      type: s.type as SessionType,
      skillLevel: s.skillLevel as SkillLevel,
      time: `${formatTime12(s.startTime)} - ${formatTime12(s.endTime)}`,
      day: s.date,
      pathAlias: s.pathAlias,
      url: s.url,
    })),
  };

  return (
    <div className={styles.speakerDetail}>
      {/* Back navigation */}
      <div className={styles.content}>
        <Link href="/speakers" className={styles.back}>
          <ArrowLeft className="icon icon--sm" />
          Back to Speakers
        </Link>
      </div>

      {/* Main content: hero, bio, sessions */}
      <div className={styles.main}>
        <SpeakerDetailHero data={speaker} />
        <SpeakerDetailBio data={speaker} />
        <SpeakerDetailSessions data={speaker} />
      </div>
    </div>
  );
}
