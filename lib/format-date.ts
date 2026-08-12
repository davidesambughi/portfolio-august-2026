/** "YYYY-MM" or "YYYY" -> a locale-formatted month/year (or just the year). */
function formatDate(date: string, locale: string): string {
  const [year, month] = date.split("-");
  if (!month) return year;
  return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" }).format(
    new Date(Number(year), Number(month) - 1, 1)
  );
}

/** endDate: null renders as `presentLabel` (the translated "Present"/"Presente" string). */
export function formatDateRange(
  startDate: string,
  endDate: string | null,
  presentLabel: string,
  locale: string
): string {
  const start = formatDate(startDate, locale);
  const end = endDate ? formatDate(endDate, locale) : presentLabel;
  return `${start} – ${end}`;
}
