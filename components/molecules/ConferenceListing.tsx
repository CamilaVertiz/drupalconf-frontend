import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import type { ConferenceListingItem } from "@/types";
import styles from "./ConferenceListing.module.scss";

interface ConferenceListingData {
  conferences: ConferenceListingItem[];
  heading: string;
  subtitle: string;
  viewAllLink: string;
  viewAllText: string;
}

interface ConferenceListingProps {
  data: ConferenceListingData;
}

export function ConferenceListing({ data }: ConferenceListingProps) {
  const {
    conferences,
    heading,
    subtitle,
    viewAllLink,
    viewAllText,
  } = data;

  return (
    <div className={styles.listing} aria-label={heading}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2>{heading}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        {viewAllLink && viewAllText && (
          <Link href={viewAllLink} className={styles.viewAllLink}>
            {viewAllText}
            <ArrowRight className="icon icon--sm" />
          </Link>
        )}
      </div>

      <div className={styles.grid}>
        {conferences.map((conference) => (
          <Link
            key={conference.id}
            href={`/conferences/${conference.pathAlias}`}
            className={styles.cardLink}
          >
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{conference.name}</h3>
                <span
                  className={styles.statusBadge}
                  style={{
                    color: conference.statusColor,
                    border: `1px solid ${conference.statusColor}`,
                  }}
                >
                  {conference.status}
                </span>
              </div>

              <div className={styles.cardDetails}>
                <div className={styles.detailItem}>
                  <Calendar className="icon icon--sm" />
                  <span>{conference.dates}</span>
                </div>
                <div className={styles.detailItem}>
                  <MapPin className="icon icon--sm" />
                  <span>{conference.city}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
