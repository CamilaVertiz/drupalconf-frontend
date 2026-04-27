import { notFound } from 'next/navigation';
import { resolveByPath } from '@/lib/drupal/resolve';
import type { ResolvedEntity } from '@/lib/drupal/types';
import PageTemplate from '@/components/templates/Page';
import Conference from '@/components/templates/Conference';
import SessionDetailClient from './SessionDetailClient';
import SpeakerDetail from '@/components/templates/SpeakerDetail';
import Sponsor from '@/components/templates/Sponsor';

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = '/' + slug.join('/');

  const entity: ResolvedEntity | null = await resolveByPath(path);
  if (!entity || entity.type === 'unknown') notFound();

  const e = entity as ResolvedEntity;

  switch (e.type) {
    case 'node--basic_page':
    case 'node--blog':
      return <PageTemplate data={e.data} />;

    case 'node--conference':
      return <Conference data={e.data} />;

    case 'node--session':
      return <SessionDetailClient data={e.data} />;

    case 'node--speaker':
      return <SpeakerDetail data={e.data} />;

    case 'node--sponsor':
      return <Sponsor data={e.data} />;

    default:
      notFound();
  }
}
