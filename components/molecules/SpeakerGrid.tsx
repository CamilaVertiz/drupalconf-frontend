import { SpeakerCard } from "@/components/molecules/SpeakerCard";
import type { Speaker } from "@/types";
import styles from "./SpeakerGrid.module.scss";

interface SpeakerGridProps {
  speakers: Speaker[];
}

export function SpeakerGrid({ speakers }: SpeakerGridProps) {
  return (
    <div className={styles.grid}>
      {speakers.map((speaker) => (
        <SpeakerCard key={speaker.id} speaker={speaker} />
      ))}
    </div>
  );
}
