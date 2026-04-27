import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import styles from "./HeroSection.module.scss";

interface HeroSectionData {
  badge?: string;
  title: string;
  dates?: string;
  location?: string;
  attendees?: string;
  description: string;
  ctaLink?: string;
  ctaText?: string;
  /** Conference hero image URL from Drupal; omitted renders the plain gradient. */
  backgroundImage?: string | null;
}

interface HeroSectionProps {
  data: HeroSectionData;
}

export function HeroSection({ data }: HeroSectionProps) {
  const {
    badge,
    title,
    dates,
    location,
    attendees,
    description,
    ctaLink = "/conferences",
    ctaText = "View Schedule",
    backgroundImage,
  } = data;

  const metaItems = [
    ...(location
      ? [{ icon: <MapPin className="icon icon--lg icon--accent" />, text: location }]
      : []),
    ...(dates
      ? [{ icon: <Calendar className="icon icon--lg icon--accent" />, text: dates }]
      : []),
    ...(attendees
      ? [{ icon: <Users className="icon icon--lg icon--accent" />, text: attendees }]
      : []),
  ];

  return (
    <section className={styles.hero} aria-label="Hero">
      {backgroundImage && (
        <div
          className={styles.backgroundImage}
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true"
        />
      )}
      <div className={styles.decorations} aria-hidden="true">
        <div className={`${styles.circle} ${styles.circle1}`} />
        <div className={`${styles.circle} ${styles.circle2}`} />
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          {badge && (
            <span className={styles.badge}>{badge}</span>
          )}

          <h1 className={styles.title}>{title}</h1>

          {metaItems.length > 0 && (
            <div className={styles.meta}>
              {metaItems.map((item, index) => (
                <div key={index} className={styles.metaItem}>
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          )}

          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: description }}
          />

          <Link href={ctaLink} className={styles.cta}>
            {ctaText}
            <ArrowRight className={`icon icon--md ${styles.ctaArrow}`} />
          </Link>
        </div>
      </div>
    </section>
  );
}
