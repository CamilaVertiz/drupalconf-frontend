import { BASE_URL } from './client';

export async function submitContact({
  subject,
  copy,
  website,
}: {
  subject: string;
  copy: string;
  website?: string;
}): Promise<{ ok: boolean; errors?: Record<string, string>; message?: string }> {
  const url = `${BASE_URL}/api/forms/contact/submit`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject, copy, website }),
  });

  if (res.ok) {
    return { ok: true };
  }

  if (res.status === 422) {
    const data = await res.json();
    return { ok: false, errors: data.errors ?? {} };
  }

  return { ok: false, message: 'Something went wrong. Please try again.' };
}
