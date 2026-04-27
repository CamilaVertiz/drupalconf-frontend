import { ReservationSearchForm } from "@/components/molecules/ReservationSearchForm";
import { ReservationList } from "@/components/molecules/ReservationList";
import type { Reservation } from "@/types";
import styles from "./CheckReservations.module.scss";

type ResultState =
  | "initial"
  | "no-results"
  | "results-found"
  | "all-past"
  | "emailed"
  | "error";

interface CheckReservationsData {
  heading: string;
  subtitle: string;
  helperText: string;
  email: string;
  onEmailChange: (value: string) => void;
  onSearch: () => void;
  resultState: ResultState;
  reservations: Reservation[];
  message?: string;
}

interface CheckReservationsProps {
  data: CheckReservationsData;
}

export default function CheckReservations({ data }: CheckReservationsProps) {
  const {
    heading,
    subtitle,
    helperText,
    email,
    onEmailChange,
    onSearch,
    resultState,
    reservations,
    message,
  } = data;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          {/* Header */}
          <div className={styles.header}>
            <h1>{heading}</h1>
            <p className={styles.subtitle}>
              {subtitle}
            </p>
          </div>

          {/* Form Card: contains both search form and results */}
          <div className={styles.formCard}>
            <ReservationSearchForm
              data={{ email, onEmailChange, onSearch }}
            />

            {resultState === "emailed" && (
              <p className={styles.helperText} role="status">
                {message}
              </p>
            )}

            {resultState === "error" && (
              <p className={styles.errorText} role="alert">
                {message ?? "Something went wrong. Please try again."}
              </p>
            )}

            {resultState !== "emailed" && resultState !== "error" && (
              <ReservationList
                data={{ resultState, reservations }}
              />
            )}
          </div>

          {/* Helper Text */}
          <p className={styles.helperText}>
            {helperText}
          </p>
        </div>
      </div>
    </div>
  );
}
