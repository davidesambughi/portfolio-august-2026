# Workflow

1. **Lettura del contesto:** L'agente legge i file di contesto nell'ordine definito in `AGENTS.md`.
2. **Scrittura delle specifiche di implementazione:** Utilizzando un template obbligatorio (`00-template.md`), l'agente redige la specifica della feature (es. `feature-specs/04-auth.md`). La specifica include una sintesi dell'outcome in una frase, vincoli tecnologici, passi di implementazione numerati, limiti di scope ed elementi esclusi, ed infine i criteri di verifica (Check When Done).
3. **Implementazione:** L'agente scrive il codice attenendosi strettamente alla specifica, senza allargare lo scope della feature.
4. **Verifica:** `npm run build` passa (type-check + build reale). Unit test solo dove c'è vera logica (es. `lib/content.ts`). Per componenti UI: controllo visivo diretto.
5. **Aggiornamento del Progress Tracker:** L'agente scrive nel tracker il risultato della sessione (test superati, file modificati).
6. **Push su GitHub:** Vercel genera automaticamente l'anteprima → verifichi che vada bene → merge in main → Vercel pubblica in produzione.
7. **Chiusura della sessione:** Lo stato viene consolidato e reso disponibile per il ciclo successivo.
