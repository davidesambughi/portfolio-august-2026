# Handoff: Portfolio scrollytelling (davidesambughi.dev)

## Overview
Ridisegno della homepage del portfolio come **scrollytelling**: sette capitoli, ognuno "pinnato" a schermo intero, che avanzano guidati dallo scroll. Obiettivo dichiarato dal proprietario: il sito attuale è piatto e non racconta una storia mentre si scorre.

Due direzioni alternative, stessi colori/font/testi del sito live:
- **A — Capitoli**: fondo chiaro, rail laterale numerato 01–07, progetti in scroll orizzontale dentro lo scroll verticale.
- **B — Dossier**: capitoli neri alternati a chiari, hero a tutto schermo, progetti che si sostituiscono uno sull'altro nel pin.

**Direzione scelta dal proprietario: B — Dossier.** Implementare solo B. La direzione A resta nel bundle come riferimento storico: non va implementata né fusa con B.

## About the Design Files
I file `.dc.html` in questo bundle sono **riferimenti di design creati in HTML**: prototipi che mostrano aspetto e comportamento voluti, non codice di produzione da copiare. Il compito è **ricreare questi design dentro il codebase esistente** — `davidesambughi/portfolio-august-2026`, Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui + next-intl — usando i suoi pattern, i suoi token in `app/globals.css` e i contenuti già presenti in `messages/it.json`, `messages/en.json`, `content/data/*.ts` e `content/projects/**/*.mdx`.

Aprendo i file in un browser si vedono i design dal vivo: si scorre normalmente.

**Non reinventare i contenuti, ma aspettarsi che cambino.** Tutto il testo nei prototipi è copiato verbatim dal repo. Il proprietario ha dichiarato che **riscriverà i testi dopo l'implementazione, lavorando direttamente con Claude Code**: quindi implementare i contenuti come dati, non come markup. Tutte le stringhe restano in `messages/it.json` / `messages/en.json` e in `content/data/*.ts` / `content/projects/**/*.mdx`, i componenti le ricevono via `next-intl` o via props. Nessuna stringa hardcodata nei componenti di capitolo, e nessun layout che si rompa se un titolo o un paragrafo diventa più lungo o più corto: i pannelli pinnati devono reggere una variazione di ±30% sulla lunghezza del testo senza tagli.

## Fidelity
**High-fidelity.** Colori, tipografia, spaziature, durate e curve di easing sono definitivi. Le posizioni e le proporzioni vanno rispettate. Le uniche libertà: scelta della libreria di animazione e struttura dei componenti.

## Effort
Impegno realistico: **1–2 giornate di lavoro** per la direzione scelta, la maggior parte sui pin e sul mobile.

Ordine consigliato, ognuno verificabile da solo:
1. Hook di scroll + un capitolo pinnato (Hero). È il pezzo che sblocca tutti gli altri.
2. Metodo (testo illuminato parola per parola).
3. Progetti (orizzontale in A / sostituzione in B) — il capitolo più delicato.
4. Esperienza (timeline che avanza).
5. Skills (assemblaggio) + badge formazione.
6. Chi sono (parallasse) + Contatti.
7. Mobile: tutti i pin diventano sezioni statiche impilate — layout di riferimento in `Portfolio Scroll B Mobile.dc.html`.

Rischi noti, da affrontare presto:
- **Altezza del viewport.** I capitoli pinnati vanno vincolati in `vh`, non per aspect-ratio: a 540px di altezza il contenuto sfonda. Nei prototipi immagini dei progetti a `min(34vh,300px)` / `min(48vh,420px)`, diagramma a `max-height:20vh`, `min-height:0` sulle colonne flex, gap in `clamp(px, vh, px)`.
- **Lunghezza totale della pagina.** Sommando le altezze dei capitoli si arriva a ~21 viewport in A e ~23 in B. Voluto, ma da provare con un trackpad reale prima di considerarlo finito.
- **SEO.** Il sito è ottimizzato SEO/GEO: tutto il testo deve restare nel DOM lato server. Animare solo `transform`, `opacity` e `color` — mai montare/smontare testo in base allo scroll, mai `display:none` su copy indicizzabile.
- **`prefers-reduced-motion`.** Da implementare: con la preferenza attiva, saltare i pin, rendere i sette capitoli come sezioni statiche impilate e mostrare tutto il testo già al colore pieno (vedi capitolo 02).

## Implementation approach
Il repo ha già `framer-motion` fra le dipendenze: la strada più breve è `useScroll({ target, offset: ["start start", "end end"] })` + `useTransform` per capitolo, con `position: sticky` per il pin.

Struttura di un capitolo, identica per tutti e sette:

```tsx
<section className="relative h-[300vh]">          {/* la "pista" di scroll */}
  <div className="sticky top-0 h-screen overflow-hidden">  {/* il pannello pinnato */}
    ...contenuto animato...
  </div>
</section>
```

L'altezza della pista determina quanto dura il capitolo. Valori usati nei prototipi, in ordine: Hero 260vh (A) / 300vh (B), Metodo 300–340vh, Progetti 560vh (A) / 680vh (B), Esperienza 380vh, Skills 320–340vh, Chi sono 400vh, Contatti 150–160vh.

Il capitolo Progetti è volutamente il più lungo: con piste più corte il progetto cominciava a uscire prima di essere stato letto.

Ogni effetto è funzione di un solo numero: `p`, il progresso 0→1 del capitolo. Nei prototipi è calcolato così (equivalente a `useScroll` di Framer Motion):

```js
const r = section.getBoundingClientRect();
const span = r.height - window.innerHeight;
const p = clamp(-r.top / span, 0, 1);
```

Se si preferisce non usare Framer Motion, un solo listener di scroll con `requestAnimationFrame` e scritture dirette su `style.transform` regge tutta la pagina (è quello che fanno i prototipi). In quel caso: ascoltare lo scroll **in fase di capture** (`document.addEventListener('scroll', h, { capture: true, passive: true })`), non solo su `window`, altrimenti la pagina resta al primo fotogramma quando scorre un contenitore interno.

## Screens / Views

### 01 — Hero
**Scopo**: nome, ruolo, metodo in una frase, due call to action.

**A**: griglia due colonne `minmax(0,1fr) minmax(0,0.92fr)`, testo a sinistra (padding sinistro `clamp(96px,9vw,150px)` per lasciare spazio al rail), `hero-composite-trimmed.png` a destra. Pista 260vh.
- Eyebrow "AI Native": 12px / 700 / letter-spacing 0.22em / uppercase / teal.
- H1 su due righe: `clamp(38px,5.4vw,86px)` / 800 / line-height 0.98 / letter-spacing −0.03em / nero.
- Paragrafo: `clamp(15px,1.15vw,19px)` / line-height 1.6 / max-width 44ch / grigio testo.
- CTA "Progetti": pill blu, testo bianco, 13px 26px, 15px/700. "Contattami": pill con bordo `oklch(0 0 0 / 0.2)`, testo nero.
- Animazioni: colonna immagine `translateY(-p·16vh) scale(1 + p·0.22)`, opacity `1 - p·1.1`; testo in entrata sfalsata (ogni figlio `translateY(34px→0)` + fade, ritardo 0.5 di progresso per indice, 600ms `cubic-bezier(.22,.61,.36,1)`); hint "Scorri" svanisce a `1 - p·8`.

**B**: hero nero a tutto schermo. Pista 300vh. Composite al 70% di larghezza, ancorato a destra, opacity 0.22, sopra un gradiente da `oklch(0 0 0)` al 30% a `oklch(0 0 0 / 0.4)` verso destra.
- H1 "Davide / Sambughi": `clamp(44px,9.5vw,178px)` / 800 / line-height 0.86 / letter-spacing −0.045em / bianco.
- Paragrafo: illuminazione parola per parola (vedi 02), dal grigio `oklch(0.34 0 0)` al bianco.
- Immagine: `scale(1.12 + p·0.16) translateY(-p·30px)`.

### 02 — Metodo
**Scopo**: spiegare lo Specification-Driven Development.

Effetto chiave, in entrambe le direzioni: **testo che appare parola per parola dal nulla**. Implementazione: dividere il paragrafo in `<span>` per parola al mount (una volta, non a ogni frame), poi per ogni parola `i`, con `head = p · 1.3 · n` e `d = head - i`: `d > 0.7` → colore pieno; `0 < d ≤ 0.7` → teal `oklch(0.6149 0.1057 180.86)` (la parola "si accende" al passaggio); `d ≤ 0` → **esattamente il colore dello sfondo**, quindi invisibile: `oklch(1 0 0)` sui capitoli chiari, `oklch(0 0 0)` su quelli scuri. Transizione `color .35s ease` su ogni span. Il testo resta un unico paragrafo nel DOM: indicizzabile e leggibile dagli screen reader.

  **Scelta deliberata del proprietario**, non una svista: le parole non ancora rivelate devono essere invisibili, non grigie. Conseguenza da gestire in implementazione: con `prefers-reduced-motion: reduce`, o se JavaScript non gira, tutte le parole devono partire **già al colore pieno** — altrimenti il paragrafo resta invisibile. Renderizzare quindi il testo a colore pieno lato server e applicare lo stato spento solo dal client, dentro il controllo di reduced-motion.

**A**: paragrafo manifesto `clamp(22px,2.5vw,42px)` / 700 / max-width 24ch, sopra una griglia di quattro fasi (Context, Spec, Code & Test, CI/CD) separate da bordi 1px `oklch(0.92 0 0)` ottenuti con `gap:1px` su fondo grigio. Diagramma del processo in parallasse (fattore 0.06) sotto, `max-height:20vh`.
**B**: numero di capitolo gigante `clamp(70px,10vw,170px)` in `oklch(0.94 0 0)` a sinistra; a destra quattro righe numerate 01–04 divise da bordi orizzontali, in entrata sfalsata da destra (`translateX(60px→0)`); il diagramma si rivela con `clip-path: inset(0 X% 0 0)` da destra a sinistra.

### 03 — Progetti
Tre progetti, dati da `content/projects/{it,en}/*.mdx`: RemoteNIF (Apr 2026), Knowledge Assistant (Ago 2026), Raising Kids In Portugal (Gen 2026). Ogni card: immagine, titolo, data, descrizione (verbatim dal frontmatter), riga stack tecnologico 12px `oklch(0.6 0 0)`.

**A — scroll orizzontale dentro il verticale.** Pista 330vh. Dentro il pin, una riga flex di card larghe `min(46vw,660px)` traslata su X: `translateX(-ease(p) · (scrollWidth - viewportWidth))`, con `ease(t) = t·t·(3-2·t)`. Immagini `height:min(34vh,300px);object-fit:cover`, radius 14px. L'intestazione del capitolo resta ferma sopra.
**B — pannelli che si sostituiscono.** Pista 420vh. Tre pannelli in `position:absolute;inset:0`, ognuno **opaco** (`background` nero) con `z-index: i`, così il successivo copre il precedente. Con `pos = p · (n - 1)` (i centri cadono a p = 0, 0.5, 1) ogni pannello trasla soltanto: `translateY(clamp(i - pos, 0, 1) · 100%)` — entra scorrendo dal basso e si ferma a filo. `pointer-events` solo su `Math.round(pos)`.

  **Non implementarlo come dissolvenza incrociata.** Con pannelli sovrapposti e curve di opacità simmetriche, a metà passaggio i due valori sono per definizione uguali: o entrambi bassi (schermo vuoto) o entrambi alti (due descrizioni progetto sovrapposte e illeggibili). Nessun valore numerico risolve entrambi i casi; la copertura sì, perché in ogni istante c'è esattamente un pannello leggibile. Tre tacche verticali a destra (2×38px) indicano il pannello corrente, indice `Math.round(p · (n - 1))`: bianca l'attiva, `oklch(0.35 0 0)` le altre. Titoli progetto `clamp(30px,4vw,66px)` / 800 / bianco su nero.

### 04 — Esperienza (richiesta esplicita: timeline che avanza con lo scroll)
Pista 380vh. Quattro nodi in griglia `repeat(4,1fr)`: Sambughi Assicurazioni (2014–2019), Cuoco e Chef in Australia (2019–2024), InspectOs (Gen–Giu 2026), Futuro. Dati da `content/data/experience.ts`.
**Richiesta esplicita del proprietario: come nella hero, testo e linea del tempo partono invisibili e si rivelano poco a poco, un nodo per volta.** Niente stato "leggermente visibile" prima dello scroll: a `p = 0` il capitolo mostra solo titolo e numero.

- Binario grigio: linea 2px `oklch(0.93 0 0)` a `top:11px`, `transform-origin:left center`, parte da `scaleX(0)` e cresce con `scaleX(ease(p · 1.15))` — si disegna da sinistra insieme alla linea viola `oklch(0.5 0.24 300)` sovrapposta (stessa formula). Il binario non è mai visibile per intero in anticipo.
- Nodi: pallino 20px con `box-shadow: 0 0 0 6px` del colore di fondo (per "bucare" il binario); il quarto nodo è giallo `oklch(0.8655 0.1595 96)`.
- Rivelazione sequenziale: ogni nodo ha la sua finestra di scroll, con `stride = 0.86 / n` (n = numero di nodi):

  ```js
  const t = ease(clamp((p - i * stride) / (stride * 0.8), 0, 1));
  node.style.opacity   = t;                             // parte da 0, non da 0.2
  node.style.transform = `translate3d(0,${(1 - t) * 22}px,0)`;
  dot.style.transform  = `scale(${0.3 + t * 0.7})`;
  ```

  Con quattro nodi: il primo si rivela nel primo quarto di pista, il secondo nel secondo, e così via; l'ultimo è completo intorno a `p ≈ 0.9`. La finestra di ciascun nodo è l'80% del proprio segmento, quindi la sovrapposizione fra due nodi consecutivi è minima e si legge come una sequenza, non come un'unica apparizione. Transizioni CSS 500ms `ease` su opacity/transform, 400ms sul pallino, per smussare gli scatti fra frame.
- Stato iniziale nel markup: `opacity:0` inline sui nodi e `transform:scaleX(0)` sulle due linee.
- **Fallback obbligatorio** (stesso problema del testo parola-per-parola al capitolo 02): con `prefers-reduced-motion: reduce` o senza JavaScript, nodi e linee devono risultare **pienamente visibili**. Renderizzare lato server con opacity 1 / `scaleX(1)` e applicare lo stato nascosto solo dal client, dentro il controllo di reduced-motion.

### 05 — Skills
Pista 320–340vh. Quattordici tecnologie da `content/data/skills.ts` come pill con bordo, in griglia `repeat(auto-fit, minmax(140px,1fr))`, che **si assemblano da esploso**: per la pill `i`, con `t = ease(clamp(p·2 - i·0.03, 0, 1))` e `k = 1 - t`, `translate(((i%5)-2)·200px·k, (((i·7)%3)-1)·170px·k) rotate(((i%7)-3)·6deg·k)`, opacity `0.12 + t`. Sotto, quattro pill gialle piene (metodologie) in entrata sfalsata da destra.

**Badge formazione — da evidenziare, richiesta esplicita.** Due riquadri con bordo 1.5px nero, radius 12px, padding 12px 18px:
- ITS Marche: logo `its-logo.png` alto 30px + label 12px/600 `oklch(0.5 0 0)` "ITS Marche · Full-Stack Developer & Cloud Specialist" + voto **110** in `clamp(17px,1.5vw,22px)`/800 nero, con "/110" in `oklch(0.6 0 0)`/600.
- PTE Academic: label "PTE Academic · Inglese" + **C1** stessa scala, con "Advanced" 13px `oklch(0.6 0 0)`.
- Terza voce, non evidenziata: "Claude Code in Action · UML (Coursera)", 13px `oklch(0.6 0 0)`.

### 06 — Chi sono
Pista 400vh. Testo da `messages/it.json` (chiave about), illuminato parola per parola. `collage-about.png` in parallasse: immagine alta 124–128% del contenitore, `top:-12%`, `translateY((vh/2 - centro) · fattore)` con fattore 0.12 (A, in una colonna con radius 16px) o 0.16 (B, a tutto schermo con gradiente nero dal basso e testo sopra).

### 07 — Contatti
Pista 150–160vh. Titolo "Costruiamo qualcosa che funziona." illuminato parola per parola, `clamp(32px,5.4vw,92px)` / 800 / letter-spacing −0.035em. Tre pill in entrata sfalsata: email piena (nera su chiaro in A, bianca su nero in B), LinkedIn e GitHub con bordo. Indirizzi da `content/data/contacts.ts`.

### Mobile (< 820px) — `Portfolio Scroll B Mobile.dc.html`
Versione **statica e senza JavaScript**: nessun pin, nessun effetto guidato dallo scroll. È il layout da servire sotto 820px e anche il fallback per `prefers-reduced-motion: reduce`. Stessi contenuti, colori e font di B; tutto il testo al colore pieno dal primo frame.

- Colonna unica, `max-width: 430px`, padding orizzontale 20px su ogni capitolo. Nessuna altezza in `vh`: le sezioni sono alte quanto il loro contenuto.
- Barra di navigazione `position: sticky; top: 0` su fondo nero (marchio + "Dossier 2026"), sempre scura: sparisce il calcolo `data-dark` del desktop.
- **01 Hero**: sezione nera, composite al 110% di larghezza ancorato a destra a opacity 0.2 sotto un gradiente verticale; H1 52px / 800 / line-height 0.88; due CTA pill che ancorano a `#m-progetti` e `#m-contatti`, altezza tocco 48px.
- **02 Metodo**: numero 02 in `oklch(0.92 0 0)` accanto al titolo, quattro righe numerate divise da bordi 1px, diagramma del processo a larghezza piena.
- **03 Progetti**: fondo nero, tre card impilate, immagine alta 190px con radius 14px **sopra** il testo (sul desktop è affiancata). Niente sostituzione, niente tacche.
- **04 Esperienza**: la timeline ruota in verticale — linea 2px continua a `left: 9px`, pallini 20px in posizione absolute a `left: -30px`, contenuto indentato di 30px. Tutti i nodi visibili.
- **05 Skills**: pill a capo libero (`flex-wrap`) invece della griglia `auto-fit`; badge formazione impilati a larghezza piena.
- **06 Chi sono**: sezione `min-height: 520px` con il collage in `object-fit: cover` (nessuna parallasse) e gradiente nero dal basso, testo in fondo.
- **07 Contatti**: le tre pill diventano blocchi a larghezza piena impilati, centrati, padding 16px 24px.
- Minimi rispettati: corpo 14–15px, target tocco ≥ 44px, testo bianco pieno su nero (nessun colore alpha sulle copy).

## Interactions & Behavior
- **Soste sui progetti.** Nel capitolo 03, in entrambe le direzioni, il progresso non è lineare: ogni progetto resta fermo a inizio e fine del suo segmento e si muove solo nel 46% centrale. Funzione condivisa:

  ```js
  const dwell = (p, n) => {              // n = numero di progetti
    const steps = Math.max(1, n - 1);
    const raw = clamp(p, 0, 1) * steps;
    const i = Math.min(steps - 1, Math.floor(raw));
    const f = raw - i;
    return i + ease(clamp((f - 0.27) / 0.46, 0, 1));  // ease = smoothstep
  };
  ```

  In A il valore restituito interpola gli `offsetLeft` reali delle card (non una frazione della distanza totale), così ogni sosta allinea la card al padding sinistro. In B pilota direttamente `pos` della copertura e l'indice della tacca attiva.
- Ogni animazione è **guidata dallo scroll**, non a tempo: scorrendo indietro tutto torna indietro. Nessun trigger "una volta sola".
- Transizioni discrete usate: 600ms `cubic-bezier(.22,.61,.36,1)` per le entrate, 400ms `ease` per i nodi della timeline, 350ms `ease` per il colore delle parole, 300ms per le tacche e il rail.
- Easing dei valori continui: `ease(t) = t·t·(3 - 2·t)` (smoothstep).
- **Rail laterale (A)**: sette voci 01–07; la voce attiva è quella la cui sezione attraversa metà viewport → trattino da 22px a 44px e da `oklch(0.85 0 0)` a nero, label da `oklch(0.78 0 0)` a nero. Sotto 1180px di larghezza restano solo i trattini; sotto 820px il rail scompare. Le voci sono ancore: navigano al capitolo.
- **Barra di progresso (B)**: 3px in cima, `scaleX` sul progresso totale del documento, teal.
- **Nav (B)**: il marchio passa a bianco sui capitoli scuri. Marcare le sezioni con un attributo (`data-dark`) e leggere quello, non ispezionare gli stili inline.
- **Responsive**: sotto 820px le griglie a due colonne si impilano; le card progetti passano a 82vw. In produzione, sotto 820px conviene disattivare i pin e rendere i sette capitoli come sezioni statiche impilate con un semplice reveal in entrata — è anche il fallback per `prefers-reduced-motion`.

## State Management
Nessuno stato applicativo. L'unico stato è la posizione di scroll, letta dal browser. Un solo hook condiviso (`useChapterProgress(ref)` → `p`) serve tutti e sette i capitoli. Nessun data fetching: i contenuti sono già statici nel repo.

## Design Tokens
Presi da `app/globals.css` del repo — nessun colore nuovo è stato inventato.

| Ruolo | Valore |
| --- | --- |
| Fondo chiaro | `oklch(1 0 0)` |
| Fondo scuro (capitoli B) | `oklch(0 0 0)` |
| Testo primario | `oklch(0 0 0)` |
| Testo corpo | `oklch(0.4892 0.0051 17.33)` |
| Testo tenue | `oklch(0.6 0 0)` |
| Bordi | `oklch(0.92 0 0)` |
| Accento teal (eyebrow, link, progresso) | `oklch(0.6149 0.1057 180.86)` |
| Accento blu (CTA, RemoteNIF) | `oklch(0.7331 0.1414 253.23)` |
| Viola (timeline, capitolo 02) | `oklch(0.5 0.24 300)` |
| Giallo (metodologie, selection) | `oklch(0.8655 0.1595 96)` |
| Rosso (Knowledge Assistant) | `oklch(0.6578 0.2483 20.82)` |
| Verde (Raising Kids) | `oklch(0.8637 0.2582 161.65)` |
| Testo non ancora rivelato | uguale allo sfondo: `oklch(1 0 0)` su chiaro, `oklch(0 0 0)` su scuro (invisibile per scelta) |

Tipografia: **Geist** (già nel repo), pesi 400/500/700/800. Scala usata: eyebrow 11–12px/700/0.20–0.26em uppercase; corpo 14–15px/1.55–1.6; corpo grande `clamp(15px,1.4vw,22px)`; H2 `clamp(26px,3.4vw,56px)`/800/−0.025em; H1 `clamp(38px,5.4vw,86px)` (A) e `clamp(44px,9.5vw,178px)` (B), 800, −0.03…−0.045em.

Radius: 12px badge, 14px immagini progetti, 16px colonna collage, `9999px` pill. Nessuna ombra tranne `0 0 0 6px` del colore di fondo sui pallini della timeline.

## Assets
Tutte dal repo, cartella `public/images/`, incluse in questo bundle sotto lo stesso percorso:
- `hero-composite-trimmed.png` — composizione hero
- `hero-pc-image.png` — mockup RemoteNIF
- `rag.png` — Knowledge Assistant
- `raising-pc.png` — Raising Kids In Portugal
- `collage-about.png` — collage personale (capitolo 06)
- `its-logo.png` — logo ITS (badge 110/110)
- `remotenif-processo-inglese-soloicone.png` — diagramma del processo in 7 fasi (capitolo 02)

## Files
- `Portfolio Scroll A.dc.html` — direzione A, scartata: solo riferimento.
- `Portfolio Scroll B.dc.html` — **direzione scelta**, desktop, sette capitoli pinnati.
- `Portfolio Scroll B Mobile.dc.html` — direzione B, layout mobile statico (< 820px + fallback reduced-motion).
- `public/images/` — gli asset elencati sopra.

I due file HTML si aprono direttamente nel browser. La logica di scroll di ciascuno è in fondo al file, nel blocco `<script>` della classe `Component`: è la fonte esatta di tutte le formule citate in questo documento.
