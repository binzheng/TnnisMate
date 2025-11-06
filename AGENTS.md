# Repository Guidelines

## Project Structure & Module Organization
Application code lives under `src/`, broken into `src/features` for domain flows, `src/components` for shared UI, and `src/lib` for cross-cutting utilities. Keep feature-specific hooks, context, and styles co-located with their parent feature. Unit and integration specs reside in `src/__tests__`, mirroring the directory tree of the code under test. Static assets stay in `public/`; reference them via relative paths instead of imports. Automation scaffolding is kept in `.specify/`, and agent prompt assets in `.codex/`—update those only when altering tooling.

## Build, Test, and Development Commands
Use `npm install` after cloning to sync dependencies. `npm run dev` launches the Vite-powered dev server with hot reload. `npm run build` creates an optimized production bundle in `dist/`, and `npm run preview` serves that bundle locally. Run `npm run lint` before committing to ensure ESLint/Prettier alignment. Execute `npm run test` for the Vitest suite; append `--watch` while iterating on a feature.

## Coding Style & Naming Conventions
The project targets TypeScript with 2-space indentation and trailing commas enabled via Prettier. Favor functional React components, named exports, and top-level `PascalCase` for component files (e.g., `UserCard.tsx`) while hooks stay `useSomething.ts`. Co-locate CSS Modules or styled-component definitions with their owning component. When introducing new modules, update barrel files only when they reduce import churn.

## Testing Guidelines
Vitest and React Testing Library drive the test harness. Name specs `*.test.ts(x)` to keep discovery automatic. Add scenario-focused tests that assert user-facing behavior rather than implementation details. Maintain ≥80% line coverage for modified files; check with `npm run test -- --coverage`. Record fixtures under `src/__tests__/fixtures` and clean them up after use to avoid cross-test coupling.

## Commit & Pull Request Guidelines
Follow Conventional Commit semantics (`feat:`, `fix:`, `refactor:`, `chore:`) so downstream automation remains predictable. Keep commits focused, explain the intent in the subject, and leave implementation notes in the body when edge cases apply. Pull requests must include: a concise summary, screenshots or GIFs for UI-visible changes, linked issue IDs, and a checklist of validation steps. Request review once tests pass locally and lint warnings are resolved.

## Security & Configuration Tips
Store secrets in `.env.local` only; never commit them. Document new environment keys in `.env.example` with safe defaults. Review third-party packages for maintenance status before introducing them, and prefer first-party Vite plugins when available.
