export const publicNav = [
  { href: "/", label: "Inicio", sectionId: "hero" },
  { href: "/proyectos", label: "Proyectos", sectionId: "proyectos" },
  { href: "/experiencia", label: "Experiencia", sectionId: "experiencia" },
  { href: "/educacion", label: "Educación", sectionId: "educacion" },
  { href: "/certificados", label: "Certificados", sectionId: "certificados" },
  { href: "/cv", label: "CV", sectionId: undefined },
] as const;

export const homeScrollSections = [
  "hero",
  "sobre-mi",
  "skills",
  "experiencia",
  "educacion",
  "proyectos",
  "certificados",
  "cta",
] as const;
