import {
  ReactBadge,
  TypeScriptBadge,
  TailwindBadge,
  ViteBadge,
} from './badges';

const BADGE_MAP: Record<string, any> = {
  react: ReactBadge,
  typescript: TypeScriptBadge,
  tailwindcss: TailwindBadge,
  vite: ViteBadge,
};

export interface ResolvedBadge {
  type: 'badge' | 'fallback';
  Component?: any;
  label: string;
  version?: string;
}

function parseTag(tag: string): { key: string; version?: string } {
  const match = tag.match(/^(.*?)\s+([\d.]+[Xx]?[\d.]*)$/);
  if (match) return { key: match[1], version: match[2] };
  return { key: tag };
}

export function resolveBadges(techStack: string[]): ResolvedBadge[] {
  return techStack.map((tag) => {
    const { key, version } = parseTag(tag);
    const normalized = key.toLowerCase().replace(/\s+/g, '');
    const Component = BADGE_MAP[normalized];

    if (Component) {
      return { type: 'badge', Component, label: key, version };
    }

    return { type: 'fallback', label: key, version };
  });
}