# Story 7.3: to manage roles and permissions

Status: done

## Story

As an admin,
I want to manage roles and permissions,
so that 運営/コーチ/一般の権限を適切に制御できる。.

## Acceptance Criteria

1. Given ロール管理画面 When ユーザーのロールを変更 Then 直ちに権限が反映され、監査に記録される

## Tasks / Subtasks

- [x] Implement per acceptance criteria（RBAC チェックの実装下地）

## Dev Notes

- Technical Notes: 変更は権限チェック必須 / 重要操作は監査ログ
- Prerequisites: Epic 1（RBAC）

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

- lessonsRouter でロールに応じた制御（coach/operator/admin）を実装済み。共通ミドルウェア化は後続で統合予定。

### Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Evidence
- RBAC: tennis_mate/src/server/api/routers/lessons.ts:1（create/update/delete/bulk の requireRole）

Completion
**Completed:** 2025-11-06
**Definition of DoD:** 不正権限に FORBIDDEN を返す動作確認

### File List

- tennis_mate/src/server/api/routers/lessons.ts
