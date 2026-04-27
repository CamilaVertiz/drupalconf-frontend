import { Calendar, Clock, MapPin, Users, FileText, Video } from "lucide-react";
import type { SessionDetail } from "@/types";
import styles from "./SessionDetailInfo.module.scss";

interface SessionDetailInfoProps {
  data: SessionDetail;
}

export function SessionDetailInfo({ data }: SessionDetailInfoProps) {
  const { date, startTime, endTime, room, seatsRemaining, totalSeats, slidesUrl, videoUrl } = data;

  return (
    <div className={styles.infoGrid}>
      <div className={styles.infoCard}>
        <h3>Session Information</h3>
        <div className={styles.infoList}>
          <div className={styles.infoRow}>
            <Calendar className="icon icon--md icon--accent" />
            <span>{date}</span>
          </div>
          <div className={styles.infoRow}>
            <Clock className="icon icon--md icon--accent" />
            <span>{startTime} - {endTime}</span>
          </div>
          <div className={styles.infoRow}>
            <MapPin className="icon icon--md icon--accent" />
            <span>{room}</span>
          </div>
          <div className={styles.infoRow}>
            <Users className="icon icon--md icon--accent" />
            <span>{seatsRemaining} seats remaining of {totalSeats}</span>
          </div>
        </div>
      </div>

      <div className={styles.infoCard}>
        <h3>Resources</h3>
        <div className={styles.infoList}>
          <a
            href={slidesUrl}
            className={styles.infoLink}
          >
            <FileText className="icon icon--md icon--accent" />
            <span>Download Slides</span>
          </a>
          <a
            href={videoUrl}
            className={styles.infoLink}
          >
            <Video className="icon icon--md icon--accent" />
            <span>Watch Recording</span>
          </a>
        </div>
      </div>
    </div>
  );
}
