export interface CatalogItem {
  id: string;
  name: string;
  sortOrder: number;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  profileImagePath: string | null;
  bannerImagePath: string | null;
  availabilityStatusId: string;
  availabilityStatusName: string;
  professionalTitle: string;
  subtitle: string;
  about: string;
  metaTitle: string | null;
  metaDescription: string | null;
}

export interface Organization {
  id: string;
  name: string;
  typeId: string;
  typeName: string;
  websiteUrl: string | null;
  logoPath: string | null;
  location: string | null;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  typeId: string;
  typeName: string;
  typeSortOrder: number;
  iconPath: string | null;
  sortOrder: number;
  label: string;
}

export interface Experience {
  id: string;
  organizationId: string;
  organization?: Organization;
  typeId: string;
  typeName: string;
  modalityId: string;
  modalityName: string;
  startMonth: number;
  startYear: number;
  endMonth: number | null;
  endYear: number | null;
  isCurrent: boolean;
  title: string;
  description: string;
  skills: Skill[];
}

export interface Education {
  id: string;
  organizationId: string;
  organization?: Organization;
  typeId: string;
  typeName: string;
  startMonth: number;
  startYear: number;
  endMonth: number | null;
  endYear: number | null;
  isCurrent: boolean;
  diplomaImagePath: string | null;
  diplomaPdfPath: string | null;
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
  typeId: string;
  typeName: string;
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
