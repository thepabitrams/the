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
  title: 'Pabitra Mohan Singh – MS Computer Science Student',
  description:
    'MS Computer Science Student passionate about software engineering and AI.',
  domain: 'https://pabitramohansingh.com',
  defaultOgImage: 'https://pabitramohansingh.com/og-image.png',
  locale: 'en_US',
  jobTitle: 'MS Computer Science Student',
  email: 'contactpabitrams@gmail.com',
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com/thepabitrams' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/pabitramohansingh' },
    { platform: 'X (Twitter)', url: 'https://x.com/thepabitrams' },
    { platform: 'YouTube', url: 'https://youtube.com/@thepabitrams' },
    { platform: 'Instagram', url: 'https://www.instagram.com/thepabitrams' },
  ],
} as const;