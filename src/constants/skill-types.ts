export const skillTypes = [
  "language",
  "framework",
  "tool",
  "soft",
  "other",
] as const;

export type SkillType = (typeof skillTypes)[number];
