# ReviewFlow Frontend

ReviewFlow is a lightweight, production-style document review frontend built with Next.js.

## Tech Stack

- Next.js (App Router)
- TypeScript
- TanStack Query
- React Hook Form
- Zustand
- Ant Design
- Axios
- pnpm
- Biome
- Husky
- lint-staged

## MVP Scope

The current MVP focuses on:

- Login
- Document list and detail
- PDF preview
- Comments
- Solid engineering practices

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=https://jsonplaceholder.typicode.com
```

If not provided, the app falls back to the same default URL.

### 3. Run the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
pnpm dev         # start dev server
pnpm build       # build for production
pnpm start       # run production server
pnpm lint        # run Biome checks
pnpm lint:fix    # run Biome checks with auto-fix
pnpm format      # format files via Biome
pnpm typecheck   # run TypeScript type check
pnpm check       # lint + typecheck
```

## Project Structure

```text
src/
  app/           # Next.js App Router pages and layouts
  components/    # shared UI components
  features/      # feature modules (api, hooks, components, types)
  lib/           # shared utilities and axios instance
  providers/     # app-level providers
  store/         # zustand stores (UI-only state)
  types/         # shared TypeScript types
```

## Engineering Workflow

- `husky` + `lint-staged` are enabled
- `pre-commit` runs Biome checks on staged files
- Use Conventional Commits for commit messages

See commit message conventions:

- [Commit Message Guide](/Users/user/Desktop/review-flow/docs/commit-message-guide.md)
