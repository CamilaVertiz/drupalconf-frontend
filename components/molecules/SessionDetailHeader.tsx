import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { trackColor, skillLevelColor, sessionTypeColor } from "@/components/colors";
import type { SessionDetail } from "@/types";
import styles from "./SessionDetailHeader.module.scss";

interface SessionDetailHeaderProps {
  data: SessionDetail;
}

export function SessionDetailHeader({ data }: SessionDetailHeaderProps) {
  const { title, track, skillLevel, type } = data;

  return (
    <>
      <div className={styles.content}>
        <Link href={`/conferences/${data.conferenceId}/schedule`} className={styles.back}>
          <ArrowLeft className="icon icon--sm" />
          Back to Schedule
        </Link>
      </div>

      <div className={styles.headerSection}>
        <div className={styles.badges}>
          <Badge color={trackColor(track)}>{track}</Badge>
          <Badge color={skillLevelColor(skillLevel)}>{skillLevel}</Badge>
          <Badge color={sessionTypeColor(type)}>{type}</Badge>
        </div>

        <h1 className={styles.title}>{title}</h1>
      </div>
    </>
  );
}
