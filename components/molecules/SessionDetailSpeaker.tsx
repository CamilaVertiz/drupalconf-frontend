import Link from "next/link";
import { Avatar } from "@/components/atoms/Avatar";
import type { SessionDetail } from "@/types";
import styles from "./SessionDetailSpeaker.module.scss";

interface SessionDetailSpeakerProps {
  data: SessionDetail;
}

export function SessionDetailSpeaker({ data }: SessionDetailSpeakerProps) {
  const { speaker } = data;

  return (
    <div className={styles.speakerCard}>
      <div className={styles.speakerInner}>
        <div className={styles.speakerAvatar}>
          <Avatar src={speaker.avatar} name={speaker.name} />
        </div>
        <div className={styles.speakerInfo}>
          <Link
            href={`/speakers/${speaker.pathAlias}`}
            className={styles.speakerName}
          >
            {speaker.name}
          </Link>
          <p className={styles.speakerRole}>
            {speaker.title} at {speaker.company}
          </p>
        </div>
      </div>
    </div>
  );
}
