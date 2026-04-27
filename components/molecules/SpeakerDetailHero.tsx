import { Github, Linkedin, Twitter } from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import type { SpeakerProfile } from "@/types";
import styles from "./SpeakerDetailHero.module.scss";

interface SpeakerDetailHeroProps {
  data: SpeakerProfile;
}

export function SpeakerDetailHero({ data }: SpeakerDetailHeroProps) {
  const { avatar, name, social } = data;

  return (
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        {/* Avatar */}
        <div className={styles.avatar}>
          <Avatar src={avatar} name={name} />
        </div>

        {/* Info */}
        <div className={styles.info}>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.jobTitle}>{data.title}</p>
          <p className={styles.company}>{data.company}</p>

          {/* Social Links */}
          <div className={styles.social}>
            <a
              href={social.github}
              className={styles.socialLink}
            >
              <Github className="icon icon--md" />
            </a>
            <a
              href={social.linkedin}
              className={styles.socialLink}
            >
              <Linkedin className="icon icon--md" />
            </a>
            <a
              href={social.twitter}
              className={styles.socialLink}
            >
              <Twitter className="icon icon--md" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
