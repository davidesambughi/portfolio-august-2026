/**
 * "YYYY-MM" or "YYYY" -> a locale-formatted month/year (or just the year).
 * `yearOnly` collapses "YYYY-MM" down to just the year (used by Education).
 */
function formatDate(date: string, locale: string, yearOnly = false): string {
  const [year, month] = date.split("-");
  if (!month || yearOnly) return year;
  return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" }).format(
    new Date(Number(year), Number(month) - 1, 1)
  );
}

/**
 * endDate: null renders as `presentLabel` (the translated "Present"/"Presente" string).
 * `yearOnly` shows only years, dropping months even when the source has them.
 */
export function formatDateRange(
  startDate: string,
  endDate: string | null,
  presentLabel: string,
  locale: string,
  yearOnly = false
): string {
  const start = formatDate(startDate, locale, yearOnly);
  const end = endDate ? formatDate(endDate, locale, yearOnly) : presentLabel;
  return `${start} – ${end}`;
}
