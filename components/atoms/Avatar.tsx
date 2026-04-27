/**
 * Renders only the *inside* of an avatar box; the caller keeps the sizing and
 * shape on the wrapping element.
 */
interface AvatarProps {
  src?: string | null;
  /** Doubles as the alt text and the source of the initials fallback. */
  name: string;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({ src, name }: AvatarProps) {
  if (src) {
    // Fixed-size and already cropped, so next/image buys little here.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className="avatar__image" />;
  }
  return <>{getInitials(name)}</>;
}
