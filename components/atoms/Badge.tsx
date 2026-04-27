import styles from "./Badge.module.scss";

interface BadgeProps {
  color: string;
  children: React.ReactNode;
}

export function Badge({ color, children }: BadgeProps) {
  return (
    <span className={styles.badge} style={{ backgroundColor: color }}>
      {children}
    </span>
  );
}
