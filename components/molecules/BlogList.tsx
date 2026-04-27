import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./BlogList.module.scss";

export interface BlogListItem {
  id: string;
  title: string;
  pathAlias: string;
  date?: string;
}

interface BlogListProps {
  posts: BlogListItem[];
}

export function BlogList({ posts }: BlogListProps) {
  return (
    <div className={styles.grid}>
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/blog/${post.pathAlias}`}
          className={styles.card}
        >
          {post.date && <span className={styles.date}>{post.date}</span>}
          <h3 className={styles.title}>{post.title}</h3>
          <span className={styles.readMore}>
            Read article
            <ArrowRight className="icon icon--sm" />
          </span>
        </Link>
      ))}
    </div>
  );
}
