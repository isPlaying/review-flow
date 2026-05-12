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
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
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
pnpm antd:migrate # run Ant Design migration assistant
pnpm antd:mcp    # start Ant Design MCP server
pnpm antd:guard  # project-level guard for common deprecated AntD patterns
pnpm check:antd  # run antd guard + lint + typecheck
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

## Ant Design AI Tooling

- `@ant-design/cli` is installed and wired into project scripts.
- `.mcp.json` is included to expose Ant Design MCP in MCP-compatible clients.
- MCP server command: `pnpm antd:mcp`

Note:
- Use `pnpm antd:guard` / `pnpm check:antd` as the stable way to enforce Ant Design compatibility in this project.
