import { SpeakerGrid } from "@/components/molecules/SpeakerGrid";
import type { Speaker } from "@/types";
import styles from "./Speakers.module.scss";

interface SpeakersData {
  speakers: Speaker[];
  heading?: string;
  subtitle?: string;
}

interface SpeakersProps {
  speakers: SpeakersData;
}

export default function Speakers({ speakers: speakersData }: SpeakersProps) {
  const {
    speakers,
    heading = "Speakers",
    subtitle = "Meet the experts sharing their knowledge at DrupalConf 2026",
  } = speakersData;

  return (
    <div className={styles.speakers}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1>{heading}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        {/* Speaker Grid */}
        <SpeakerGrid speakers={speakers} />
      </div>
    </div>
  );
}
