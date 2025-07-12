export interface SocialMedia {
  label: string;
  link: string;
}

export interface ContactInfo {
  contact_phone: string;
  contact_email: string;
}

export interface SiteInformation {
  header: ContactInfo;
  footer: ContactInfo;
  social_media: SocialMedia[];
} 