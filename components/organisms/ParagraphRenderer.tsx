import HeroParagraph from '@/components/molecules/paragraphs/HeroParagraph';
import CopyParagraph from '@/components/molecules/paragraphs/CopyParagraph';
import ListingParagraph from '@/components/molecules/paragraphs/ListingParagraph';
import ContactFormParagraph from '@/components/molecules/paragraphs/ContactFormParagraph';
import type { Paragraph } from '@/lib/drupal/types';

/**
 * A switch, not a lookup map: each renderer takes only its own variant, so a
 * `Record<string, ComponentType<Paragraph>>` needs an `any` to typecheck.
 */
export default function ParagraphRenderer({
  paragraphs,
}: {
  paragraphs: Paragraph[];
}) {
  return (
    <>
      {paragraphs.map((p) => {
        switch (p.type) {
          case 'paragraph--hero':
            return <HeroParagraph key={p.id} {...p} />;
          case 'paragraph--copy':
            return <CopyParagraph key={p.id} {...p} />;
          case 'paragraph--listing':
            return <ListingParagraph key={p.id} {...p} />;
          case 'paragraph--contact_form':
            return <ContactFormParagraph key={p.id} {...p} />;
          default:
            return null;
        }
      })}
    </>
  );
}
