export interface SocialLink {
  readonly platform: string;
  readonly url: string;
}

export interface SiteConfig {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly domain: string;
  readonly defaultOgImage: string;
  readonly locale: string;
  readonly jobTitle: string;
  readonly email: string;
  readonly socialLinks: readonly SocialLink[];
}

export const SITE_CONFIG: SiteConfig = {
  name: 'Pabitra Mohan Singh',
  title: 'Pabitra Mohan Singh – Software Engineer',
  description:
    'Building clean, scalable, and user-focused applications',
  domain: 'https://pabitramohansingh.com',
  defaultOgImage: '/profile/pabitra-banner.png',
  locale: 'en_US',
  jobTitle: 'Software Engineer',
  email: 'contactpabitrams@gmail.com',
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com/thepabitrams' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/pabitramohansingh' },
    { platform: 'X', url: 'https://x.com/thepabitrams' },
    { platform: 'YouTube', url: 'https://youtube.com/@thepabitrams' },
    { platform: 'Instagram', url: 'https://www.instagram.com/thepabitrams' },
  ],
} as const;