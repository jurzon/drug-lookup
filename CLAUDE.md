# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

DrugLookup is a mini front-end dashboard for looking up drug information. The drug API integration has not been implemented yet — current `src/main.ts` is a placeholder that renders only `<h1>DrugLookup</h1>`.

**Language policy:** code, comments, commit messages, and this CLAUDE.md are written in English. The README is currently in Slovak and may be translated to English in a future edit. The project owner is Slovak — chat messages in Slovak are expected and you should reply in Slovak unless asked otherwise.

## Commands

```bash
npm install          # install deps (Node 20.19+ / 22+)
npm run dev          # Vite dev server, default http://localhost:5173
npm run build        # tsc typecheck (no emit) + vite build → dist/
npm run preview      # serve the production build locally
```

There is **no test runner, no linter, and no formatter configured.** `npm run build` is the only static check — it fails on TypeScript errors. Do not invent `npm test` / `npm run lint` commands.

## Domain context

This is an **educational project** for practicing Claude Code workflows — it is **not a clinical tool** and must not be presented as one.

- **Planned APIs (all public, no API key):** openFDA Drug Label, openFDA Drug Enforcement, RxNav (RxNorm).
- **Disclaimer rule:** every drug card and every interaction-lookup result rendered in the UI must carry a visible note stating (a) the data is sourced from US authorities (FDA / NIH) and may not match Slovak registrations, and (b) the tool is educational and is not a substitute for AISLP / ŠÚKL / professional medical consultation. This is non-negotiable; do not ship UI that displays drug data without it.
- **Naming:** prefer INN (international non-proprietary name) for active substances over brand names in code, identifiers, and UI labels. Brand names may appear as secondary metadata.

## Architecture

Vanilla TypeScript on top of Vite 8 — no UI framework, no router, no state library. Entry flow:

- `index.html` mounts a single `<div id="app">` and loads `/src/main.ts` as an ES module.
- `src/main.ts` imports `./style.css` (which Vite injects) and writes innerHTML into `#app`.
- `src/style.css` is a minimal reset (system font, `body` margin 0, `#app` padding). Anything richer needs to be added deliberately.

When adding the drug-lookup UI, keep it vanilla DOM (`document.createElement`, `addEventListener`) unless the user explicitly asks for a framework. Network calls should use `fetch` directly.

## TypeScript configuration notes

`tsconfig.json` uses several strict bundler-mode flags that affect how code must be written:

- **`verbatimModuleSyntax: true`** — type-only imports must use `import type { Foo }` (or `import { type Foo }`); a plain `import { Foo }` for a type-only symbol is a compile error.
- **`erasableSyntaxOnly: true`** — TypeScript-only runtime constructs are forbidden: no `enum`, no `namespace` with values, no parameter properties (`constructor(private x: number)`), no `import =`. Use `const` objects / unions / plain class fields instead.
- **`allowImportingTsExtensions: true`** + **`noEmit: true`** — `.ts` extensions in import paths are allowed (Vite resolves them). Emit is handled by Vite/esbuild, not `tsc`.
- **`noUnusedLocals` / `noUnusedParameters`** — unused symbols break the build. Prefix intentionally-unused params with `_`.

## Conventions established in git history

- **Branch is `master`, not `main`** — this was an explicit user decision. Do not rename without being asked.
- **Commit messages use Conventional Commits** (`chore:`, `feat:`, `fix:`, …) based on existing history.
- **`.claude/` is gitignored** as local Claude Code settings — never commit it.
- **Remote `origin`** points to `https://github.com/jurzon/drug-lookup.git`.

## Workflow expectations for this project

- **Plan Mode by default** for non-trivial changes — API integrations, new UI components, multi-file refactors. Small fixes (typos, single-file tweaks) can skip planning.
- **No new dependencies without confirmation.** This is a learning project; prefer vanilla DOM, native `fetch`, and standard browser APIs. Ask before adding anything to `package.json`.
- **Atomic commits in Conventional Commits format** (`feat:`, `fix:`, `chore:`, `docs:`, …) — one logical change per commit, matching existing history.
- **No framework migration** (React / Vue / Svelte / Solid / …) without an explicit request. The vanilla-TS choice is intentional.
