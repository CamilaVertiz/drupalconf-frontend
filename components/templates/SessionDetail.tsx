import { SessionDetailHeader } from "@/components/molecules/SessionDetailHeader";
import { SessionDetailSpeaker } from "@/components/molecules/SessionDetailSpeaker";
import { SessionDetailInfo } from "@/components/molecules/SessionDetailInfo";
import { SessionDetailDescription } from "@/components/molecules/SessionDetailDescription";
import type { SessionDetail as SessionDetailType } from "@/types";
import styles from "./SessionDetail.module.scss";

interface SessionDetailProps {
  session: SessionDetailType;
  onRegister: () => void;
}

export default function SessionDetail({ session, onRegister }: SessionDetailProps) {
  return (
    <div className={styles.sessionDetail}>
      <SessionDetailHeader data={session} />

      <div className={styles.main}>
        <SessionDetailSpeaker data={session} />
        <SessionDetailInfo data={session} />
        <SessionDetailDescription data={session} />

        <div className={styles.register}>
          <button
            onClick={onRegister}
            className={styles.registerBtn}
          >
            Register for this session
          </button>
          <p className={styles.registerInfo}>
            {session.seatsRemaining} seats remaining
          </p>
        </div>
      </div>
    </div>
  );
}
