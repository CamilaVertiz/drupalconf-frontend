// The lookup endpoint never returns reservation details — only whether any
// exist. The backend emails them instead, so only the inbox owner can read them.

import { BASE_URL } from './client';

export interface CreateReservationInput {
  /** Session UUID. */
  session: string;
  name: string;
  email: string;
  notes?: string;
  /** Honeypot — leave empty; bots fill it. */
  website?: string;
}

export interface CreateReservationResult {
  ok: boolean;
  /** HTTP status, useful to distinguish 409 (full / duplicate) from 422. */
  status: number;
  error?: string;
  errors?: Record<string, string>;
}

export interface LookupResult {
  found: boolean;
  message?: string;
}

/** Returns the body whatever the status, so callers can surface field errors. */
async function postJson<T>(
  path: string,
  body: unknown,
): Promise<{ status: number; ok: boolean; data: T }> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as T;
  return { status: res.status, ok: res.ok, data };
}

export async function createReservation(
  input: CreateReservationInput,
): Promise<CreateReservationResult> {
  const { status, data } = await postJson<{
    ok?: boolean;
    error?: string;
    errors?: Record<string, string>;
  }>('/api/reservations', input);

  return {
    ok: data.ok === true,
    status,
    error: data.error,
    errors: data.errors,
  };
}

/**
 * Throws on failure so callers can tell "none exist" from "we could not check".
 * Rendering those the same tells people they have no reservations during an outage.
 */
export async function lookupReservations(email: string): Promise<LookupResult> {
  const { ok, status, data } = await postJson<{ found?: boolean; message?: string }>(
    '/api/reservations/lookup',
    { email },
  );

  // 422 is a real validation response; any other non-2xx means it never ran.
  if (!ok && status !== 422) {
    throw new Error(`Reservation lookup failed: ${status}`);
  }

  return { found: data.found === true, message: data.message };
}
