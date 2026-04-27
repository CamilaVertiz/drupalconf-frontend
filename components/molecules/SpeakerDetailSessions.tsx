import Link from "next/link";
import { Badge } from "@/components/atoms/Badge";
import type { SpeakerProfile } from "@/types";
import { skillLevelColor, sessionTypeColor } from "@/components/colors";
import styles from "./SpeakerDetailSessions.module.scss";

interface SpeakerDetailSessionsProps {
  data: SpeakerProfile;
}

export function SpeakerDetailSessions({ data }: SpeakerDetailSessionsProps) {
  const { name, sessions } = data;

  return (
    <div className={styles.sessions}>
      <h3>Sessions by {name.split(' ')[0]}</h3>
      <div className={styles.sessionsList}>
        {sessions.map((session) => (
          <Link
            key={session.id}
            href={session.url}
            className={styles.sessionLink}
          >
            <div className={styles.sessionHeader}>
              <div className={styles.sessionTitleWrapper}>
                <h4 className={styles.sessionTitle}>
                  {session.title}
                </h4>
                <p className={styles.sessionMeta}>
                  {session.day} • {session.time}
                </p>
              </div>
            </div>

            <div className={styles.sessionBadges}>
              <Badge color={session.trackColor}>{session.track}</Badge>
              <Badge color={skillLevelColor(session.skillLevel)}>{session.skillLevel}</Badge>
              <Badge color={sessionTypeColor(session.type)}>{session.type}</Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
