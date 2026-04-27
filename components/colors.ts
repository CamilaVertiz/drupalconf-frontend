// Keys are the values Drupal emits. Tracks are editor-managed taxonomy terms,
// so the resolvers fall back rather than hand `undefined` to a style attribute.

const FALLBACK_COLOR = 'var(--medium-grey)';

export const trackColors: Record<string, string> = {
  Frontend: 'var(--track-frontend)',
  'Front End & Theming': 'var(--track-frontend)',
  Backend: 'var(--track-backend)',
  'Back End Development': 'var(--track-backend)',
  DevOps: 'var(--track-devops)',
  'DevOps & Hosting': 'var(--track-devops)',
  UX: 'var(--track-ux)',
  'Site Building': 'var(--track-ux)',
  'Community & Strategy': 'var(--track-backend)',
  'Performance & Security': 'var(--track-devops)',
};

export const skillLevelColors: Record<string, string> = {
  Beginner: 'var(--skill-beginner)',
  Intermediate: 'var(--skill-intermediate)',
  Advanced: 'var(--skill-advanced)',
};

export const sessionTypeColors: Record<string, string> = {
  Keynote: 'var(--badge-keynote)',
  Talk: 'var(--badge-talk)',
  Workshop: 'var(--badge-workshop)',
  Panel: 'var(--badge-panel)',
  Lightning: 'var(--badge-lightning)',
};

// `conference_status` emits machine values; these map them to what users see.

export const conferenceStatusColors: Record<string, string> = {
  active: '#10B981',
  upcoming: 'var(--electric-blue)',
  past: 'var(--medium-grey)',
};

export const conferenceStatusLabels: Record<string, string> = {
  active: 'Registration Open',
  upcoming: 'Coming Soon',
  past: 'Past',
};

export function trackColor(track: string): string {
  return trackColors[track] ?? FALLBACK_COLOR;
}

export function skillLevelColor(skillLevel: string): string {
  return skillLevelColors[skillLevel] ?? FALLBACK_COLOR;
}

export function sessionTypeColor(type: string): string {
  return sessionTypeColors[type] ?? FALLBACK_COLOR;
}

export function conferenceStatusColor(status: string): string {
  return conferenceStatusColors[status] ?? 'var(--electric-blue)';
}

/** Falls back to the raw value so an unmapped status still reads sensibly. */
export function conferenceStatusLabel(status: string): string {
  return conferenceStatusLabels[status] ?? status;
}
