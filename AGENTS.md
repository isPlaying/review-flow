<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Project overview

This repository contains ReviewFlow, a document review frontend built with Next.js.
The current goal is to build a lightweight but production-style demo with:

- login
- document list/detail
- PDF preview
- comments
- solid engineering practices

## Repo structure

- `src/app`: App Router pages and layouts
- `src/components`: shared UI components
- `src/features`: feature modules (UI, api, hooks, types)
- `src/lib`: shared utilities and Axios instance
- `src/providers`: app-level providers (query/theme)
- `src/store`: Zustand stores (UI state only)
- `src/types`: shared TypeScript types

## Feature folder convention

For each domain feature, prefer this shape:

- `src/features/<feature>/api.ts`: HTTP calls for the feature
- `src/features/<feature>/hooks.ts`: TanStack Query hooks
- `src/features/<feature>/components/*`: feature-local UI
- `src/features/<feature>/types.ts`: feature-local types

## Run commands

- install: `pnpm install`
- dev: `pnpm dev`
- build: `pnpm build`
- lint: `pnpm lint`
- format: `pnpm format`
- typecheck: `pnpm typecheck`
- check: `pnpm check`

## Tech stack

- Next.js
- TypeScript
- TanStack Query for server state
- React Hook Form for forms
- Zustand for UI state
- Ant Design for UI
- Axios for HTTP requests
- Biome for formatting and linting

## Conventions

- Use TypeScript strict mode
- Avoid `any` unless justified in code comments
- Keep server state in TanStack Query
- Keep form state in React Hook Form
- Keep UI-only state in Zustand
- Put API calls under `features/*/api.ts`
- Use path aliases like `@/components`, `@/features`, `@/lib`
- Keep components under ~200 lines when possible; split when too complex

## Data and networking rules

- Use `src/lib/http.ts` Axios instance for all app API requests
- Do not call `fetch` directly for app business APIs unless explicitly required
- Normalize API errors in one place and show user-friendly messages
- For list/detail pages, always define loading, empty, and error states

## State boundaries

- TanStack Query: server cache, pagination, invalidation
- React Hook Form: form values, validation, submission state
- Zustand: transient UI state (drawer open, selected panel, filters UI)
- Never duplicate the same server data in Zustand

## UI and styling rules

- Ant Design is the only UI component library
- Styling strategy: CSS Modules + `src/app/globals.css`
- Keep visual style simple, consistent, and business-oriented
- Prefer accessible defaults (`aria-*`, semantic structure, keyboard flows)
- Ant Design usage must follow the version declared in `package.json` (currently `antd@6.x`)
- Do not use deprecated/legacy Ant Design props or APIs from older versions
- Before introducing or modifying Ant Design components, verify APIs against the current official docs for the installed version
- If deprecated usage is found, migrate it immediately as part of the same change

## Do

- keep components small and focused
- prefer feature-based organization
- add clear loading / empty / error states
- reuse shared types when possible
- add lightweight inline comments for non-obvious logic

## Don’t

- do not store server data in Zustand
- do not bypass the axios instance for app API calls
- do not introduce a second UI library
- do not add heavy features before the MVP is stable
- do not perform large refactors in feature tickets unless requested

## Definition of done

A task is done when:

- the feature works locally
- types pass
- lint passes
- formatting is clean
- the code matches repository conventions
- key user paths are manually verified and recorded in PR notes

## PR checklist

Include in PR description:

- what changed
- why it changed
- screenshots or short screen recording for UI changes
- risk and rollback notes
- manual test steps

## Git conventions

- branch naming: `feat/*`, `fix/*`, `chore/*`
- commit style: Conventional Commits (`feat:`, `fix:`, `chore:`)

## Safety boundaries

- do not run destructive git operations unless explicitly requested
- do not modify secrets or infrastructure files unless task requires it
- prefer minimal, scoped edits over broad rewrites
