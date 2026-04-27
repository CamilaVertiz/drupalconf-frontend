import Link from "next/link";
import { Star } from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import type { Speaker } from "@/types";
import styles from "./SpeakerCard.module.scss";

interface SpeakerCardProps {
  speaker: Speaker;
}

export function SpeakerCard({ speaker }: SpeakerCardProps) {
  return (
    <Link
      href={`/speakers/${speaker.pathAlias}`}
      className={styles.cardLink}
    >
      <div className={styles.card}>
        {/* Avatar */}
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            <Avatar src={speaker.avatar} name={speaker.name} />
          </div>
          {speaker.featured && (
            <div className={styles.featuredBadge}>
              <Star className="icon icon--sm icon--filled" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className={styles.cardInfo}>
          <h3 className={styles.name}>
            {speaker.name}
          </h3>
          <p className={styles.title}>
            {speaker.title}
          </p>
          <p className={styles.company}>
            {speaker.company}
          </p>
        </div>
      </div>
    </Link>
  );
}
