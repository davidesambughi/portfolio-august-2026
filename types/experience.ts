/** Single work experience entry. endDate: null means current role. */
export type Experience = {
  id: string;
  company: string;
  role: { en: string; it: string };
  location?: string;
  /** "YYYY-MM" where the month is known, "YYYY" otherwise. */
  startDate: string;
  endDate: string | null;
  description: { en: string; it: string };
};
