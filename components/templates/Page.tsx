import ParagraphRenderer from '@/components/organisms/ParagraphRenderer';
import type { Page as PageData } from '@/lib/drupal/types';

interface PageProps {
  data: PageData;
}

export default function Page({ data }: PageProps) {
  return (
    <article>
      <ParagraphRenderer paragraphs={data.paragraphs} />
    </article>
  );
}
