import { HeroSection } from "@/components/molecules/HeroSection";
import { FeaturedSessions } from "@/components/molecules/FeaturedSessions";
import { SponsorsSection } from "@/components/molecules/SponsorsSection";
import { listSessionsByConference } from "@/lib/drupal/resolve";
import type { Conference as ConferenceType } from '@/lib/drupal/types';
import type { ScheduleSession, SessionType, SkillLevel, Track, SponsorTierGroup, SponsorTier } from "@/types";

interface ConferenceProps {
  data: ConferenceType;
}


function formatDateRange(dateStart: string, dateEnd: string): string {
  try {
    const start = new Date(dateStart);
    const end = new Date(dateEnd);
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`;
  } catch {
    return `${dateStart} - ${dateEnd}`;
  }
}


function extractTime(isoString: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  } catch {
    return isoString;
  }
}

function computeDuration(startTime: string, endTime: string): number {
  try {
    const diff = (new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000;
    return Math.max(1, Math.round(diff / 30));
  } catch {
    return 2;
  }
}

export default async function Conference({ data }: ConferenceProps) {
  const location = data.venue
    ? `${data.venue.city}, ${data.venue.country}`
    : "";
  const dates =
    data.date_start && data.date_end
      ? formatDateRange(data.date_start, data.date_end)
      : "";
  const attendees = data.max_attendees
    ? `${data.max_attendees.toLocaleString()}+ Attendees`
    : undefined;

  const heroSection = {
    badge: data.tagline || undefined,
    title: data.title,
    location,
    dates,
    attendees,
    description: data.body
      ? data.body.replace(/<[^>]*>/g, "").trim()
      : "",
    ctaLink: `/conferences/${data.pathAlias}/schedule`,
    ctaText: "View Schedule",
    backgroundImage: data.heroImage,
  };

  const tierMap = new Map<string, string[]>();
  for (const sponsor of data.sponsors) {
    const tier = sponsor.tier as SponsorTier;
    if (!tierMap.has(tier)) {
      tierMap.set(tier, []);
    }
    tierMap.get(tier)!.push(sponsor.title);
  }

  const tierOrder: SponsorTier[] = ["platinum", "gold", "silver"];
  const tierLabels: Record<string, string> = {
    platinum: "Platinum Sponsors",
    gold: "Gold Sponsors",
    silver: "Silver Sponsors",
    community: "Community Sponsors",
  };

  const tiers: SponsorTierGroup[] = tierOrder
    .filter((tier) => tierMap.has(tier))
    .map((name) => ({
      name,
      label: tierLabels[name] ?? `${name} Sponsors`,
      sponsors: tierMap.get(name) ?? [],
    }));

  for (const [tier, sponsors] of tierMap.entries()) {
    if (!tierOrder.includes(tier as SponsorTier)) {
      tiers.push({
        name: tier as SponsorTier,
        label:
          tierLabels[tier] ??
          `${tier.charAt(0).toUpperCase() + tier.slice(1)} Sponsors`,
        sponsors,
      });
    }
  }

  const sponsorsSection = {
    heading: "Our Sponsors",
    subtitle: "Thank you to our partners who make DrupalConf possible",
    tiers,
  };

  const sessions = await listSessionsByConference(data.id);
  const featured: ScheduleSession[] = sessions.slice(0, 3).map((s) => ({
    id: s.id,
    conferenceId: data.pathAlias,
    title: s.title,
    speaker: s.speakers[0]?.name || "TBD",
    type: s.type as SessionType,
    skillLevel: s.skillLevel as SkillLevel,
    track: s.track as Track,
    room: s.room,
    startTime: extractTime(s.startTime),
    duration: computeDuration(s.startTime, s.endTime),
    pathAlias: s.pathAlias,
    url: s.url,
  }));

  const featuredSessions = {
    sessions: featured,
    heading: "Featured Sessions",
    subtitle: "Don't miss these highlighted talks from industry leaders",
    viewAllLink: `/conferences/${data.pathAlias}/schedule`,
    viewAllText: "View All Sessions",
  };

  return (
    <div className="conference">
      <HeroSection data={heroSection} />
      <FeaturedSessions data={featuredSessions} />
      <SponsorsSection data={sponsorsSection} />
    </div>
  );
}
