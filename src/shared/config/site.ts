export interface SocialMediaLink {
  readonly platformName: string;
  readonly profileUrl: string;
}

export interface SiteConfiguration {
  readonly siteName: string;
  readonly siteTitle: string;
  readonly siteDescription: string;
  readonly siteDomain: string;
  readonly defaultOpenGraphImageUrl: string;
  readonly siteLocale: string;
  readonly professionalJobTitle: string;
  readonly contactEmailAddresses: {
    readonly generalInquiryEmailAddress: string;
    readonly legalInquiryEmailAddress: string;
    readonly securityInquiryEmailAddress: string;
    readonly privacyInquiryEmailAddress: string;
  };
  readonly socialMediaLinks: readonly SocialMediaLink[];
}

export const SITE_CONFIGURATION: SiteConfiguration = {
  siteName: 'Pabitra Mohan Singh',
  siteTitle: 'Pabitra Mohan Singh – Software Engineer',
  siteDescription: 'Building clean, scalable, and user-focused applications',
  siteDomain: 'https://pabitramohansingh.com',
  defaultOpenGraphImageUrl: 'https://pabitramohansingh.com/profile/pabitra-banner.png',
  siteLocale: 'en_US',
  professionalJobTitle: 'Software Engineer',
  contactEmailAddresses: {
    generalInquiryEmailAddress: 'contactpabitrams@gmail.com',
    legalInquiryEmailAddress: 'legal@thepabitrams.com',
    securityInquiryEmailAddress: 'security@thepabitrams.com',
    privacyInquiryEmailAddress: 'support@pabitramohansingh.com',
  },
  socialMediaLinks: [
    { platformName: 'GitHub', profileUrl: 'https://github.com/thepabitrams' },
    { platformName: 'LinkedIn', profileUrl: 'https://www.linkedin.com/in/pabitramohansingh' },
    { platformName: 'X', profileUrl: 'https://x.com/thepabitrams' },
    { platformName: 'YouTube', profileUrl: 'https://youtube.com/@thepabitrams' },
    { platformName: 'Instagram', profileUrl: 'https://www.instagram.com/thepabitrams' },
  ],
} as const;