import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { trackColor } from "@/components/colors";
import type { Reservation } from "@/types";
import styles from "./ReservationCard.module.scss";

interface ReservationCardProps {
  reservation: Reservation;
}

export function ReservationCard({ reservation }: ReservationCardProps) {
  return (
    <div className={styles.sessionItem}>
      {/* Colored left border */}
      <div
        className={styles.statusBar}
        style={{
          backgroundColor:
            reservation.status === "Confirmed"
              ? "var(--electric-blue)"
              : "var(--badge-workshop)",
        }}
      />

      <div className={styles.sessionContent}>
        <div className={styles.sessionTop}>
          <div className={styles.sessionInfo}>
            <h4 className={styles.sessionTitle}>{reservation.title}</h4>
            <p className={styles.sessionDatetime}>
              {reservation.date} · {reservation.time}
            </p>
            <div className={styles.sessionDetails}>
              <span className={styles.sessionRoom}>
                {reservation.room}
              </span>
              <Badge color={trackColor(reservation.track)}>{reservation.track}</Badge>
            </div>
          </div>

          <span
            className={styles.statusBadge}
            style={{
              backgroundColor:
                reservation.status === "Confirmed"
                  ? "#10B981"
                  : "var(--badge-workshop)",
            }}
          >
            {reservation.status}
          </span>
        </div>

        <Link
          href={reservation.url}
          className={styles.sessionLink}
        >
          View session details
          <ArrowRight className={`icon icon--sm ${styles.linkArrow}`} />
        </Link>
      </div>
    </div>
  );
}
