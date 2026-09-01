import type { Education } from "@/types/education";

/** Sorted most-recent-first (current entry, endDate: null, always sorts first). */
export const education: Education[] = [
  {
    id: "its-marche-fullstack-cloud",
    institution: "ITS Marche",
    logoUrl: "/images/its-logo.png",
    degree: {
      en: "Full-Stack Software Developer e Cloud Specialist",
      it: "Full-Stack Software Developer e Cloud Specialist",
    },
    location: "Senigallia, Italy",
    startDate: "2024-12",
    endDate: "2026-07",
    description: {
      en: "Final grade: 110/110.",
      it: "Voto finale: 110/110.",
    },
  },
  {
    id: "pte-academic-c1",
    institution: "PTE Academic",
    logoUrl: "/images/pte-certificate-preview.png",
    pdfUrl: "/images/Davide_Sambughi_pte.pdf",
    degree: {
      en: "C1 English Proficiency",
      it: "Certificazione di Inglese C1",
    },
    location: "Perth, Australia",
    startDate: "2022",
    endDate: "2024",
  },
  {
    id: "istituto-spadolini-ragioniere",
    institution: "Istituto Tecnico Commerciale G. Spadolini",
    degree: {
      en: "Ragioniere Perito Tecnico Commerciale (IGEA)",
      it: "Ragioniere Perito Tecnico Commerciale (IGEA)",
    },
    location: "Frattamaggiore, Italy",
    startDate: "2008",
    endDate: "2013",
  },
];
