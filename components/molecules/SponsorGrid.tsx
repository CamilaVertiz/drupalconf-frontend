import Link from "next/link";
import styles from "./SponsorGrid.module.scss";

export interface SponsorGridItem {
  id: string;
  name: string;
  tier: string;
  tagline: string;
  pathAlias: string;
  /** Logo URL from Drupal; null falls back to the sponsor name. */
  logo?: string | null;
}

interface SponsorGridProps {
  sponsors: SponsorGridItem[];
  heading?: string;
}

export function SponsorGrid({ sponsors, heading = "Our Sponsors" }: SponsorGridProps) {
  return (
    <>
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.grid}>
        {sponsors.map((sponsor) => (
        <Link
          key={sponsor.id}
          href={`/sponsors/${sponsor.pathAlias}`}
          className={styles.card}
        >
          {sponsor.tier && <span className={styles.tier}>{sponsor.tier}</span>}
          {sponsor.logo && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={sponsor.logo} alt={sponsor.name} className={styles.logo} />
          )}
          <h3 className={styles.name}>{sponsor.name}</h3>
          {sponsor.tagline && <p className={styles.tagline}>{sponsor.tagline}</p>}
          </Link>
        ))}
      </div>
    </>
  );
}
