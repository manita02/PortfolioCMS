export const socialLinkTypes = [
  "professional",
  "social",
  "contact",
  "other",
] as const;

export type SocialLinkType = (typeof socialLinkTypes)[number];
