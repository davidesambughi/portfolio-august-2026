## This file has to be written precisely, clearly , and concisely. Do not add , assume or invent, but ask for more information if you need it .

# 13b — Motion & Micro-interactions

<!-- Legge prima: AGENTS.md, ui_context.md, 13a-visual-hierarchy-depth.md -->

Aggiungere micro-interazioni hover/click su CTA Hero e card Progetti, più animazioni di ingresso (fade+slide-up on scroll, stagger su card/timeline, scale-in sui pallini, crescita della accent bar) su tutte le sezioni homepage, disattivabili interamente via `prefers-reduced-motion` — nessun cambio a copy, layout, palette o struttura, stesso trattamento "puramente visivo" di 13a.

---

## Architecture, rules and constraints

- Stack: Next.js 16.3 / Tailwind 4.1 / shadcn-Base UI. **Nessuna nuova dipendenza** (no `framer-motion`/`motion`, coerente con il resto del progetto, che non lo usa mai nonostante sia elencato nello stack generale dell'utente) — verificato online (agosto 2026) che Tailwind CSS v4 + `IntersectionObserver` nativo coprono tutti i requisiti di questa unit senza libreria esterna: transizioni CSS (`transition-[transform,box-shadow,opacity]`), variant `motion-reduce:`/`motion-safe:` per `prefers-reduced-motion`, `@starting-style`/`transition-discrete` disponibili in v4 ma non necessari qui (nessun elemento passa da `display:none`).
- Pattern da riusare, non reinventare: `IntersectionObserver` già presente in `components/nav.tsx` (scroll-spy) e `components/toc.tsx` — stesso stile (`observer.disconnect()` in cleanup, `rootMargin` per anticipare/ritardare il trigger). Qui l'uso è diverso (rivelare una volta, non tracciare stato continuo): ogni elemento osservato si `unobserve()`-a subito dopo il primo `isIntersecting`, l'animazione non si ripete su scroll-up/down.
- Nuovo file condiviso: `components/scroll-reveal.tsx` (`'use client'`), unico punto che ospita la logica `IntersectionObserver` + il check `prefers-reduced-motion`, riusato da tutte le sezioni — evita di duplicare la stessa observer logic 5 volte (Projects/Education/Experience/Skills/About) o per ogni card/nodo.
- Le sezioni homepage restano Server Component (`projects-section.tsx`, `education-section.tsx`, ecc.) — non convertirle interamente in client. Solo il wrapper di reveal e gli elementi con stagger (card, nodi timeline) diventano/restano client, tramite composizione (Server Component passa `children` al wrapper client), stesso pattern già in uso per `education-list.tsx`/`experience-timeline.tsx` (Server prepara i dati, Client renderizza l'interazione).
- `prefers-reduced-motion`: disattivazione totale, non solo "meno intensa" — nessuna delle animazioni di questa unit deve girare se l'utente ha impostato la preferenza di sistema. Doppio livello di difesa: (1) CSS via `motion-reduce:` su ogni classe di transizione/animazione (garantisce nessun movimento anche se JS fallisce o è lento ad idratare); (2) `scroll-reveal.tsx` controlla `window.matchMedia("(prefers-reduced-motion: reduce)")` prima di attaccare l'observer — se `true`, il contenuto è reso subito nel suo stato finale (visibile, nessuna classe di partenza nascosta), niente flash-then-static.
- Nessun elemento deve rimanere invisibile se JavaScript non parte o l'observer non triggera mai (es. contenuto già in viewport al load, o sotto la piega ma mai raggiunto): lo stato di partenza (pre-reveal) usa solo `opacity`/`transform`, mai `visibility:hidden`/`display:none`, e uno stagger massimo va sempre applicato — se qualcosa va storto lato JS il contenuto resta comunque leggibile, solo senza animazione.

---

## Design

### 1. Hero CTA — hover/click
Sulle due `<a>` già esistenti in `hero.tsx` (righe ~60-71, "View projects"/"Get in touch"):
- Hover: lift di 1px (`hover:-translate-y-px`) + ombra (`hover:shadow-[0_6px_16px_rgba(0,0,0,.14)]`), aggiunti alle classi hover già presenti (`hover:brightness-[0.94]` sulla primaria, `hover:bg-muted` sulla secondaria — restano invariate, si sommano).
- Click: `active:translate-y-0 active:shadow-none` — il bottone torna alla posizione/ombra di riposo mentre è premuto (non sotto lo hover), dando un feedback di "pressione" prima di ripartire in hover al rilascio.
- `transition-[transform,box-shadow,filter]` sostituisce l'attuale `transition-[filter]`/`transition-colors` per includere le nuove proprietà animate; durata invariata (200ms, standard del sito).

### 2. Project card — zoom immagine
Sull'`<Image>` dentro `ProjectCard` (`projects-section.tsx`, div `relative aspect-[16/10] ... overflow-hidden`): l'immagine scala a `1.03` quando la card è in hover (`group-hover:scale-[1.03]`), oltre al lift già esistente sulla card esterna (`group-hover:-translate-y-1`, invariato). Lo zoom resta contenuto dentro `overflow-hidden` (già presente sul wrapper), quindi non fuoriesce dai bordi arrotondati. `transition-transform duration-200` sull'`<Image>` stessa (nuova, l'immagine oggi non ha classi di transizione).

### 3. Scroll reveal — ogni sezione
Ogni sezione homepage (Hero escluso — è già visibile al primo paint, nessun reveal) entra con fade (`opacity-0 → opacity-100`) + slide-up (`translate-y-6 → translate-y-0`, ~24px) in 500ms, quando il suo bordo superiore raggiunge l'80% dell'altezza del viewport (trigger anticipato, non quando è già a metà schermo). Si applica una volta sola per sezione (non ri-attiva se si ri-scrolla sopra e sotto).

Sezioni coinvolte: Projects, Education, Experience, Skills, About (stesso set che ha già l'accent bar in 13a). Contacts/Footer: **escluso**, vedi Scope Limits.

### 4. Stagger — card Progetti e nodi Timeline
- Card Progetti (`projects-section.tsx`, sia le card reali sia "Coming soon"): stesso fade+slide-up della sezione, ma con `transition-delay` crescente per indice — 80ms tra una card e la successiva, cap a 240ms (quindi la 4ª card in poi parte comunque a 240ms, non continua a crescere linearmente all'infinito se in futuro la griglia si allarga).
- Nodi Timeline Experience (`experience-timeline.tsx`, sia desktop sia mobile — inclusi tutti, "Future" compreso): stesso schema di delay (80ms per nodo, cap 240ms), applicato indipendentemente alle due liste (desktop e mobile hanno ordini diversi, ognuna ha il proprio stagger 0-based).
- I **pallini grandi** della timeline desktop (il cerchio `accent-purple` sulla linea condivisa, non i marker piccoli colorati) fanno uno scale-in dedicato: `scale-0 → scale-100`, stessa timing/delay del nodo a cui appartengono, invece del fade+slide-up generico.

### 5. Accent bar — crescita dopo l'ingresso
La barra decorativa sotto ogni heading (introdotta in 13a, `accordion-section-heading.tsx` + replica in `about-section.tsx`) cresce in larghezza da `0` a `52px` (`w-0 → w-[52px]`), partendo **dopo** che l'animazione di ingresso dell'heading/sezione è conclusa — `transition-delay` pari alla durata del reveal di sezione (500ms), non simultanea. Colore/allineamento/posizione (`mt-[14px]`, mapping colore↔sezione) restano quelli già definiti in 13a, invariati.

### prefers-reduced-motion
Con la preferenza attiva: nessun fade, nessuno slide, nessuno stagger, nessuna crescita della barra, nessun lift/zoom su hover/click delle CTA e delle card. Tutto il contenuto è immediatamente nel suo stato finale (opacità piena, posizione/scala/larghezza finali) al primo render. Il lift/zoom hover delle CTA/card Progetti (punti 1-2) è un'eccezione solo parziale: restano gli effetti di colore già esistenti in 13a (`hover:brightness`, `hover:bg-muted`, l'ombra hover della card) dato che non sono movimento — solo `translate`/`scale` vengono rimossi via `motion-reduce:`.

---

## Implementation

1. `components/scroll-reveal.tsx` (nuovo, `'use client'`): componente `ScrollReveal` che accetta `children`, `className?`, `delayMs?` (default `0`, cappato a 240 dal chiamante — il componente stesso non applica il cap, lo riceve già calcolato), `variant?: "fade-slide" | "scale"` (default `"fade-slide"`).
   - Ref sull'elemento wrapper (`<div>`, o `as` prop se serve un tag diverso — valutare in fase di implementazione se un `<div>` extra rompe un layout flex/grid esistente, es. dentro la griglia `grid-cols-3` di Projects; se sì, usare `React.cloneElement` o un tag configurabile invece di un wrapper fisso).
   - `useEffect`: se `window.matchMedia("(prefers-reduced-motion: reduce)").matches`, imposta subito lo stato "visibile" e non crea l'observer. Altrimenti crea un `IntersectionObserver` (`threshold: 0`, `rootMargin: "0px 0px -20% 0px"` per il trigger all'80% del viewport), al primo `isIntersecting` imposta "visibile" e chiama `unobserve` sull'elemento.
   - Classi: stato non-visibile `opacity-0 translate-y-6` (o `scale-0` per `variant="scale"`); stato visibile `opacity-100 translate-y-0` (`scale-100`); sempre presenti `transition-[opacity,transform] duration-500 motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100`; `transitionDelay` via inline `style` quando `delayMs > 0` (le classi Tailwind arbitrary-value per delay non coprono valori dinamici calcolati a runtime).

2. Sezioni homepage — avvolgere il contenuto interno (dentro il container `max-w-[1800px]`, non l'intera `<Accordion.Item>`/`<section>`) in `<ScrollReveal>`:
   - `components/projects-section.tsx`, `components/education-section.tsx`, `components/experience-section.tsx` (o dove vive il wrapper, se il file è stato rinominato — verificare), `components/skills-section.tsx`, `components/about-section.tsx`.
   - Hero: nessuna modifica per il reveal (già visibile al load, per design — vedi Design punto 3).

3. `components/projects-section.tsx`, `ProjectCard`: avvolgere ogni card in `<ScrollReveal delayMs={Math.min(index * 80, 240)}>` (serve l'indice della card nel `.map`, già disponibile). Applicare anche a `ComingSoonCard` con lo stesso schema di delay, continuando la sequenza dopo le card reali (indice = `projects.length + fillerIndex`). Aggiungere `group-hover:scale-[1.03] transition-transform duration-200 motion-reduce:transition-none` sull'`<Image>` del punto 2 del Design.

4. `components/experience-timeline.tsx`: avvolgere ogni nodo (desktop e mobile, entrambi i `.map`) in `<ScrollReveal delayMs={Math.min(index * 80, 240)}>`. Per i pallini grandi sulla linea condivisa (desktop, righe ~70-80): `<ScrollReveal variant="scale" delayMs={...}>` con lo stesso delay del nodo corrispondente (stesso indice).

5. `components/hero.tsx`, sulle due `<a>` CTA (righe ~60-71): aggiungere `hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(0,0,0,.14)] active:translate-y-0 active:shadow-none motion-reduce:hover:translate-y-0` alle classi esistenti; estendere `transition-[filter]`/`transition-colors` a `transition-[transform,box-shadow,filter]` / `transition-[transform,box-shadow,color]` rispettivamente.

6. `components/accordion-section-heading.tsx`: le due `<span>` della barra (`desktopBarClass`/`mobileBarClass`) passano da `w-[52px]` fisso a stato animato — larghezza iniziale `w-0`, transizione a `w-[52px]` triggerata insieme al reveal della sezione (stesso stato "visibile" di `ScrollReveal` che avvolge la sezione — la barra ha bisogno dello stesso segnale, non un observer proprio). Valutare in implementazione se `AccordionSectionHeading` riceve un nuovo prop (`revealed?: boolean`, passato dal `ScrollReveal` del punto 2 tramite `render prop`/callback) oppure se la barra osserva se stessa con un secondo `ScrollReveal`-like check ma con `transitionDelay: 500ms` fisso (più semplice, nessun prop-drilling, leggermente meno preciso se il reveal della sezione viene ritardato per altri motivi in futuro — preferire questa seconda via se il prop-drilling risulta scomodo con la struttura Server/Client attuale). Stessa modifica replicata a mano in `components/about-section.tsx` (barra non condivisa, come già in 13a).

7. `context/ui_context.md` — aggiungere una sotto-sezione "Motion" sotto "Interazioni (feedback utente)" che documenta: il pattern di reveal (`ScrollReveal`, fade+slide 500ms, trigger 80% viewport, one-shot), i valori di stagger (80ms/240ms cap), la regola `prefers-reduced-motion` (disattivazione totale del movimento, non solo riduzione), il nuovo hover/click delle CTA/card.

---

## Dependencies

Nessuna nuova dipendenza — `IntersectionObserver` e `window.matchMedia` sono API native del browser, già in uso nel progetto (`nav.tsx`, `toc.tsx`).

---

## Scope Limits

- Nessun cambio a copy, layout, palette, struttura delle sezioni, breakpoint o container fluido esistente (`ui_context.md`, "Layout — container globale") — questa unit è puramente animazioni/transizioni sopra il markup già esistente.
- Contacts/Footer: **nessun reveal** — restano come sono oggi (già esclusi anche dall'elevazione in 13a, stesso trattamento "resta piatto/statico").
- Non toccare Education (selettore lista/pannello logo) e Skills (icone/pillole Approach) oltre al reveal di sezione generico del punto 3 — nessuno stagger dedicato per le voci Education o le icone Skills, non richiesto dalla specifica utente.
- Non introdurre `framer-motion`/`motion` o altre librerie di animazione — vedi Architecture.
- Non toccare il meccanismo mobile-accordion (8c) — il reveal si applica al contenuto della sezione, non al comportamento espandi/collassa dell'`Accordion.Panel`.
- Non estendere il lift/hover a elementi non menzionati (nav pill, pillole Skills, badge, ecc.) — restano con il comportamento hover già definito in `ui_context.md`/13a.

---

## Check When Done

- Hero CTA: hover solleva di 1px e mostra ombra; durante il click (`:active`) torna alla posizione di riposo; EN e IT invariati nel testo.
- Project card: immagine interna fa zoom leggero (1.03) su hover della card, oltre al lift già esistente; "Coming soon" — verificare se deve avere lo stesso zoom (nessuna immagine reale al suo interno, probabilmente nessun effetto applicabile) o solo il reveal.
- Scrollando la pagina, ogni sezione (Projects/Education/Experience/Skills/About) appare con fade+slide-up quando raggiunge l'80% del viewport, una sola volta (non si ri-attiva scrollando su e giù).
- Le card Progetti e i nodi Timeline entrano in sequenza con un ritardo crescente visibile (80ms/nodo, cap 240ms), non tutti insieme.
- I pallini grandi della timeline desktop fanno uno scale-in invece del fade+slide generico.
- La accent bar di ogni sezione cresce da 0 a 52px visibilmente dopo che l'heading è già apparso, non in contemporanea.
- Con `prefers-reduced-motion: reduce` attivo nel sistema operativo/browser: nessuna delle animazioni sopra è visibile, tutto il contenuto è immediatamente nella sua posizione/opacità/larghezza finale al caricamento.
- Verifica visiva in browser (screenshot + scroll reale, non solo `curl`) — tutte le modifiche sono puramente visive/di interazione.
- `npm run build` passa.
