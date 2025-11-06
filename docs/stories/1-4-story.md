# Story 1.4: to connect Prisma to Neon(PostgreSQL) and create initial

Status: drafted

## Story

As a developer,
I want to connect Prisma to Neon(PostgreSQL) and create initial schema,
so that データを安全に保存できる。.

## Acceptance Criteria

1. Given `DATABASE_URL` が設定され When `prisma migrate dev` を実行 Then User/Facility/Court の初期テーブルが作成される

## Tasks / Subtasks

- [ ] Implement per acceptance criteria

## Dev Notes

- Technical Notes: Prisma schema 初期化 / Neon 接続確認 / 基本リレーション定義
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
