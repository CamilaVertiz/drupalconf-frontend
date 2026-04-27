"use client";

import styles from "./ReservationSearchForm.module.scss";

interface ReservationSearchFormData {
  email: string;
  onEmailChange: (value: string) => void;
  onSearch: () => void;
}

interface ReservationSearchFormProps {
  data: ReservationSearchFormData;
}

export function ReservationSearchForm({ data }: ReservationSearchFormProps) {
  const { email, onEmailChange, onSearch } = data;

  return (
    <>
      <div className={styles.field}>
        <label>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
          placeholder="your.email@example.com"
          className={styles.input}
        />
      </div>

      <button
        onClick={onSearch}
        className={styles.submit}
      >
        Find my sessions
      </button>
    </>
  );
}
