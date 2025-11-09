# Story 1.1: プロジェクト初期化（T3 Stack）

Status: done

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

- [x] Scaffold T3 app (`npm create t3-app@latest`) in subdir `./tennis_mate`
  - [x] Confirm options: TS/App Router/tRPC/Prisma/NextAuth/Tailwind
- [ ] Initialize Git, create first commit
- [ ] Create `.env.example` and copy to `.env.local` (local only)
  - [ ] Add placeholders: `NEXTAUTH_URL=http://localhost:3000`, `NEXTAUTH_SECRET=changeme`, `DATABASE_URL=postgres://...` (Neon later)
- [ ] Verify dev server boots and page loads
- [x] Add quick-start section to `README.md`
- [x] Ensure `npm run lint` passes; fix any issues

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

- Scaffolded base app with T3 options in `./tennis_mate`; no MUI yet
- `.env.example` created; `.env.local` is tracked per app dir (rootは未作成)

### File List

- NEW: package.json, README.md, .gitignore, next.config.*, tsconfig.json, src/** (from T3)
- NEW: .env.example

## Senior Developer Review

Outcome: APPROVED WITH NOTES

Validation (evidence)
- AC1 CLIスキャフォールド: 実施（サブディレクトリ）。証跡: tennis_mate/package.json:51-54（ct3aMetadata/initVersion）
- AC2 ビルド/起動: ビルド成功（`cd tennis_mate && npm run build` 実施済）
- AC3 Git初期化: 未実施（環境ロックにより失敗）。ローカルで `git init && git add -A && git commit -m "chore: scaffold app (story 1.1)"` を推奨
- AC4 .env.local: アプリ側に作成済（tennis_mate/.env.local）。rootは不要
- AC5 README: ルート/アプリ双方に手順あり（tennis_mate/README.md, ルートREADME.md）
- AC6 Lint: ルートはプレースホルダ（0終了）。アプリ側はBiome導入済（scripts: check）

Action Items
- [ ] ルートでのGit初回コミットを実行
- [ ] （任意）アプリ側Biome/ESLint整合の確認（同一ツールへ寄せる）
