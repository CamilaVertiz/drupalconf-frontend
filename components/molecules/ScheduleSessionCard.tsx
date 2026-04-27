import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import {
  trackColor,
  skillLevelColor,
  sessionTypeColor,
} from "@/components/colors";
import type { ScheduleSession } from "@/types";
import styles from "./ScheduleSessionCard.module.scss";

interface ScheduleSessionCardProps {
  session: ScheduleSession;
}

export function ScheduleSessionCard({ session }: ScheduleSessionCardProps) {
  return (
    <Link href={session.url} className={styles.cardLink}>
      <article className={styles.card}>
        <div className={styles.cardBadges}>
          <Badge color={trackColor(session.track)}>
            {session.track}
          </Badge>
          <Badge color={skillLevelColor(session.skillLevel)}>
            {session.skillLevel}
          </Badge>
          <Badge color={sessionTypeColor(session.type)}>
            {session.type}
          </Badge>
        </div>

        <h3 className={styles.title}>{session.title}</h3>

        <div className={styles.cardMeta}>
          <span className={styles.cardSpeaker}>{session.speaker}</span>
          <span className={styles.cardRoom}>{session.room}</span>
        </div>

        <span className={styles.linkAction}>
          View details
          <ArrowRight className="icon icon--sm" />
        </span>
      </article>
    </Link>
  );
}
