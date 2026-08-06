/**
 * UUIDs fijos de catálogos (coinciden con seed / migraciones).
 * Usar para lógica de máquina; los nombres visibles vienen de la BD.
 */
export const educationTypeIds = {
  career: "a4444444-4444-4444-4444-444444444001",
} as const;

export const skillTypeIds = {
  language: "a5555555-5555-5555-5555-555555555001",
  framework: "a5555555-5555-5555-5555-555555555002",
  database: "a5555555-5555-5555-5555-555555555006",
  tool: "a5555555-5555-5555-5555-555555555003",
  cloud: "a5555555-5555-5555-5555-555555555008",
  methodology: "a5555555-5555-5555-5555-555555555007",
  soft: "a5555555-5555-5555-5555-555555555004",
  spokenLanguage: "a5555555-5555-5555-5555-555555555009",
  other: "a5555555-5555-5555-5555-555555555005",
} as const;
