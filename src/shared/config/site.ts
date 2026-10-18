export interface SiteDetails {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly domain: string;
  readonly openGraphImage: string;
  readonly locale: string;
  readonly jobTitle: string;
}

export interface EmailAddresses {
  readonly general: string;
  readonly legal: string;
  readonly security: string;
  readonly privacy: string;
}

export interface SocialMediaLinks {
  readonly github: string;
  readonly linkedin: string;
  readonly x: string;
  readonly youtube: string;
  readonly instagram: string;
}

export const site: SiteDetails = {
  name: 'Pabitra Mohan Singh',
  title: 'Pabitra Mohan Singh – Software Engineer',
  description: 'Building clean, scalable, and user-focused applications',
  domain: 'https://pabitramohansingh.com',
  openGraphImage: 'https://pabitramohansingh.com/profile/pabitra-banner.png',
  locale: 'en_US',
  jobTitle: 'Software Engineer',
} as const;

export const email: EmailAddresses = {
  general: 'contactpabitrams@gmail.com',
  legal: 'legal@thepabitrams.com',
  security: 'security@thepabitrams.com',
  privacy: 'support@pabitramohansingh.com',
} as const;

export const social: SocialMediaLinks = {
  github: 'https://github.com/thepabitrams',
  linkedin: 'https://www.linkedin.com/in/pabitramohansingh',
  x: 'https://x.com/thepabitrams',
  youtube: 'https://youtube.com/@thepabitrams',
  instagram: 'https://www.instagram.com/thepabitrams',
} as const;