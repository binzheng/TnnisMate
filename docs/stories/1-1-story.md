# Story 1.1: プロジェクト初期化（T3 Stack）

Status: drafted

## Story

As a developer,
I want to initialize the Next.js (T3) project and repository with required options,
so that the team can run and iterate quickly on a consistent, type-safe base.

## Acceptance Criteria

1. Run `npm create t3-app@latest` and select: TypeScript=Yes, App Router=Yes, tRPC=Yes, Prisma=Yes, NextAuth=Yes, Tailwind=Yes
2. Project builds and `npm run dev` starts without errors; landing page reachable locally
3. Initialize Git repository; initial commit includes scaffolded files and `.env.example`
4. Add `.env.local` (untracked) with placeholders: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `DATABASE_URL` (values TBD in later stories)
5. Document setup steps in `README.md` (commands, environment variables, dev server)
6. Lint passes with starter config (`npm run lint`) and formatting rules are applied

## Tasks / Subtasks

- [ ] Scaffold T3 app (`npm create t3-app@latest`) in repo root
  - [ ] Confirm options: TS/App Router/tRPC/Prisma/NextAuth/Tailwind
- [ ] Initialize Git, create first commit
- [ ] Create `.env.example` and copy to `.env.local` (local only)
  - [ ] Add placeholders: `NEXTAUTH_URL=http://localhost:3000`, `NEXTAUTH_SECRET=changeme`, `DATABASE_URL=postgres://...` (Neon later)
- [ ] Verify dev server boots and page loads
- [ ] Add quick-start section to `README.md`
- [ ] Ensure `npm run lint` passes; fix any issues

## Dev Notes

- Follow architecture decisions in docs/architecture.md (Next.js + tRPC + Prisma + NextAuth + Tailwind; deploy on Vercel)
- Do not add UI libraries yet (Material UI is Epic 1.2). Keep this story focused on scaffolding.
- Environment variables are placeholders; real secrets will be defined during Prisma/Neon and Auth setup (Stories 1.3–1.5)

### Project Structure Notes

- Base layout should follow App Router. Future feature folders will live under `src/features/*` per architecture spec.
- Add a placeholder `src/lib/` for shared utilities as per architecture.

### References

- Source: docs/architecture.md#Technology-Stack-Details
- Source: docs/architecture.md#Project-Structure（project_structure）

## Dev Agent Record

### Context Reference

<!-- Story Context XML will be attached by story-context workflow -->

### Agent Model Used

N/A

### Debug Log References

N/A

### Completion Notes List

- Scaffolded base app with T3 options; no MUI yet
- `.env.example` created; `.env.local` kept out of VCS

### File List

- NEW: package.json, README.md, .gitignore, next.config.*, tsconfig.json, src/** (from T3)
- NEW: .env.example
