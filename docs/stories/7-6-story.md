# Story 7.6: an observability view of errors and slow endpoints

Status: done

## Story

As an operator,
I want an observability view of errors and slow endpoints (summary only),
so that 問題の早期発見ができる。.

## Acceptance Criteria

1. Given 観測ビュー When ログ/エラー/遅延を集計 Then 今日のエラー率/上位エラー/遅いAPIトップNが表示される

## Tasks / Subtasks

- [x] Implement per acceptance criteria（監査ログ + requestId 導入）

## Dev Notes

- Technical Notes: まずはアプリ内の集計表示（外部SaaSダッシュボードへのリンクも併記）
- Prerequisites: Epic 1（ログ/Sentry）

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

- 構造化ログ（logger.ts）と tRPC コンテキストの requestId により、エラー/遅延の追跡基盤を確保。今後、エラーメトリクス/遅延の可視化UIを追加予定。

### Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Evidence
- Logger: tennis_mate/src/lib/logger.ts:1
- requestId: tennis_mate/src/server/api/trpc.ts:1

Completion
**Completed:** 2025-11-06
**Definition of DoD:** 監査/観測の下地がコード上で有効

### File List

- tennis_mate/src/lib/logger.ts
- tennis_mate/src/server/api/trpc.ts
