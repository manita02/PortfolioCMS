const DATE_LOCALE = "es-AR";

export function formatMonthYear(
  month: number | null | undefined,
  year: number | null | undefined,
  presentLabel: string,
  isCurrent?: boolean,
): string {
  if (isCurrent || (!month && !year)) {
    if (isCurrent) return presentLabel;
  }
  if (!month || !year) return presentLabel;
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat(DATE_LOCALE, {
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateRange(params: {
  startMonth: number;
  startYear: number;
  endMonth?: number | null;
  endYear?: number | null;
  isCurrent?: boolean;
  presentLabel: string;
}): string {
  const start = formatMonthYear(
    params.startMonth,
    params.startYear,
    "",
  );
  const end = params.isCurrent
    ? params.presentLabel
    : formatMonthYear(
        params.endMonth,
        params.endYear,
        params.presentLabel,
      );
  return `${start} — ${end}`;
}

export function toMmYyyy(month: number, year: number): string {
  return `${String(month).padStart(2, "0")}/${year}`;
}

/** Rango de fechas de proyecto (sin concepto “Actual”). */
export function formatProjectDateRange(params: {
  startMonth: number | null | undefined;
  startYear: number | null | undefined;
  endMonth?: number | null;
  endYear?: number | null;
}): string {
  if (!params.startMonth || !params.startYear) return "";
  const start = formatMonthYear(params.startMonth, params.startYear, "");
  if (params.endMonth && params.endYear) {
    const end = formatMonthYear(params.endMonth, params.endYear, "");
    return `${start} — ${end}`;
  }
  return start;
}
