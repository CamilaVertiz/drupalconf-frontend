import { notFound } from 'next/navigation';
import { resolveByPath, listSpeakersByConference } from '@/lib/drupal/resolve';
import type { ResolvedEntity, Conference } from '@/lib/drupal/types';
import Speakers from '@/components/templates/Speakers';
import type { Speaker as SpeakerViewModel } from '@/types';

export default async function SpeakersPage({
  params,
}: {
  params: Promise<{ conferenceAlias: string }>;
}) {
  const { conferenceAlias } = await params;

  const entity: ResolvedEntity | null = await resolveByPath(
    `/conferences/${conferenceAlias}`,
  );
  if (!entity || entity.type !== 'node--conference') notFound();

  const conf = entity as { type: 'node--conference'; data: Conference };
  const speakers = await listSpeakersByConference(conf.data.id);

  const speakerViewModels: SpeakerViewModel[] = speakers.map((s) => ({
    id: s.id,
    conferenceId: conferenceAlias,
    name: s.name,
    avatar: s.avatar,
    title: s.title,
    company: s.company,
    featured: s.featured,
    pathAlias: s.pathAlias,
  }));

  return (
    <Speakers
      speakers={{
        speakers: speakerViewModels,
        heading: `${conf.data.title} Speakers`,
        subtitle: 'Meet the experts sharing their knowledge',
      }}
    />
  );
}
