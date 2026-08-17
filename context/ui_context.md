# UI Context — Design System

**Base:** shadcn/ui (componenti, spacing scale, accessibilità, focus states) — shadcn va installato per primo, nessun design system custom parallelo. I token sotto sono override puntuali sopra la base shadcn, non una sostituzione.

## Colori

Uso decorativo/alternato, non semantico — non associare significato (stato, categoria, priorità) ai colori. Servono a dare varietà visiva minimal alla homepage (badge, bottoni, accenti), alternati tra le sezioni/card senza logica fissa.

- `--color-accent-blue`: `oklch(0.7331 0.1414 253.23)`
- `--color-accent-red`: `oklch(0.6578 0.2483 20.82)`
- `--color-accent-yellow`: `oklch(0.9111 0.1595 96)`
- `--color-accent-green`: `oklch(0.8637 0.2582 161.65)`
- `--color-accent-purple`: `oklch(0.5 0.24 300)` (aggiunto unit 07, per la linea/pallini della timeline Experience — nessun valore esatto dal mockup, stimato a occhio)
- `--color-accent-teal`: `oklch(0.6149 0.1057 180.86)` (aggiunto unit 09e, valore esatto fornito dall'utente — colora solo i label in grassetto della lista "7 fasi del workflow" nella Project Detail Page, non i bold del resto del sito)
- `--color-accent-orange`: `oklch(0.75 0.16 50)` (aggiunto unit 09e, stimato a occhio iterando dal vivo col utente — sfondo del `LegendBox` Stripe, sempre a bassa opacità)
- `--color-heading`: `oklch(0 0 0)` (nero puro, bold)
- `--color-subheading`: `oklch(0.4892 0.0051 17.33)` (bold)
- `--color-body`: `oklch(0.4892 0.0051 17.33)` (regular)
- `--color-on-accent`: `oklch(1 0 0)` (bianco — testo su badge/bottoni)

Naming aggiornato in unit 01 per evitare classi Tailwind doppie (text-text-heading → text-heading).

## Tipografia

**Font:** Google Sans Flex (variable font, licenza OFL — via `next/font/google`).

| Ruolo                  | Peso    | Colore                        |
| ---------------------- | ------- | ----------------------------- |
| Titoli (h1, h2...)     | Bold    | `--color-heading` (nero)      |
| Sottotitoli            | Bold    | `--color-subheading` (grigio) |
| Body / paragrafi       | Regular | `--color-body` (grigio)       |
| Testo su badge/bottoni | —       | `--color-on-accent` (bianco)  |

## Radius

Tutto fortemente arrotondato, pill-style: nav, badge, bottoni, card progetti. Nessuna eccezione — coerenza totale su questo asse.

Implementato come `--radius: 9999px` (non una percentuale — su elementi rettangolari una percentuale clippa a ellisse, non a pillola). Un radius superiore alla metà di altezza/larghezza dell'elemento clippa automaticamente a pillola perfetta su qualsiasi dimensione.

## Interazioni (feedback utente)

Ogni elemento interattivo deve dare un feedback leggero e coerente. Transizione standard: 200ms, easing default Tailwind (`transition-colors` / `transition-transform`).

| Elemento      | Comportamento hover/focus            |
| ------------- | ------------------------------------ |
| Nav (header)  | Alone leggero grigio chiaro          |
| Bottoni       | Stesso colore, leggermente più scuro |
| Card progetti | Leggero zoom (scale)                 |
| Timeline Experience | **Eccezione** (2026-08-12): hover tinto sul colore del pallino di ogni voce (opacità bassa, tarata per colore — giallo richiede molta più opacità di blu/verde/rosso per restare visibile), non grigio neutro come il resto del sito. Sostituito a `group-hover:bg-muted`, diventato invisibile dopo il cambio sfondo sezione (vedi sotto). Deviazione deliberata, confermata con l'utente — non un pattern da riusare altrove senza chiederlo. |
| CTA Hero / Card Progetti | (2026-08-17, unit 13b) Hover: lift `1px` (`hover:-translate-y-px`) + ombra `shadow-[0_6px_16px_rgba(0,0,0,.14)]`, sommato agli effetti colore già esistenti (brightness/bg-muted). Click: `active:translate-y-0 active:shadow-none`, torna a riposo durante la pressione. Card Progetti: immagine interna fa zoom `scale-[1.03]` su hover della card (`group-hover`), oltre al lift già esistente sulla card. |

## Motion (2026-08-17, unit 13b)

Nessuna libreria esterna (niente `framer-motion`/`motion`) — `IntersectionObserver` nativo + transizioni CSS Tailwind, stesso pattern già in uso per lo scroll-spy di `nav.tsx`/`toc.tsx`. Logica condivisa in `components/use-reveal.ts` (hook `useReveal`, un solo `IntersectionObserver` per elemento, trigger one-shot all'80% del viewport, `unobserve` dopo il primo `isIntersecting`) e `components/scroll-reveal.tsx` (wrapper `<ScrollReveal>` che applica fade+slide-up o scale-in).

- **Scroll reveal**: ogni sezione homepage (Projects/Education/Experience/Skills/About — Hero escluso, già visibile al load) entra con fade (`opacity-0→100`) + slide-up (`translate-y-6→0`) in 500ms, quando raggiunge l'80% del viewport (`rootMargin: "0px 0px -20% 0px"`). Applicato all'heading di ogni sezione sempre; al corpo (subheading/liste/griglie) dove non c'è già uno stagger dedicato per-item (Education, Skills, About).
- **Stagger**: card Progetti e nodi Timeline Experience (desktop e mobile, entrambi i pallini grandi inclusi) entrano in sequenza — `80ms × indice`, cap a `240ms`. I pallini grandi della timeline desktop usano `variant="scale"` (`scale-0→100`) invece di fade+slide.
- **Accent bar**: cresce in larghezza da `0` a `52px` invece di comparire già alla dimensione finale — `transitionDelay: 500ms` fisso (non legato al segnale di reveal della sezione, per evitare prop-drilling attraverso ogni call site), quindi cresce dopo che l'heading ha già finito di apparire. Stesso hook `useReveal`, chiamato due volte in `accordion-section-heading.tsx` (variante desktop/mobile, ognuna con il proprio observer — solo una delle due è mai effettivamente visibile a un dato breakpoint) e replicato in `components/about-accent-bar.tsx` (client component dedicato, dato che `about-section.tsx` è un Server Component e non può chiamare hook direttamente).
- **`position: sticky` + reveal — attenzione**: un `transform` su un *qualsiasi antenato* di un elemento `sticky` ne rompe lo sticky (cambia il suo containing block). L'immagine collage di About (`lg:sticky`) ha il wrapper `ScrollReveal` applicato solo al *div interno* (figlio dell'elemento sticky), mai al wrapper sticky stesso o a un suo antenato — vedi commenti in `about-section.tsx`. Se una sezione futura introduce un elemento `sticky`, applicare la stessa cautela.
- **`prefers-reduced-motion`**: disattivazione totale del movimento, non solo riduzione. Doppio livello: (1) CSS, ogni classe di transizione include `motion-reduce:transition-none` + lo stato finale (`motion-reduce:opacity-100 motion-reduce:translate-y-0` ecc.); (2) `useReveal` controlla `window.matchMedia("(prefers-reduced-motion: reduce)")` e, se `true`, salta l'observer e imposta `revealed: true` da subito — nessun elemento resta invisibile se l'utente ha questa preferenza attiva. Gli effetti hover di sola tinta (brightness/bg-muted) restano attivi anche con la preferenza attiva — non sono movimento.

## Elevazione (ombre) e accent bar — 2026-08-17, unit 13a

Introdotti per risolvere la percezione di "sito piatto" (assenza di rilievo/gerarchia tra elementi e sfondo). Valori shadow in `rgba` arbitrary-value (non la scala default Tailwind), forniti letteralmente dall'utente — nessun nuovo token `--shadow-*`.

**Ombre:**
- Card Progetti: intera card (non solo l'immagine) su superficie `bg-white`, `border-[rgba(0,0,0,.07)]`, `shadow-[0_10px_30px_rgba(0,0,0,.08)]`; hover `-translate-y-1` + `shadow-[0_18px_44px_rgba(0,0,0,.12)]` (sostituisce il precedente `hover:scale-[1.02]`). "Coming soon" resta piatta, invariata.
- Formazione: pannello logo (solo quando è presente un logo, non nel fallback a tinta piena) è card bianca con bordo + `shadow-[0_10px_30px_rgba(0,0,0,.07)]`; voce selezionata ha `bg-white` + `shadow-[0_10px_28px_rgba(0,0,0,.09)]` + bordo sinistro 4px (era 3px).
- Nav pill: `bg-white/[0.92]` + `backdrop-blur-md` + `shadow-[0_6px_20px_rgba(0,0,0,.10)]` (era `bg-background shadow-md`).
- Timeline Experience: i grandi pallini sulla linea condivisa hanno un anello bianco `shadow-[0_0_0_4px_rgba(255,255,255,.9)]` per staccarsi dalla linea dotted.
- Pillole Approach (Skills): `shadow-[0_6px_16px_rgba(0,0,0,.10)]`.
- Collage About: `shadow-[0_14px_40px_rgba(0,0,0,.14)]` (nota: in una sessione precedente l'ombra era stata rimossa da qui su richiesta dell'utente — reintrodotta esplicitamente in questa unit come parte del pass di gerarchia/profondità coordinato, non una svista).
- Restano piatti: "Coming soon", Skills (icone), Certificates, Footer/Contacts.

**Accent bar sotto heading di sezione:** barra `52×5px`, `rounded-full`, `mt-[14px]`, via prop opzionale `barColorClass`/`barAlign` su `components/accordion-section-heading.tsx` (replicata manualmente in `about-section.tsx`, che ha un markup heading proprio). `barAlign` si applica **solo al desktop** — su mobile la barra è sempre a sinistra (l'`Accordion.Trigger` mobile è sempre un layout testo-sinistra/chevron-destra, pattern 8c preesistente; `desktopBarClass`/`mobileBarClass` sono classi separate proprio per questo, non condividono `mx-auto`).

**Correzione 2026-08-17 (stesso giorno di 13a)**: tutte le sezioni homepage (tranne Hero, sempre a sinistra) sono ora **left-aligned anche su desktop** — Projects, Education, Skills sono passate da centrate (`text-center`, barra `mx-auto`) a sinistra (`barAlign="start"`, wrapper senza `mx-auto`/`text-center`, o con `lg:text-left lg:mx-0` per i sottotitoli che restano centrati su mobile). Experience e About erano già a sinistra, invariate. Cambio richiesto esplicitamente dall'utente, **solo desktop** — il mobile (dove l'header dell'accordion è sempre a sinistra da prima di 13a) resta come già era, incluso il sottotitolo di Projects/Education che su mobile resta centrato (`text-center lg:text-left`).

Mapping colore↔sezione (invariato): Projects `accent-blue`, Education `accent-red`, Experience `accent-purple` (stesso colore della timeline), Skills `accent-green`, About `oklch(0.8655 0.1595 96)` — lo stesso giallo scuro arbitrary della pillola Agile/SDLC.

**Hero CTA (2026-08-17):** due link a pillola sotto il body text — primaria "Progetti"/"View projects" (`bg-accent-blue`, `text-on-accent`) verso `#projects`, secondaria "Contattami"/"Get in touch" (bordo, `text-heading`) verso `#contacts`. Valori px fissi (non `clamp()`), eccezione deliberata per elementi di chrome piccoli — vedi `13a-visual-hierarchy-depth.md`.

## Sfondi sezione (2026-08-12, esteso 2026-08-12)

Projects, Experience e About usano `bg-black/[0.03]` a piena larghezza (edge-to-edge, non contenuto nel `max-w`) — struttura a due livelli: `<section>` esterna piena larghezza con il colore, `<div>` interna con il solito `max-w-[1800px]` per il contenuto (stesso pattern di `footer.tsx`). Education e Skills restano bianchi. Puramente un test visivo confermato dall'utente, non ancora esteso ad altre sezioni.

Il **Footer** usa `bg-black/[0.06]` — leggermente più scuro delle sezioni di contenuto, non `/[0.03]` (2026-08-12) — perché è sempre l'ultimo elemento della pagina e quindi sempre adiacente a qualunque sezione lo preceda; essendo l'ultima ad avere sfondo tinto era About, stesso valore, senza alcun confine visivo percepibile tra le due. Un footer più scuro risolve il problema indipendentemente da quale sezione stia sopra (non dipende dall'alternanza), leggibile anche come convenzione comune (footer leggermente più "pesante" del contenuto).

## Layout — container globale (sistema, vale per tutte le sezioni)

Niente container stretto e centrato in stile "colonna di testo" (es. `max-w-3xl` su tutta la sezione). Riferimento: workspace.google.com/products/slides — colonna di testo a larghezza fissa/leggibile, contenuto visivo che si espande per riempire lo spazio residuo.

Pattern per sezioni full-width — il container esterno vale per tutte le sezioni (05/06 incluse); il layout a due colonne testo+visual sotto vale solo se una sezione futura ha davvero quella forma, non come default:

- Container esterno: `max-w-[1800px]` centrato, padding orizzontale **fluido** via `clamp()` (es. `px-[clamp(1.5rem,4vw,6rem)]`) invece di un `max-w` stretto fisso e invece di scatti su breakpoint fissi (`px-6 sm:px-10 lg:...`).
- Layout a due colonne (testo + visual): la colonna di testo ha una quota percentuale della riga (es. `lg:w-[46%]`), non una larghezza fissa in px — così il rapporto testo/visual resta vicino al 50/50 a qualsiasi larghezza del breakpoint a due colonne, non solo a una larghezza specifica. La colonna visual usa `lg:flex-1` per prendere lo spazio residuo, con altezza guidata da `aspect-[]` (rapporto reale dell'immagine) invece che da un'altezza fissa o legata al viewport.
- **Tipografia e spaziature verticali/orizzontali: `clamp()`, non tier a breakpoint discreti** (`text-4xl md:text-5xl lg:... xl:...`). Tier discreti lasciano larghezze "intermedie" (es. un laptop 1366×768) non testate, dove il font restava dimensionato per una colonna più larga di quella disponibile, andava a capo su una riga in più, e spingeva la nav sticky oltre il fondo del viewport. `clamp(min, preferred-con-vw/vh, max)` scala in continuo con il viewport — verificato che l'unico switch discreto rimasto necessario è il cambio di layout stesso (stacked → due colonne a `lg`), che è strutturale e non interpolabile; tutto il resto (font-size, padding, gap) deve essere fluido. Riferimento: doc ufficiale Tailwind CSS v4 (`text-[clamp(...)]`, arbitrary values), verificata ad agosto 2026.
- Il nav (header) usa lo stesso container fluido esterno di Hero (stesso `max-w-[1800px]` e stesso padding fluido), così i suoi bordi sinistro/destro si allineano al resto della pagina invece di restare centrato con margini propri scollegati. La pillola interna ha un suo `max-w` più contenuto (`max-w-4xl`), centrata dentro il container esterno — corretto dopo feedback utente (prima versione: nav su `max-w-3xl` indipendente, sembrava scollegata dalla Hero sui monitor larghi).

**Regola generale:** per qualunque meccanismo responsive, verifica sempre online la doc ufficiale Tailwind corrente (agosto 2026) prima di implementare (vedi AGENTS.md) e testa su un range di larghezze, non solo sui breakpoint standard — un valore intermedio non testato è dove nascondono i bug (caso reale: unit 04, laptop 1366×768).

## Accessibilità & Responsive

- Focus visibile, contrasto minimo AA → gestiti da shadcn default, nessun override.
- Mobile-first, breakpoint Tailwind/shadcn default.
- Nav: pillola orizzontale desktop → hamburger menu mobile (da `user-flows.md`).
- Experience: timeline orizzontale desktop → stack verticale mobile (da `user-flows.md`).

## Dark mode

Fuori scope MVP. Spostato in V2 Ideas (`project-overview.md`), insieme a blog/filtri/search. Nessun lavoro di token dark-mode in questa fase — priorità: MVP live il prima possibile.
