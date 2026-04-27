import type { ParagraphCopy } from '@/lib/drupal/types';
import styles from './CopyParagraph.module.scss';

export default function CopyParagraph(props: ParagraphCopy) {
  return (
    <section className={styles.copy}>
      <div className={styles.container}>
        {props.title && <h2 className={styles.title}>{props.title}</h2>}
        {props.copy && (
          <div
            className={styles.body}
            dangerouslySetInnerHTML={{ __html: props.copy }}
          />
        )}
      </div>
    </section>
  );
}
