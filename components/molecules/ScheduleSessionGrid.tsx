import { ScheduleSessionCard } from "./ScheduleSessionCard";
import type { ScheduleSession } from "@/types";
import styles from "./ScheduleSessionGrid.module.scss";

interface ScheduleSessionGridProps {
  sessions: ScheduleSession[];
}

export function ScheduleSessionGrid({ sessions }: ScheduleSessionGridProps) {
  return (
    <div className={styles.grid}>
      {sessions.map((session) => (
        <ScheduleSessionCard key={session.id} session={session} />
      ))}
    </div>
  );
}
