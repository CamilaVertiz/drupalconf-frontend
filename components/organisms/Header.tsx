'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MenuItem } from '@/lib/drupal/types';
import styles from './Header.module.scss';

interface HeaderProps {
  menu: MenuItem[];
}

export function Header({ menu }: HeaderProps) {
  const pathname = usePathname();

  return (
    <nav className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <span className={styles.logoLetter}>D</span>
          </div>
          <span className={styles.logoText}>
            DrupalConf
          </span>
        </Link>

        <div className={styles.nav}>
          {menu
            .filter((item) => item.enabled)
            .map((item) => {
              const href = item.url ?? '#';
              const isActive = pathname === href;
              return (
                <Link
                  key={href + item.title}
                  href={href}
                  className={`${styles.link}${isActive ? ` ${styles.linkActive}` : ''}`}
                >
                  {item.title}
                  {isActive && <div className={styles.linkIndicator} />}
                </Link>
              );
            })}
        </div>
      </div>
    </nav>
  );
}
