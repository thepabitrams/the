import {
  ReactBadge,
  TypeScriptBadge,
  TailwindBadge,
  ViteBadge,
  CloudflareBadge,
  HonoBadge,
  DrizzleBadge,
  BetterAuthBadge,
  FallbackBadge,
} from './badges';

const BADGE_MAP: Record<string, any> = {
  react: ReactBadge,
  typescript: TypeScriptBadge,
  tailwindcss: TailwindBadge,
  vite: ViteBadge,
  cloudflareworkers: CloudflareBadge,
  hono: HonoBadge,
  drizzleorm: DrizzleBadge,
  betterauth: BetterAuthBadge,
};

export interface ResolvedBadge {
  Component: any;
  props: {
    label?: string;
    version?: string;
  };
}

function parseTag(tag: string): { key: string; version?: string } {
  const match = tag.match(/^(.*?)\s+([\d.]+[Xx]?[\d.]*)$/);
  if (match) return { key: match[1], version: match[2] };
  return { key: tag };
}

export function resolveBadges(techStack: string[]): ResolvedBadge[] {
  return techStack.map((tag) => {
    const { key, version } = parseTag(tag);
    const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
    const Component = BADGE_MAP[normalizedKey];

    if (Component) {
      return { Component, props: { version } };
    }

    return { Component: FallbackBadge, props: { label: key, version } };
  });
}