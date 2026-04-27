import Link from "next/link";
import { Badge } from "@/components/atoms/Badge";
import { Avatar } from "@/components/atoms/Avatar";
import type { FeaturedSession } from "@/types";
import styles from "./SessionCard.module.scss";

interface SessionCardProps {
  session?: FeaturedSession;
  children?: React.ReactNode;
  className?: string;
}

/** Self-contained session card; pass a `session` for data-driven mode or `children` as a fallback. */
export function SessionCard({ session, children, className }: SessionCardProps) {
  return (
    <Link href={session?.url ?? "#"} className={styles.cardLink}>
      <article className={`${styles.card} ${className ?? ""}`}>
        {session ? (
          <>
            <div className={styles.speaker}>
              <div className={styles.avatar}>
                <Avatar src={session.avatar} name={session.speaker} />
              </div>
              <div>
                <p className={styles.speakerName}>{session.speaker}</p>
                <p className={styles.time}>{session.time}</p>
              </div>
            </div>

            <h3 className={`${styles.title} ${styles.cardTitle}`}>
              {session.title}
            </h3>

            <Badge color={session.trackColor}>
              {session.track}
            </Badge>
          </>
        ) : (
          children
        )}
      </article>
    </Link>
  );
}

export { styles as sessionCardStyles };
