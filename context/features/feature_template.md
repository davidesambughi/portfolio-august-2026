## This file has to be written precisely, clearly , and concisely. Do not add , assume or invent, but ask for more information if you need it .

# [NN] — [Feature Unit Name]

<!-- Naming convention: NN is a zero-padded number that defines the build order.
     The number IS the dependency chain — lower numbers must be complete before higher ones start.
     Name the file after the responsibility, not the technology.
     Examples: 03-auth.md, 11-base-canvas.md, 22-design-agent-api.md -->

<!-- Opening line (required): tell the AI which context files to read before starting.
     Only list the files actually relevant to this unit.
     Always include AGENTS.md. Add others as needed. -->

<!-- One-sentence summary (required): what this unit does, in plain language.
     Write it as a statement of outcome, not a list of tasks.
     Example: "Replace the canvas placeholder with a Liveblocks-backed React Flow canvas." -->

[One sentence describing what this unit does and why it exists at this point in the build.]

---

## Architecture, rules and constraints

<!-- Include this section what you learned from the context files to be coherent and consistent ! -->

## Design

<!-- Include this section only if this unit involves UI work where visual decisions need to be made.
     If the design is fully defined in ui-context.md, reference it and skip this section.
     If there are layout or visual decisions specific to this feature, define them here.

     Be precise: layouts, breakpoints, what not to include (no gradients, no scroll-heavy layouts, etc.).
     The AI will interpret silence as permission — if you don't want something, say so explicitly. -->

[Describe the visual and layout decisions for this unit. Remove section if no UI work.]

---

## Implementation

<!-- Numbered steps. Each step is one discrete action: create a file, add a route, wire a provider, etc.
     Order matters — steps are executed sequentially.
     Be specific: name the file, name the route, name the function, name the field.
     Do not describe HOW to implement (the AI knows); describe WHAT to create and WHAT it should do. -->

1. [First discrete action — be specific about file path, route, or function name]

2. [Second action]

   <!-- Nest sub-steps when a single action has multiple parts that belong together -->
   - [sub-step]
   - [sub-step]

3. [Third action]

4. [Continue as needed]

---

## Dependencies

<!-- Include this section only if this unit requires installing new packages.
     List the exact package names. No version pinning unless a specific version is required.
     Do not list packages already in the project. -->

Install: `package-name`, `other-package`

---

## Scope Limits

<!-- Required. This is the most important section for preventing scope creep.
     List everything that is NOT part of this unit — even things that seem obviously related.
     Each item: what is excluded + optionally when it will be added.

     The AI will build adjacent things unless told not to. Be explicit.
     Examples:
     - "don't add AI logic yet — that's covered in [NN]-[name].md"
     - "don't add persistence — keep this focused on the UI shell only"
     - "don't customize Clerk internals — use default flows" -->

- [What is explicitly excluded from this unit]
- [What is explicitly excluded from this unit]
- Keep this focused on [the narrow responsibility of this unit].

---

## Check When Done

<!-- Required. Verifiable conditions that define "done" for this unit.
     Each item must be checkable — not "it feels right" but "this file exists", "this route returns X", "build passes".
     Always end with: `npm run build` passes.
     The AI uses this list to self-verify before marking the unit complete. -->

- [Specific, verifiable condition]
- [Specific, verifiable condition]
- [Specific, verifiable condition]
- `npm run build` passes.
