# These are NOT the versions you know

Next.js 16.3, TypeScript 7.0, next-intl 4.13, and shadcn/ui were all released or updated after your training data. APIs, conventions, and defaults may differ from what you expect.

- **Next.js:** read `node_modules/next/dist/docs/` (version-matched docs ship with 16.3+) before writing routing/proxy code.
- **next-intl, shadcn/ui:** no bundled docs — check the official docs online (`next-intl.dev`, `ui.shadcn.com`), dated August 2026, before implementing. Do not rely on memory or training.
- See `context/architecture_context.md` for breaking changes already identified (`proxy.ts` replacing `middleware.ts`, shadcn's Base UI default). Heed deprecation notices.

## Application Building Context

Read the following files in order now and before implementing or making any architectural decision:

- `context/project_overview.md`
- `context/user_flows.md`
- `context/ui_context.md`
- `context/architecture_context.md`
- `context/progress_tracker.md`
- `context/workflow.md`

## Rules

- Non modificare `components/ui/*` (shadcn) a meno che il task lo richieda esplicitamente.
- Se un requisito è ambiguo o mancante, chiedi — non inventare comportamento o decisioni non documentate.
- Se l'implementazione cambia architettura, scope, o UI system, chiedi sempre a me come prima cosa, poi aggiorna il relativo file in `context/` prima di continuare.
- Dopo ogni step di implementazione, aggiorna `context/progress_tracker.md` seguendo il template — compatto, preciso, diretto, niente prosa.
- Prima di passare allo step successivo, verifica che l'implementazione funzioni end-to-end (unit test + integration test dove applicabile).
- Tailwind CSS: nessuna doc bundled — verifica tailwindcss.com (versione
  4.1.x, agosto 2026) prima di implementare responsive/fluid design.
  Non affidarti a pattern di breakpoint fissi da versioni precedenti.

## Scoping

- Un feature unit alla volta — abbastanza piccolo da verificare end-to-end in una sessione.
- Split se uno step unisce: UI + persistenza dati, stato client + logica server, più di uno screen/flow, comportamento non definito nei context file.

## Requisiti mancanti

- Non inventare mai assolutamente o assumere alcun comportamento non definito nei context file.
- Ambiguo → scrivi l'interpretazione risolta nel context file pertinente prima di implementare.
- Mancante → logga come open question in `progress_tracker.md` (blocking: sì/no) prima di continuare.

## Fine step

- Dopo ogni step di implementazione, aggiorna `context/progress_tracker.md` seguendo il template — compatto, preciso, diretto, niente prosa.
- Prima di passare allo step successivo, verifica che l'implementazione funzioni end-to-end (unit test + integration test dove applicabile).
