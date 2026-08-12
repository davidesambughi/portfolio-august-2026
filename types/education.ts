/** Single education entry. endDate: null means ongoing. */
export type Education = {
  id: string;
  institution: string;
  logoUrl?: string;
  pdfUrl?: string;
  degree: { en: string; it: string };
  location?: string;
  /** "YYYY-MM" where the month is known, "YYYY" otherwise. */
  startDate: string;
  endDate: string | null;
  description?: { en: string; it: string };
};
