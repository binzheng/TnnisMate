# Story 2.8: audit logging for reservation lifecycle

Status: done

## Story

As a developer,
I want audit logging for reservation lifecycle,
so that 重要操作の追跡ができる。.

## Acceptance Criteria

1. Given 生成/変更/キャンセルが行われる When サーバが処理 Then 構造化ログ（level,msg,userId,role,resource,requestId）が出力される

## Tasks / Subtasks

- [x] Implement per acceptance criteria（生成/変更/キャンセル時に構造化監査ログを出力）

## Dev Notes

- Technical Notes: PIIを出力しない / requestId 付与
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

### Completion Notes
**Completed:** 2025-11-06
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

### Debug Log References

N/A

### Completion Notes List

- tRPC コンテキストに `requestId` を付与し、予約ライフサイクル（create/update/cancel）各ミューテーションで `audit()` を呼び出して構造化ログを出力。PIIは記録せず、必要なキーに限定。

### File List

- tennis_mate/src/lib/logger.ts
- tennis_mate/src/server/api/trpc.ts
- tennis_mate/src/server/api/routers/reservations.ts

## Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Summary:
- 予約生成/変更/キャンセル（tRPCミューテーション）で構造化監査ログを出力。フィールドは `level,msg,userId,role,resource,requestId,meta`。`requestId` は tRPC コンテキストで生成。PIIは含めない。

Acceptance Criteria Validation（証跡）
1) 生成/変更/キャンセル時のサーバ処理 → 構造化ログ
   - `audit()` 実装: tennis_mate/src/lib/logger.ts
   - requestId 付与: tennis_mate/src/server/api/trpc.ts（crypto.randomUUID）
   - create: tennis_mate/src/server/api/routers/reservations.ts:…（createReservation → audit level=info,msg=reservation.create,…）
   - update: 同（updateReservation → reservation.update）
   - cancel: 同（cancelReservation → reservation.cancel）

Notes
- 役割（role）はDBからbest-effort取得。セッション拡張時は直接注入に切替可能。
- 将来: ログ出力先をConsole→外部集約（Vercel Logs/Sentry/Datadog）に切替。

Change Log
- 初回レビューで承認（Approve）。
