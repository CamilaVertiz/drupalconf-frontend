"use client";

import { useState } from "react";
import CheckReservations from "@/components/templates/CheckReservations";
import { lookupReservations } from "@/lib/drupal/reservations";

type ResultState = "initial" | "no-results" | "emailed" | "error";

export default function CheckMyReservationsPage() {
  const [email, setEmail] = useState("");
  const [resultState, setResultState] = useState<ResultState>("initial");
  const [message, setMessage] = useState<string>("");
  const [pending, setPending] = useState(false);

  const handleFindSessions = async () => {
    if (pending || !email.includes("@")) return;
    setPending(true);
    try {
      const result = await lookupReservations(email);
      if (result.found) {
        setResultState("emailed");
        setMessage(
          result.message ??
            "We have emailed your reservation details to that address.",
        );
      } else {
        setResultState("no-results");
        setMessage("");
      }
    } catch {
      setResultState("error");
      setMessage("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <CheckReservations
      data={{
        heading: "Check my reservations",
        subtitle:
          "Enter the email address you used when registering. For your privacy, we email your reservation details rather than showing them here.",
        helperText:
          "If reservations exist for that email, we send the details to the inbox — so only its owner can read them.",
        email,
        onEmailChange: setEmail,
        onSearch: handleFindSessions,
        resultState,
        reservations: [],
        message,
      }}
    />
  );
}
