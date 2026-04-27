"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Check } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Avatar } from "@/components/atoms/Avatar";
import { createReservation } from "@/lib/drupal/reservations";
import styles from "./RegistrationModal.module.scss";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: {
    id: string;
    title: string;
    speaker: {
      name: string;
      avatar: string | null;
    };
    date: string;
    startTime: string;
    endTime: string;
    room: string;
    track: string;
    trackColor: string;
    skillLevel: string;
    skillLevelColor: string;
    seatsRemaining: number;
  };
}

export function RegistrationModal({ isOpen, onClose, session }: RegistrationModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    notes: "",
    joinWaitlist: false,
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  if (!isOpen) return null;

  const validateStep1 = () => {
    const newErrors = {
      fullName: "",
      email: "",
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return !newErrors.fullName && !newErrors.email;
  };

  const handleContinue = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleCompleteRegistration = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");

    const result = await createReservation({
      session: session.id,
      name: formData.fullName,
      email: formData.email,
      notes: formData.notes || undefined,
    });

    setSubmitting(false);

    if (result.ok) {
      setStep(3);
    } else if (result.errors) {
      setSubmitError(Object.values(result.errors)[0] ?? "Please check your details.");
      setStep(1);
    } else {
      // 409 = full or already reserved.
      setSubmitError(result.error ?? "Something went wrong. Please try again.");
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      fullName: "",
      email: "",
      notes: "",
      joinWaitlist: false,
    });
    setErrors({
      fullName: "",
      email: "",
    });
    setSubmitError("");
    setSubmitting(false);
    onClose();
  };

  const getSeatsIndicator = () => {
    if (session.seatsRemaining === 0) {
      return {
        text: "Session full — join waitlist",
        color: "#EF4444",
        showWaitlist: true,
      };
    } else if (session.seatsRemaining <= 5) {
      return {
        text: `${session.seatsRemaining} seats remaining`,
        color: "#F59E0B",
        showWaitlist: false,
      };
    } else {
      return {
        text: `${session.seatsRemaining} seats remaining`,
        color: "#10B981",
        showWaitlist: false,
      };
    }
  };

  const seatsIndicator = getSeatsIndicator();

  return (
    <div
      className={styles.registrationModal}
      onClick={handleClose}
    >
      <div
        className={styles.container}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className={styles.closeBtn}
        >
          <X className="icon icon--md" />
        </button>

        {/* Progress Indicator */}
        <div className={styles.progress}>
          <div className={styles.progressSteps}>
            {/* Step 1 */}
            <div className={styles.progressStep}>
              <div
                className={step >= 1 ? styles.progressDotActive : styles.progressDotInactive}
              />
              <span
                className={step === 1 ? styles.progressLabelActive : styles.progressLabelInactive}
              >
                Your details
              </span>
            </div>

            {/* Connector Line */}
            <div
              className={step >= 2 ? styles.progressConnectorActive : styles.progressConnectorInactive}
            />

            {/* Step 2 */}
            <div className={styles.progressStep}>
              <div
                className={step >= 2 ? styles.progressDotActive : styles.progressDotInactive}
              />
              <span
                className={step === 2 ? styles.progressLabelActive : styles.progressLabelInactive}
              >
                Confirm session
              </span>
            </div>

            {/* Connector Line */}
            <div
              className={step >= 3 ? styles.progressConnectorActive : styles.progressConnectorInactive}
            />

            {/* Step 3 */}
            <div className={styles.progressStep}>
              <div
                className={step >= 3 ? styles.progressDotActive : styles.progressDotInactive}
              />
              <span
                className={step === 3 ? styles.progressLabelActive : styles.progressLabelInactive}
              >
                Done
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Your Details */}
        {step === 1 && (
          <div>
            <h2 className={styles.formTitle}>Your details</h2>

            <div className={styles.form}>
              <div>
                <label className={styles.label}>
                  Full name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: "" });
                  }}
                  className={`${styles.input}${errors.fullName ? ` ${styles.inputError}` : ""}`}
                />
                {errors.fullName && (
                  <p className={styles.error}>
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className={styles.label}>
                  Email address <span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  className={`${styles.input}${errors.email ? ` ${styles.inputError}` : ""}`}
                />
                {errors.email && (
                  <p className={styles.error}>
                    {errors.email}
                  </p>
                )}
                <p className={styles.hint}>
                  We&apos;ll send your confirmation here. No account needed.
                </p>
              </div>

              <div>
                <label className={styles.label}>Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any accessibility requirements or questions?"
                  rows={3}
                  className={styles.textarea}
                />
              </div>
            </div>

            <button
              onClick={handleContinue}
              className={`${styles.btnPrimary} ${styles.btnPrimaryWithMargin}`}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Confirm Session */}
        {step === 2 && (
          <div>
            <h2 className={styles.formTitle}>Confirm your session</h2>

            {/* Session Summary */}
            <div className={styles.sessionCard}>
              <h3 className={styles.sessionTitle}>{session.title}</h3>

              <div className={styles.speakerRow}>
                <div className={styles.speakerAvatar}>
                  <Avatar src={session.speaker.avatar} name={session.speaker.name} />
                </div>
                <span className={styles.speakerName}>{session.speaker.name}</span>
              </div>

              <div className={styles.sessionDetails}>
                <p className={styles.sessionDatetime}>
                  {session.date} · {session.startTime}–{session.endTime}
                </p>
                <p className={styles.sessionRoom}>{session.room}</p>
              </div>

              <div className={styles.badges}>
                <Badge color={session.trackColor}>{session.track}</Badge>
                <Badge color={session.skillLevelColor}>{session.skillLevel}</Badge>
              </div>
            </div>

            {/* Seats Remaining */}
            <div className={styles.seats}>
              <div className={styles.seatsRow}>
                <div
                  className={styles.seatsDot}
                  style={{ backgroundColor: seatsIndicator.color }}
                />
                <span
                  className={styles.seatsText}
                  style={{ color: seatsIndicator.color }}
                >
                  {seatsIndicator.text}
                </span>
              </div>
              {seatsIndicator.showWaitlist && (
                <label className={styles.waitlistLabel}>
                  <input
                    type="checkbox"
                    checked={formData.joinWaitlist}
                    onChange={(e) =>
                      setFormData({ ...formData, joinWaitlist: e.target.checked })
                    }
                    className={styles.waitlistCheckbox}
                  />
                  <span>Add me to the waitlist</span>
                </label>
              )}
            </div>

            {/* Registering As */}
            <div className={styles.registrantCard}>
              <div className={styles.registrantRow}>
                <div>
                  <p className={styles.registrantLabel}>
                    Registering as
                  </p>
                  <p className={styles.registrantName}>{formData.fullName}</p>
                  <p className={styles.registrantEmail}>{formData.email}</p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className={styles.editBtn}
                >
                  Edit
                </button>
              </div>
            </div>

            {submitError && (
              <p className={styles.error} role="alert">
                {submitError}
              </p>
            )}

            <button
              onClick={handleCompleteRegistration}
              disabled={submitting}
              className={`${styles.btnPrimary} ${styles.btnPrimaryNoMargin}`}
            >
              {submitting ? "Registering…" : "Complete registration"}
            </button>

            <button
              onClick={() => setStep(1)}
              className={styles.btnSecondary}
            >
              ← Back
            </button>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className={styles.confirmation}>
            <div className={styles.successIcon}>
              <Check className="icon icon--xl icon--white" strokeWidth={3} />
            </div>

            <h2 className={styles.confirmationTitle}>You&apos;re registered!</h2>
            <p className={styles.confirmationText}>
              A confirmation email is on its way to <strong>{formData.email}</strong>. It contains
              a link to view and manage your registration.
            </p>

            {/* Compact Session Summary */}
            <div className={styles.confirmationSummary}>
              <p className={styles.summaryTitle}>{session.title}</p>
              <p className={styles.summaryDetail}>
                {session.date} · {session.startTime}–{session.endTime}
              </p>
              <p className={styles.summaryDetail}>
                {session.room}
              </p>
            </div>

            <button
              onClick={handleClose}
              className={`${styles.btnPrimary} ${styles.btnPrimaryNoMargin}`}
            >
              Close
            </button>

            <Link
              href="/check-my-reservations"
              onClick={handleClose}
              className={styles.reservationsLink}
            >
              Check my other reservations →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
