import { ScheduleSessionGrid } from "@/components/molecules/ScheduleSessionGrid";
import type { ScheduleSession } from "@/types";
import styles from "./Schedule.module.scss";

interface ScheduleData {
  sessions: ScheduleSession[];
  heading?: string;
  subtitle?: string;
}

interface ScheduleProps {
  schedule: ScheduleData;
}

export default function Schedule({ schedule }: ScheduleProps) {
  const {
    sessions,
    heading = "Conference Schedule",
    subtitle = "Browse all sessions for DrupalConf 2026. Click on any session to see details and register.",
  } = schedule;

  return (
    <div className={styles.schedule}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1>{heading}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        {/* Session Grid */}
        <ScheduleSessionGrid sessions={sessions} />
      </div>
    </div>
  );
}
