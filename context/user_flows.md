# Portfolio — User Flows, Screens, States

**Basato su:** PRD Portfolio (v1)

## 1. User Flows

### Flow 1 — Recruiter, percorso standard

1. Apre la homepage: hero con nome, ruolo, breve testo e screenshot progetti in evidenza.
2. Sotto la hero appare la nav (Projects, Education, Experience, Skills, About, Contacts) — resta visibile per un breve tratto di scroll, poi si aggancia in cima allo schermo (sticky) quando raggiunge il top.
3. Scorre o naviga via nav tra le sezioni: Projects, Education, Experience, Skills, About, Contacts.
4. Clicca su una card progetto (sezione Projects).
5. Apre la Project Detail Page.
6. Legge il case study (screenshot, diagrammi, testo).
7. Da qui: link a GitHub del progetto, oppure torna alla homepage.
8. Da homepage: visita LinkedIn, GitHub profilo, o scarica CV (accessibili da nav sticky in qualsiasi punto dello scroll).
9. Contatta (email/LinkedIn — canale esterno, non gestito dal sito).

_Nota — sezione About:_ contenuto personale, non lavorativo — poche righe di testo + alcune foto.

### Flow 2 — Recruiter, accesso diretto a un progetto

1. Arriva via link diretto a una Project Detail Page (es. condiviso da terzi).
2. Legge il case study.
3. Torna alla homepage per il contesto generale (ruolo, contatti).

_Nota:_ non esiste una pagina "Tutti i progetti" — le project page sono raggiungibili solo tramite card in homepage (confermato).

### Flow 3 — Cambio lingua

Route dedicate (next-intl, App Router): `/en/...` e `/it/...`. Middleware gestisce prefisso mancante o non valido con redirect alla lingua di default.

1. Utente arriva su un URL con prefisso lingua (es. `/it/progetti/getnif`) o senza prefisso.
2. Se senza prefisso o con prefisso non valido: middleware redirige alla lingua di default.
3. Utente naviga tra homepage e project detail mantenendo il prefisso lingua nell'URL.
4. Switch lingua: naviga verso l'equivalente URL con l'altro prefisso.

## 2. Screen List

| Screen              | Scopo                                                                                                | Note                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Homepage            | Single-page con sezioni ancorate: Hero, Projects, Education, Experience, Skills, About, Contacts | Nav sticky dopo la hero; unico entry point principale |
| Project Detail Page | Case study singolo progetto (dinamica, una per progetto)                                             | Raggiungibile solo da homepage                        |
| 404 / Not Found     | Slug progetto inesistente o URL errato                                                               | Necessaria anche in un sito statico                   |

Non previste (out of scope da PRD): pagina "Tutti i progetti", pagina Contatti dedicata (i contatti sono sempre visibili, non una pagina a parte), blog, dashboard.

## 3. Loading States

Sito statico, senza backend API (confermato da PRD) → loading states limitati.

| Contesto                                 | Stato loading                                                                             |
| ---------------------------------------- | ----------------------------------------------------------------------------------------- |
| Navigazione Homepage → Project Detail    | Transizione pagina (da definire se con skeleton o istantanea, dipende da implementazione) |
| Immagini/screenshot nella Project Detail | Placeholder durante il caricamento immagine (lazy loading)                                |
| Download CV                              | Nessuno stato particolare richiesto: è un file statico, avvio download immediato          |

## 4. Error States

| Contesto                              | Errore            | Comportamento                                                 |
| ------------------------------------- | ----------------- | ------------------------------------------------------------- |
| URL progetto inesistente              | 404               | Redirect a schermata 404 con link per tornare in homepage     |
| Immagine screenshot non disponibile   | Immagine rotta    | Fallback visivo (placeholder), nessun blocco della pagina     |
| Link CV non raggiungibile             | File mancante/404 | Da definire: messaggio di errore o link disabilitato — aperto |
| Prefisso lingua mancante o non valido | Redirect          | Middleware redirige alla lingua di default                    |

## 5. Empty States

| Contesto                           | Caso                                                | Comportamento                                   |
| ---------------------------------- | --------------------------------------------------- | ----------------------------------------------- |
| Homepage senza progetti pubblicati | Sezione progetti vuota (es. fase iniziale del sito) | Da definire se rilevante per il lancio — aperto |

## 6. Adattamenti Mobile

| Elemento   | Desktop                        | Mobile                              |
| ---------- | ------------------------------ | ----------------------------------- |
| Nav        | Pillola orizzontale con 6 voci | Hamburger menu                      |
| Experience | Timeline orizzontale           | Stack verticale (lista cronologica) |

## Punti aperti

- Comportamento in caso di link CV non raggiungibile.
- Se serve gestire lo stato "nessun progetto pubblicato" (probabilmente non rilevante se il sito va live con almeno un progetto).
