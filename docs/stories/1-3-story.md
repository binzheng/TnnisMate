# Story 1.3: to configure NextAuth (Credentials) Prisma Adapter with JWT

Status: drafted

## Story

As a developer,
I want to configure NextAuth (Credentials) + Prisma Adapter with JWT,
so that ログインとRBACの基礎が利用できる。.

## Acceptance Criteria

1. Given `/api/auth/[...nextauth]` が実装され When ユーザーID+パスワードで認証 Then JWT セッションが発行され、`ctx.session` からロール参照できる

## Tasks / Subtasks

- [ ] Implement per acceptance criteria

## Dev Notes

- Technical Notes: bcrypt でハッシュ化 / Prisma User モデルに `role` 追加 / 環境変数 `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- Prerequisites: Story 1.1

### References

- Source: docs/epics.md
- Source: docs/architecture.md
- Source: docs/prd.md

## Dev Agent Record

### Context Reference

<!-- Story Context XML will be attached by story-context workflow -->

### Agent Model Used

N/A

### Debug Log References

N/A

### Completion Notes List

- TBD

### File List

- TBD
