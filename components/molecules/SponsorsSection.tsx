import type { SponsorTierGroup } from "@/types";
import styles from "./SponsorsSection.module.scss";

interface SponsorsSectionData {
  tiers: SponsorTierGroup[];
  heading?: string;
  subtitle?: string;
}

interface SponsorsSectionProps {
  data: SponsorsSectionData;
}

export function SponsorsSection({ data }: SponsorsSectionProps) {
  const { tiers, heading = "Our Sponsors", subtitle } = data;

  return (
    <section className={styles.sponsors} aria-label={heading}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{heading}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {tiers.map((tier) => (
          <div key={tier.name} className={styles.tier}>
            <div className={styles.tierLabel}>
              <span className={styles.tierBadge}>
                {tier.label}
              </span>
            </div>
            <div className={`${styles.grid} ${styles[`grid--${tier.name}`]}`}>
              {tier.sponsors.map((sponsor) => (
                <div
                  key={sponsor}
                  className={`${styles.logo} ${styles[`logo--${tier.name}`]}`}
                >
                  <span className={styles.sponsorName}>{sponsor}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
