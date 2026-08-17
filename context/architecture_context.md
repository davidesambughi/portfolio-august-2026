# Architecture Context

## Stack

- Next.js 16.3.0 — App Router, SSG, Turbopack
- React 19.2.8
- TypeScript ~5.9.x (downgraded from originally planned 7.0.2 in unit 01 — `typescript-eslint` doesn't yet support TS 7.0, crashes on lint; revisit when support ships)
- Tailwind CSS 4.1.x
- shadcn/ui (via CLI)
- next-intl 4.13.5

**Escluso:** nessuna mutazione dati, nessun backend, sito statico.

⚠️ **Tecnologie rilasciate/aggiornate di recente (2025-2026)** — verificare sempre la documentazione ufficiale aggiornata ad agosto 2026 prima di implementare, non affidarsi a pattern pre-esistenti:

- **Next.js 16:** `middleware.ts` deprecato → rinominato `proxy.ts` (stessa funzione, nuovo nome/convenzione). Verificare doc ufficiale Next.js per altre breaking change della v16.
- **next-intl 4.x:** verificare setup routing/proxy aggiornato sulla doc ufficiale (`next-intl.dev`), soprattutto integrazione con `proxy.ts` invece di `middleware.ts`.
- **shadcn/ui:** da luglio 2026 il default per i primitives è Base UI (non più Radix UI). Confermato Base UI in unit 01 (flag esplicito `-b base`, non solo default).

## Organizzazione codice (alto livello)

- `app/[locale]/` — routing i18n, Homepage + Project Detail Page + 404
- `components/` — componenti riutilizzabili, incluso `ui/` (shadcn)
- `lib/` — funzioni di lettura contenuti (content layer)
- `types/` — tipi condivisi (`Project`, `Experience`, `Education`)
- `content/` — contenuti statici (vedi Content Model sotto)
- `messages/` — stringhe UI per next-intl

Server Component di default; `'use client'` solo dove serve interattività reale (da definire nel dettaglio in fase di build, non qui).

## Content Model

| Tipo                            | Dove                     | Formato                                                                                                               |
| ------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Stringhe UI (nav, label)        | `messages/`              | 1 file per lingua, gestito da next-intl                                                                               |
| Case study progetti (long-form) | `content/projects/`      | 1 file `.mdx` per lingua per progetto — raccomandazione ufficiale next-intl per contenuto lungo                       |
| Experience / Education          | `content/data/`          | 1 file, 1 voce per item, campi testuali tradotti `{en, it}`, resto dei dati unico (no duplicazione)                   |
| Skills (tech + metodologie)     | `content/data/skills.ts` | 1 file, due array esportati: `technologies` (id, label, iconSlug → Simple Icons) e `methodologies` (label `{en, it}`) |

## Deploy

Vercel.

## Aperto — da decidere insieme

- Lista precisa componenti client-side
- Gestione file CV (uno o per lingua)

## Deciso

- shadcn: **Base UI** (confermato, unit 01) — `@base-ui/react` in dipendenze, non Radix.
- Icone: **Simple Icons** (npm `simple-icons`) per loghi tech stack + GitHub/LinkedIn/Gmail in Contacts — `lucide-react` non ha più icone brand da v1.0 (giugno 2026, rimosse per motivi di trademark). `lucide-react` resta per icone UI generiche.
- **Tech Stack rinominato "Skills"** in nav — contiene loghi tecnologie + pill testuali di metodologie/approccio (Agile, SDLC, Specification-Driven Development, AI-assisted Engineering, OOP), non solo loghi.
- **`not-prose`**: applicarlo solo sull'elemento che lo richiede davvero (es. contiene `<img>`), mai su un wrapper condiviso — disattiva `.prose` per tutto il sottoalbero, inclusi contenuti Markdown che non c'entrano (unit 09c).
- **TOC della Project Detail Page: interattiva, non più statica (2026-08-11, unit 09g)** — inversione esplicita della decisione registrata in 09b/09d/09e ("TOC statica, zero `use client`, zero scroll-spy" se mai costruita). Motivo: con un secondo progetto in arrivo, vale la pena costruirla per davvero invece di continuare a rimandarla. Implementata come `components/toc.tsx`: tab collassabile a sinistra su desktop (click-to-expand, overlay `fixed`, non riserva spazio di layout), bottom sheet su mobile via `@base-ui/react/drawer` (già in dipendenze, nessun componente custom). `IntersectionObserver` scroll-spy sugli `id` manuali degli H2 (no `rehype-slug`, id scritti a mano — solo 4 heading su una pagina).
- **`backdrop-blur` per la TOC — scoped, non nuovo pattern sitewide**: `Footer` ha già un `backdrop-blur-sm` leggero, ma la TOC è il primo elemento a usare un vero pannello "glass" fluttuante sopra il contenuto. Resta un'eccezione puntuale a questo componente, non un default per il resto del sito.
- **Language switcher (2026-08-12)**: `components/language-switcher.tsx`, shadcn `dropdown-menu` (Base UI, installato in questa unit) + `usePathname`/`useRouter` di `next-intl` (`@/i18n/navigation`) per cambiare `locale` preservando il path corrente. Radius del popup **esplicito in px, overridato a livello di chiamata** (non nel file condiviso `components/ui/dropdown-menu.tsx`) — il token globale `--radius: 9999px` fa sì che ogni classe `rounded-*` di Tailwind (derivata da quel token, vedi Session Notes unit 04) renda a pillola piena anche su un piccolo popup, dove non è quello l'effetto voluto. Stesso principio da riapplicare per qualunque futuro popup/dropdown non-pill.
- **`--nav-height` CSS custom property**: `nav.tsx` pubblica la propria altezza reale (misurata via `ResizeObserver`, non un numero fisso) su `document.documentElement`, così `hero.tsx` può dimensionarsi con `min-h-[calc(100dvh-var(--nav-height))]` — garantisce che Hero+Nav coprano sempre un intero viewport, su qualsiasi schermo, senza affidarsi al vecchio trucco `flex-1` (che smette di funzionare non appena il contenuto totale della pagina supera l'altezza del viewport, cioè sempre da quando ci sono sezioni reali sotto Hero).
- **`export const viewport` esplicito in `app/[locale]/layout.tsx` (2026-08-12)** — il default auto-generato da Next.js 16.3 per il meta tag viewport, verificato via `curl` sull'HTML reale, emette solo `width=device-width`, senza `initial-scale=1` (nonostante la doc ufficiale dica che il default è "sufficiente"). Dichiarato esplicitamente `{ width: "device-width", initialScale: 1 }`. **Non** aggiungere `maximumScale`/`userScalable: false` come nel default "raccomandato" da Next — viola WCAG 1.4.4 (blocca il pinch-zoom), in conflitto con l'obiettivo di accessibilità del progetto. Root-cause reale del bug mobile-only era altrove (vedi `progress_tracker.md`, Session Notes 2026-08-12) — questo fix resta comunque corretto/da mantenere a prescindere.
- **Ogni elemento con testo troncato in un contenitore `flex` deve avere `min-w-0` sul contenitore** — un flex item non si restringe mai sotto la larghezza naturale del suo contenuto (`min-width: auto` di default), quindi `whitespace-nowrap`/`truncate` da soli non bastano su un flex child se il contenitore non ha `min-w-0`. Causa reale del bug di overflow orizzontale mobile-only (2026-08-12, vedi `progress_tracker.md`): un'etichetta lunga in `components/certificates-list.tsx` sforava la larghezza della pagina perché nessun antenato ha `overflow-hidden`. Pattern da riapplicare per qualunque futura label/testo troncato dentro un flex row.
