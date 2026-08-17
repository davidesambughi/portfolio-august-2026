## This file has to be written precisely, clearly , and concisely. Do not add , assume or invent, but ask for more information if you need it .

# 13a — Visual Hierarchy & Depth

<!-- Legge prima: AGENTS.md, ui_context.md, architecture_context.md -->

Aggiungere gerarchia visiva, contrasto e profondità alla homepage tramite: due nuove CTA nell'Hero, una barra decorativa colorata sotto ogni heading di sezione, elevazione reale sulle card Progetti e sullo stato selezionato di Formazione, più una serie di ritocchi puntuali di ombra/sfondo (Nav, timeline Experience, pillole Skills, collage About) — nessun cambio a copy, layout, palette o struttura delle sezioni, come da specifica fornita dall'utente.

---

## Architecture, rules and constraints

- Stack: Next.js 16.3 / Tailwind 4.1 / shadcn-Base UI (post-training-cutoff, verificare doc se emergono dubbi in fase di implementazione — nessuna nuova API richiesta qui, solo utility Tailwind arbitrary-value già in uso nel progetto).
- **Eccezione deliberata alla regola clamp()** (`ui_context.md`, "Layout — container globale"): i valori di questa unit (padding CTA, font-size 15px, border-width 1.5px, dimensioni barra 52×5px) sono **fissi in px**, non `clamp()`, perché sono elementi di chrome piccoli e specificati letteralmente dall'utente (stesso trattamento già riservato ai padding fissi di `nav.tsx`, es. `px-4 py-1.5`) — non reinterpretarli come fluidi.
- Nessun nuovo design token CSS: tutti i colori richiesti esistono già come `--color-accent-*` oppure come valore arbitrary già in uso (`oklch(0.8655 0.1595 96)`, il giallo scuro delle pillole Approach in `skills-section.tsx`).
- Pattern shadow-arbitrary già in uso nel progetto per valori fuori dalla scala Tailwind default (es. `shadow-[0_0_0_4px_...]` non ancora presente ma coerente con `bg-[oklch(...)]` già usato in `skills-section.tsx`).
- **Item 6 della richiesta utente ("badge data con accentColor") è già implementato** — `components/projects-section.tsx` usa già `ACCENT_BADGE_CLASSES[project.accentColor]` sul badge data, e i dati reali (`content/data/projects` o equivalente) hanno già `accentColor: "green"` per Raising Kids e `"blue"` per RemoteNIF (confermato via screenshot browser in sessione precedente). **Nessuna modifica necessaria per questo punto** — non toccare `projects-section.tsx` per questo, solo per il punto 3 (elevazione card).

## Design

### 1. Hero — due CTA a pillola
Riga flex (`gap-3` = 12px) sotto il paragrafo body, dentro la colonna testo esistente (stesso allineamento della colonna: centrata da mobile a tablet, a sinistra da `lg`).
- Primaria "View projects" → `href="#projects"`, `bg-accent-blue`, `text-on-accent` (token esistente, non un bianco raw), bold, `text-[15px]`, `px-[26px] py-[12px]`, `rounded-full`, hover `brightness-[0.94]`.
- Secondaria "Get in touch" → `href="#contacts"`, sfondo trasparente, `text-heading` (token esistente, non un nero raw), bold, bordo `border-[1.5px] border-black/20`, stesso padding/radius, hover `bg-muted`.

**Testo IT confermato dall'utente**: "Progetti" / "Contattami".

### 2. Accent bar sotto ogni heading di sezione
Barra `52px × 5px`, `rounded-full`, `mt-[14px]` sotto l'h2. Implementata come modifica al componente condiviso `components/accordion-section-heading.tsx` (usato da Projects/Education/Experience/Skills) più una replica manuale in `about-section.tsx` (che non usa il componente condiviso — ha il suo markup heading dedicato, vedi Implementation).

| Sezione | Colore | Allineamento |
|---|---|---|
| Projects | `bg-accent-blue` | centrato |
| Education | `bg-accent-red` | centrato |
| Experience | `bg-accent-purple` | sinistra (stesso colore della timeline) |
| Skills | `bg-accent-green` | centrato |
| About | `bg-[oklch(0.8655_0.1595_96)]` (giallo scuro, stesso valore arbitrary già usato per la pillola Agile/SDLC) | sinistra |

Allineamento segue quello già esistente di ogni heading (Projects/Education hanno un wrapper `text-center`; Skills passa `className="text-center"`; Experience e About sono già a sinistra) — la barra è un elemento `block` con `w-[52px]` fisso, quindi centrata via `mx-auto` solo dove serve, altrimenti lasciata al bordo sinistro naturale.

### 3. Project card — elevazione
Da "solo il riquadro immagine ha un bordo" a "intera card su superficie bianca unica". Vedi Implementation per i dettagli di classe esatti — include la rimozione del doppio bordo (l'immagine interna perde il proprio `border`, dato che ora il bordo/ombra sta sulla card esterna) e la rimozione del padding orizzontale duplicato su `CardHeader`/`CardContent` (`px-5` → rimosso, il padding ora viene dalla card esterna). **"Coming soon" resta invariata** (bordo dashed, nessuna superficie bianca, nessuna ombra).

### 4-5. Altri punti
Applicazione diretta di classi Tailwind arbitrary-value ai selettori già identificati in Implementation — nessuna decisione di design aggiuntiva da prendere, sono valori letterali forniti dall'utente.

---

## Implementation

1. `messages/en.json` e `messages/it.json` — namespace `hero`: aggiungere `"ctaProjects": "View projects"`, `"ctaContact": "Get in touch"` (EN) e `"ctaProjects": "Progetti"`, `"ctaContact": "Contattami"` (IT, confermato dall'utente).

2. `components/hero.tsx` — dentro il div colonna testo (`<div className="flex flex-col items-center gap-... lg:items-start ...">`), subito dopo il `<p>` del body: aggiungere
   ```
   <div className="flex flex-wrap items-center gap-3">
     <a href="#projects" className="rounded-full bg-accent-blue px-[26px] py-[12px] text-[15px] font-bold text-on-accent transition-[filter] duration-200 hover:brightness-[0.94]">{t("ctaProjects")}</a>
     <a href="#contacts" className="rounded-full border-[1.5px] border-black/20 px-[26px] py-[12px] text-[15px] font-bold text-heading transition-colors duration-200 hover:bg-muted">{t("ctaContact")}</a>
   </div>
   ```

3. `components/accordion-section-heading.tsx` — aggiungere props opzionali `barColorClass?: string` e `barAlign?: "center" | "start"` (default `"center"`). Aggiungere due `<span aria-hidden="true">` decorativi (uno per il ramo desktop `hidden lg:block`, uno per il ramo mobile `lg:hidden`, come sibling — non figli — dell'h2/Accordion.Header esistenti, per non toccare la struttura attuale): classi `mt-[14px] h-[5px] w-[52px] rounded-full` + `barColorClass`, con `mx-auto` aggiunto solo quando `barAlign === "center"`. Renderizzati solo se `barColorClass` è passato (nessuna barra se omesso — nessuna sezione futura rotta di default).

4. Call site aggiornamenti — passare `barColorClass`/`barAlign`:
   - `components/projects-section.tsx`: `<AccordionSectionHeading title={t("heading")} barColorClass="bg-accent-blue" />`
   - `components/education-section.tsx`: `<AccordionSectionHeading title={t("heading")} barColorClass="bg-accent-red" />`
   - `components/experience-section.tsx`: `<AccordionSectionHeading title={t("heading")} barColorClass="bg-accent-purple" barAlign="start" />`
   - `components/skills-section.tsx`: `<AccordionSectionHeading title={t("heading")} className="text-center" barColorClass="bg-accent-green" />`

5. `components/about-section.tsx` — replicare manualmente la stessa barra (non usa il componente condiviso): aggiungere lo stesso `<span>` (`bg-[oklch(0.8655_0.1595_96)]`, nessun `mx-auto`) subito dopo entrambe le occorrenze dell'heading (`hidden lg:block` e dentro l'`Accordion.Header render={<h2 className="lg:hidden .../>}`), stesso pattern sibling del punto 3.

6. `components/projects-section.tsx`, funzione `ProjectCard`:
   - Wrapper `<a>`/`<Link>`: className semplificata a `"group block"` (rimuovere `transition-transform duration-200 hover:scale-[1.02]`, sostituito dal punto sotto).
   - `<Card className="...">`: sostituire l'intera className con `"h-full items-center gap-4 rounded-[28px] border border-[rgba(0,0,0,.07)] bg-white p-[14px_14px_26px] text-center shadow-[0_10px_30px_rgba(0,0,0,.08)] ring-0 transition-[transform,box-shadow] duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_18px_44px_rgba(0,0,0,.12)]"` (rimuove `rounded-none border-0 bg-transparent p-0 overflow-visible`, che tornano al default di `Card` — `rounded-xl`/`overflow-hidden` vengono comunque sovrascritti da `rounded-[28px]` esplicito).
   - Div immagine interna: `"relative aspect-[16/10] w-full overflow-hidden rounded-[20px] bg-muted"` (era `rounded-[28px] border border-black/10 bg-muted` — il bordo si rimuove, ora sta sulla card esterna).
   - `CardHeader`: rimuovere `px-5` (padding ora dato dalla card esterna).
   - `CardContent`: rimuovere `px-5`.
   - `ComingSoonCard`: nessuna modifica.

7. `components/education-list.tsx`:
   - Div "Left Panel": quando `selected?.logoUrl` è presente, sostituire `"bg-transparent"` con `"border border-[rgba(0,0,0,.07)] bg-white shadow-[0_10px_30px_rgba(0,0,0,.07)]"` (il ramo `else` con `bg-accent-blue`, usato quando non c'è logo, resta invariato).
   - Bottone voce lista: quando `isSelected`, aggiungere `bg-white shadow-[0_10px_28px_rgba(0,0,0,.09)]` e portare `border-l-[3px]` a `border-l-4` **solo per lo stato selezionato** (il ramo non-selezionato resta `border-l-[3px] border-border`).

8. `components/nav.tsx` — sul div pillola (riga con `border border-black/15 bg-background shadow-md`): sostituire `bg-background shadow-md` con `bg-white/[0.92] shadow-[0_6px_20px_rgba(0,0,0,.10)] backdrop-blur-md`.

9. `components/experience-timeline.tsx` — sul grande pallino condiviso (`<span className="size-4 shrink-0 rounded-full bg-accent-purple" ...>`, riga ~75): aggiungere `shadow-[0_0_0_4px_rgba(255,255,255,.9)]`.

10. `components/skills-section.tsx` — sulla className delle pillole Approach (riga ~115, dentro il template string): aggiungere `shadow-[0_6px_16px_rgba(0,0,0,.10)]`.

11. `components/about-section.tsx` — sul wrapper immagine collage (`rounded-[20px]`): aggiungere `shadow-[0_14px_40px_rgba(0,0,0,.14)]`.

12. `context/ui_context.md` — aggiornare la sotto-sezione "Elevazione" (o crearla se non presente) documentando tutti i nuovi valori shadow/bg introdotti in questa unit, e aggiungere una nuova nota sulla accent bar sotto gli heading di sezione (mapping colore↔sezione dalla tabella in Design).

---

## Dependencies

Nessuna nuova dipendenza.

---

## Scope Limits

- Nessun cambio a copy (a parte le due nuove stringhe CTA, esplicitamente richieste), layout, palette o struttura delle sezioni.
- Non toccare l'immagine Hero su mobile (rimozione immagine mobile — richiesta separata dell'utente, unit propria).
- Non toccare il contrasto tra sfondi sezione (`bg-black/[0.03]` ecc.) oltre a quanto già specificato qui.
- Non estendere l'elevazione a Certificates, Footer/Contacts, "Coming soon" card — restano piatti come oggi.
- Non toccare `projects-section.tsx` per il badge data (punto 6 della richiesta utente) — già implementato, vedi Architecture.
---

## Check When Done

- Hero: due CTA visibili sotto il body text, colori/hover corretti, link funzionanti verso `#projects`/`#contacts`, EN e IT.
- Ogni sezione (Projects/Education/Experience/Skills/About) mostra la barra colorata corretta, nell'allineamento corretto, sia su desktop (`lg:block`) che sull'heading mobile-accordion (`lg:hidden`).
- Project card: intera card su superficie bianca con bordo/ombra, hover solleva la card (`translateY` + ombra più marcata, non più scale), "Coming soon" invariata.
- Education: voce selezionata ha sfondo bianco + ombra + bordo sinistro 4px; pannello logo (quando presente) è una card bianca con bordo/ombra; il pannello a tinta piena (nessun logo) resta invariato.
- Nav pill: ombra più marcata, sfondo bianco semi-traslucido con blur, visibile su scroll.
- Timeline Experience: i grandi pallini sulla linea condivisa hanno l'anello bianco che li stacca dalla linea dotted.
- Skills: pillole Approach con ombra visibile.
- About: collage con ombra visibile (nota: coerente con quanto già confermato — l'utente in una sessione precedente aveva chiesto di **non** avere ombra sul collage About; questo punto la reintroduce esplicitamente per questa unit, quindi va bene, ma segnalarlo se sembra in contraddizione in fase di review).
- `npm run build` passa.
- Verifica visiva in browser (screenshot), non solo `curl` — tutte le modifiche sono puramente visive.
