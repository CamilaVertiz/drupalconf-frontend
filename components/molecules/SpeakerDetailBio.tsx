import type { SpeakerProfile } from "@/types";
import styles from "./SpeakerDetailBio.module.scss";

interface SpeakerDetailBioProps {
  data: SpeakerProfile;
}

export function SpeakerDetailBio({ data }: SpeakerDetailBioProps) {
  const { bio } = data;

  return (
    <div className={styles.bio}>
      <h3>About</h3>
      <div className={styles.bioText}>
        {bio.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
