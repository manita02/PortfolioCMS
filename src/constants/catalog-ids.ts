/**
 * UUIDs fijos de catálogos (coinciden con seed / migraciones).
 * Usar para lógica de máquina; los nombres visibles vienen de la BD.
 */
export const educationTypeIds = {
  career: "a4444444-4444-4444-4444-444444444001",
  certificationProgram: "a4444444-4444-4444-4444-444444444004",
} as const;

export const skillTypeIds = {
  backendLanguages: "a5555555-5555-5555-5555-555555555010",
  frontend: "a5555555-5555-5555-5555-555555555011",
  toolsPractices: "a5555555-5555-5555-5555-555555555012",
  database: "a5555555-5555-5555-5555-555555555006",
  cloud: "a5555555-5555-5555-5555-555555555008",
  hidden: "a5555555-5555-5555-5555-555555555013",
} as const;
