'use client';

import { useState } from 'react';
import type { ParagraphContactForm } from '@/lib/drupal/types';
import { submitContact } from '@/lib/drupal/contact';
import styles from './ContactFormParagraph.module.scss';

export default function ContactFormParagraph(props: ParagraphContactForm) {
  const [subject, setSubject] = useState('');
  const [copy, setCopy] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [genericError, setGenericError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setFieldErrors({});
    setGenericError('');

    try {
      const result = await submitContact({ subject, copy, website });

      if (result.ok) {
        setStatus('success');
        setSubject('');
        setCopy('');
      } else if (result.errors) {
        setFieldErrors(result.errors);
        setStatus('error');
      } else {
        setGenericError(result.message ?? 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setGenericError('Network error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <section className={styles.contactForm}>
      <div className={styles.container}>
        {props.title && <h2 className={styles.title}>{props.title}</h2>}
        {props.copy && (
          <div
            className={styles.intro}
            dangerouslySetInnerHTML={{ __html: props.copy }}
          />
        )}

        {status === 'success' ? (
          <div className={styles.successMessage}>
            Your message has been sent. Thank you!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fieldGroup}>
              <label htmlFor="contact-subject" className={styles.label}>
                Subject *
              </label>
              <input
                id="contact-subject"
                type="text"
                className={styles.input}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={255}
                required
              />
              {fieldErrors.subject && (
                <span className={styles.error}>{fieldErrors.subject}</span>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="contact-copy" className={styles.label}>
                Message *
              </label>
              <textarea
                id="contact-copy"
                className={styles.textarea}
                value={copy}
                onChange={(e) => setCopy(e.target.value)}
                maxLength={5000}
                required
              />
              {fieldErrors.copy && (
                <span className={styles.error}>{fieldErrors.copy}</span>
              )}
            </div>

            <div className={styles.honeypot} aria-hidden="true">
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {genericError && (
              <div className={styles.genericError}>{genericError}</div>
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
