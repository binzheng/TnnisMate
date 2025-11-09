# Story 1.4: to connect Prisma to Neon(PostgreSQL) and create initial

Status: done

## Story

As a developer,
I want to connect Prisma to Neon(PostgreSQL) and create initial schema,
so that データを安全に保存できる。.

## Acceptance Criteria

1. Given `DATABASE_URL` が設定され When Prisma スキーマを整備 Then User/Facility/Court/Reservation/Role の初期モデルが定義される

## Tasks / Subtasks

- [x] Define Prisma models: User(role), Facility, Court, Reservation, VerificationToken, Account, Session
- [x] Add migration and run against Neon (ローカル/CI環境で実施)

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

### Completion Notes
**Completed:** 2025-11-06
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

### Debug Log References

N/A

### Completion Notes List

- TBD

### File List

- TBD
