# Story 1.8: to create tRPC base router with auth middleware

Status: drafted

## Story

As a developer,
I want to create tRPC base router with auth middleware and error shape,
so that API 実装が一貫した規約で進められる。.

## Acceptance Criteria

1. Given tRPC コンテキストで `ctx.session` が提供され When 未認証/権限不足の呼び出し Then `TRPCError`（UNAUTHORIZED/FORBIDDEN）が返る。成功/失敗のshapeが統一される

## Tasks / Subtasks

- [ ] Implement per acceptance criteria

## Dev Notes

- Technical Notes: zod スキーマ / 共通ユーティリティに切り出し
- Prerequisites: Stories 1.3, 1.4

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
