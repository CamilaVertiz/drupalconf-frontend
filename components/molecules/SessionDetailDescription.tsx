import type { SessionDetail } from "@/types";
import styles from "./SessionDetailDescription.module.scss";

interface SessionDetailDescriptionProps {
  data: SessionDetail;
}

export function SessionDetailDescription({ data }: SessionDetailDescriptionProps) {
  const { description } = data;

  return (
    <div className={styles.description}>
      <h3>About This Session</h3>
      <div className={styles.descriptionText}>
        {description.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
