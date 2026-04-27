import { notFound } from 'next/navigation';
import { resolveByPath } from '@/lib/drupal/resolve';
import type { ResolvedEntity } from '@/lib/drupal/types';
import PageTemplate from '@/components/templates/Page';

export default async function HomePage() {
  const entity: ResolvedEntity | null = await resolveByPath('/home');
  if (!entity || entity.type === 'unknown') notFound();

  const e = entity as ResolvedEntity;
  if (e.type === 'node--basic_page' || e.type === 'node--blog') {
    return <PageTemplate data={e.data} />;
  }

  notFound();
}
