import { ExternalLink } from 'lucide-react';
import type { SponsorEntity } from '@/lib/drupal/types';
import styles from './Sponsor.module.scss';

interface SponsorProps {
  data: SponsorEntity;
}

export default function Sponsor({ data }: SponsorProps) {
  return (
    <section className={styles.sponsor}>
      <div className={styles.container}>
        {data.tier && <span className={styles.tier}>{data.tier}</span>}
        {data.logo && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={data.logo} alt={data.title} className={styles.logo} />
        )}
        <h1 className={styles.title}>{data.title}</h1>
        {data.tagline && <p className={styles.tagline}>{data.tagline}</p>}
        {data.body && (
          <div
            className={styles.body}
            dangerouslySetInnerHTML={{ __html: data.body }}
          />
        )}
        {data.website && (
          <a
            href={data.website}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.website}
          >
            Visit Website
            <ExternalLink className="icon icon--sm" />
          </a>
        )}
      </div>
    </section>
  );
}
