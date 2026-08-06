export type DurationInput = {
  startMonth: number;
  startYear: number;
  endMonth?: number | null;
  endYear?: number | null;
  isCurrent?: boolean;
  /** Override for tests; defaults to local “now”. */
  now?: Date;
};

export type DurationParts = {
  years: number;
  months: number;
  totalMonths: number;
};

/**
 * Calcula duración en años/meses a partir de mes/año.
 * Cuenta los meses de forma inclusiva (ene–ago = 8 meses).
 * Si `isCurrent`, usa el mes actual como fin.
 */
export function calculateDuration(input: DurationInput): DurationParts {
  const now = input.now ?? new Date();
  const startTotal = input.startYear * 12 + input.startMonth;

  let endMonth: number;
  let endYear: number;

  if (input.isCurrent) {
    endMonth = now.getMonth() + 1;
    endYear = now.getFullYear();
  } else if (input.endMonth != null && input.endYear != null) {
    endMonth = input.endMonth;
    endYear = input.endYear;
  } else {
    return { years: 0, months: 0, totalMonths: 0 };
  }

  const endTotal = endYear * 12 + endMonth;
  const totalMonths = Math.max(0, endTotal - startTotal + 1);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return { years, months, totalMonths };
}

/** Alias semántico para experiencias (misma lógica reutilizable). */
export function calculateExperienceDuration(
  input: DurationInput,
): DurationParts {
  return calculateDuration(input);
}

/**
 * Formatea duración en español.
 * Nunca incluye “0 años” ni “0 meses”.
 * Devuelve cadena vacía si no hay duración.
 */
export function formatDuration(parts: DurationParts): string {
  const segments: string[] = [];

  if (parts.years > 0) {
    segments.push(parts.years === 1 ? "1 año" : `${parts.years} años`);
  }
  if (parts.months > 0) {
    segments.push(parts.months === 1 ? "1 mes" : `${parts.months} meses`);
  }

  return segments.join(" ");
}

export function formatExperienceDuration(input: DurationInput): string {
  return formatDuration(calculateExperienceDuration(input));
}

/** Alias semántico para educación (misma lógica reutilizable). */
export function formatEducationDuration(input: DurationInput): string {
  return formatDuration(calculateDuration(input));
}
