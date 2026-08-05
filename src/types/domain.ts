import type { AvailabilityStatus } from "@/constants/availability";
import type { EducationType } from "@/constants/education-types";
import type { ExperienceType } from "@/constants/experience-types";
import type { OrganizationType } from "@/constants/organization-types";
import type { SkillType } from "@/constants/skill-types";
import type { SocialLinkType } from "@/constants/social-link-types";

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  profileImagePath: string | null;
  bannerImagePath: string | null;
  cvPdfPath: string | null;
  availabilityStatus: AvailabilityStatus;
  professionalTitle: string;
  subtitle: string;
  about: string;
  metaTitle: string | null;
  metaDescription: string | null;
}

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  websiteUrl: string | null;
  logoPath: string | null;
  location: string | null;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  type: SkillType;
  iconPath: string | null;
  sortOrder: number;
  label: string;
}

export interface Experience {
  id: string;
  organizationId: string;
  organization?: Organization;
  type: ExperienceType;
  startMonth: number;
  startYear: number;
  endMonth: number | null;
  endYear: number | null;
  isCurrent: boolean;
  sortOrder: number;
  title: string;
  description: string;
  skills: Skill[];
}

export interface Education {
  id: string;
  organizationId: string;
  organization?: Organization;
  type: EducationType;
  startMonth: number;
  startYear: number;
  endMonth: number | null;
  endYear: number | null;
  isCurrent: boolean;
  institutionImagePath: string | null;
  diplomaImagePath: string | null;
  diplomaPdfPath: string | null;
  sortOrder: number;
  title: string;
  description: string;
  skills: Skill[];
}

export interface Project {
  id: string;
  organizationId: string | null;
  organization?: Organization | null;
  slug: string;
  startMonth: number | null;
  startYear: number | null;
  endMonth: number | null;
  endYear: number | null;
  imagePath: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  isFeatured: boolean;
  sortOrder: number;
  name: string;
  description: string;
  summary: string;
  skills: Skill[];
}

export interface Certificate {
  id: string;
  organizationId: string;
  organization?: Organization;
  issuedMonth: number;
  issuedYear: number;
  imagePath: string | null;
  pdfPath: string | null;
  credentialUrl: string | null;
  isFeatured: boolean;
  sortOrder: number;
  name: string;
  description: string;
}

export interface SocialLink {
  id: string;
  name: string;
  type: SocialLinkType;
  iconKey: string;
  url: string;
  sortOrder: number;
  isVisible: boolean;
}

export interface CvData {
  person: Person | null;
  experiences: Experience[];
  educations: Education[];
  projects: Project[];
  skills: Skill[];
  certificates: Certificate[];
  socialLinks: SocialLink[];
}
