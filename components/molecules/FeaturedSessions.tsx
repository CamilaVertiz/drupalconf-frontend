import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScheduleSessionGrid } from "@/components/molecules/ScheduleSessionGrid";
import type { ScheduleSession } from "@/types";
import styles from "./FeaturedSessions.module.scss";

interface FeaturedSessionsData {
  sessions: ScheduleSession[];
  heading?: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
}

interface FeaturedSessionsProps {
  data: FeaturedSessionsData;
}

export function FeaturedSessions({ data }: FeaturedSessionsProps) {
  const {
    sessions,
    heading = "Featured Sessions",
    subtitle,
    viewAllLink = "/conference",
    viewAllText = "View All Sessions",
  } = data;

  return (
    <section className={styles.featured} aria-label={heading}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2>{heading}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          <Link href={viewAllLink} className={styles.viewAll}>
            {viewAllText}
            <ArrowRight className={`icon icon--md ${styles.linkArrow}`} />
          </Link>
        </div>

        <ScheduleSessionGrid sessions={sessions} />
      </div>
    </section>
  );
}
