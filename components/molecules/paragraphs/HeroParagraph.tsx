import { HeroSection } from '@/components/molecules/HeroSection';
import type { ParagraphHero } from '@/lib/drupal/types';

export default function HeroParagraph(props: ParagraphHero) {
  return (
    <HeroSection
      data={{
        badge: props.eyebrow ?? undefined,
        title: props.title ?? '',
        // Rich text from the (trusted) backend, rendered as HTML by HeroSection.
        description: props.copy ?? '',
        ctaLink: props.link?.uri ?? undefined,
        ctaText: props.link?.title ?? undefined,
      }}
    />
  );
}
