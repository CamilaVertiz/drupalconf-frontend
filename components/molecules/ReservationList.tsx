import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { ReservationCard } from "@/components/molecules/ReservationCard";
import type { Reservation } from "@/types";
import styles from "./ReservationList.module.scss";

type ResultState = "initial" | "no-results" | "results-found" | "all-past";

interface ReservationListData {
  resultState: ResultState;
  reservations: Reservation[];
}

interface ReservationListProps {
  data: ReservationListData;
}

export function ReservationList({ data }: ReservationListProps) {
  const { resultState, reservations } = data;

  if (resultState === "initial") {
    return null;
  }

  return (
    <div className={styles.results}>
      {/* State A: No Results */}
      {resultState === "no-results" && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Calendar className="icon icon--xl" />
          </div>
          <p className={styles.emptyTitle}>
            No upcoming registrations found for this email
          </p>
          <p className={styles.emptyText}>
            If you registered recently, check your spam folder for our confirmation email.
          </p>
        </div>
      )}

      {/* State B: Results Found */}
      {resultState === "results-found" && (
        <div>
          <p className={styles.resultsLabel}>
            Your upcoming sessions
          </p>
          <div className={styles.resultsList}>
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
              />
            ))}
          </div>
        </div>
      )}

      {/* State C: All Past */}
      {resultState === "all-past" && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Calendar className="icon icon--xl" />
          </div>
          <p className={styles.emptyTitle}>
            Your registered sessions have already taken place.
          </p>
          <p className={`${styles.emptyText} ${styles["emptyText--withCta"]}`}>
            Hope you enjoyed conference!
          </p>
          <Link
            href="/"
            className={styles.pastCta}
          >
            Browse next edition
            <ArrowRight className="icon icon--sm" />
          </Link>
        </div>
      )}
    </div>
  );
}
