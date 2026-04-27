import Link from "next/link";
import type { MenuItem } from "@/lib/drupal/types";
import styles from "./Footer.module.scss";

interface FooterProps {
  /** The Drupal `footer` menu. Top-level items with children render as their
   *  own column; top-level items without children share a "Navigate" column. */
  menu?: MenuItem[];
}

/** Shown when the Drupal `footer` menu is empty, so the footer is never bare. */
const FALLBACK_LINKS: { title: string; url: string }[] = [
  { title: "Home", url: "/home" },
  { title: "Conferences", url: "/conferences" },
  { title: "Blog", url: "/blogs" },
  { title: "About", url: "/about" },
  { title: "Contact", url: "/contact" },
];

interface Column {
  title: string;
  links: { title: string; url: string }[];
}

function buildColumns(menu: MenuItem[]): Column[] {
  const enabled = menu.filter((item) => item.enabled);
  const columns: Column[] = [];
  const loose: { title: string; url: string }[] = [];

  for (const item of enabled) {
    const children = item.children.filter((child) => child.enabled && child.url);
    if (children.length > 0) {
      columns.push({
        title: item.title,
        links: children.map((child) => ({ title: child.title, url: child.url! })),
      });
    } else if (item.url) {
      loose.push({ title: item.title, url: item.url });
    }
  }

  if (loose.length > 0) columns.unshift({ title: "Navigate", links: loose });
  return columns;
}

export function Footer({ menu = [] }: FooterProps) {
  const columns = buildColumns(menu);
  const resolved =
    columns.length > 0
      ? columns
      : [{ title: "Navigate", links: FALLBACK_LINKS }];

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.brandHeader}>
              <div className={styles.brandIcon}>
                <span className={styles.brandLetter}>D</span>
              </div>
              <span className={styles.brandName}>
                DrupalConf
              </span>
            </div>
            <p className={styles.brandDescription}>
              The premier Drupal conference bringing together developers from around the world.
            </p>
          </div>

          {resolved.map((column) => (
            <div key={column.title}>
              <h4 className={styles.columnTitle}>{column.title}</h4>
              <ul className={styles.linkList}>
                {column.links.map((link) => (
                  <li key={link.url + link.title}>
                    <Link href={link.url} className={styles.link}>
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <p>&copy; 2026 DrupalConf. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
