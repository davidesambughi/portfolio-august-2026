import type { Experience } from "@/types/experience";

/** Sorted most-recent-first (current role, endDate: null, always sorts first). */
export const experience: Experience[] = [
  {
    id: "inspectos-fullstack-intern",
    company: "InspectOs",
    role: {
      en: "Full Stack Software Developer Intern",
      it: "Tirocinante Full Stack Software Developer",
    },
    location: "Lisbon, Portugal",
    startDate: "2026-01",
    endDate: "2026-06",
    description: {
      en: "Hands-on experience delivering production-ready products end-to-end, collaborating autonomously or with developers and stakeholders across the full software development lifecycle. Worked primarily with Next.js, Supabase, multilingual SEO- and GEO-optimized web applications, with a strong focus on AI-assisted development—leveraging a specification-driven approach to guide AI agents—automation, and product delivery.",
      it: "Esperienza pratica nello sviluppo end-to-end di prodotti pronti per la produzione, lavorando in autonomia o in collaborazione con sviluppatori e stakeholder lungo l'intero ciclo di vita del software. Esperienza focalizzata principalmente su Next.js, Supabase e applicazioni web ottimizzate per SEO e GEO multilingua, con una forte enfasi sullo sviluppo assistito dall'intelligenza artificiale — sfruttando un approccio basato sulle specifiche (specification-driven) per guidare gli agenti AI — sull'automazione e sul rilascio del prodotto.",
    },
  },
  {
    id: "hospitality-cook-chef",
    company: "Various Employers",
    role: {
      en: "Cook, Chef",
      it: "Cuoco e Chef",
    },
    location: "Australia",
    startDate: "2019",
    endDate: "2024",
    description: {
      en: "Worked in hospitality across Australia for five years, developing adaptability, a proactive mindset, problem-solving abilities, and strong cross-cultural communication skills in fast-paced environments.",
      it: "Ho lavorato nel settore della ristorazione in Australia per cinque anni, sviluppando capacità di adattamento, un approccio proattivo, capacità di problem solving e solide competenze di comunicazione interculturale in ambienti dinamici e ad alto ritmo di lavoro.",
    },
  },
  {
    id: "sambughi-assicurazioni",
    company: "Sambughi Assicurazioni",
    role: {
      en: "Insurance Employee",
      it: "Impiegato Assicurativo",
    },
    location: "Fano, Italy",
    startDate: "2014",
    endDate: "2019",
    description: {
      en: "Client consulting (specialized in motor insurance), quotations, policy renewals, and back-office operations. Developed a strong work ethic, attention to detail, and a customer-focused approach to problem solving.",
      it: "Consulenza ai clienti, con specializzazione nel ramo auto, elaborazione di preventivi, rinnovo delle polizze e gestione delle attività di back office. Ho sviluppato un forte senso di responsabilità, attenzione ai dettagli e un approccio orientato al cliente e alla risoluzione dei problemi.",
    },
  },
];
