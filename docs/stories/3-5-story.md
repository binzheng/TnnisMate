# Story 3.5: to enforce role-based permissions for lesson operations

Status: done

## Story

As a system,
I want to enforce role-based permissions for lesson operations,
so that 不正な変更を防止できる。.

## Acceptance Criteria

1. Given ロール（player/coach/operator/admin） When レッスン枠の作成/編集/一括変更/キャンセルを実行 Then 許可されたロールのみ成功し、権限不足はエラー（FORBIDDEN）になる

## Tasks / Subtasks

- [x] Implement per acceptance criteria（tRPCでのロールチェックとFORBIDDEN）

## Dev Notes

- Technical Notes: tRPC ミドルウェアで権限チェック / UI 側も表示制御
- Prerequisites: Epic 1（RBAC）, Stories 3.1–3.4

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

- lessonsRouter の create/update/delete/bulkChange にてロール（coach/operator/admin）を厳格に判定し、権限不足は FORBIDDEN を返す。UI 側は今後ロールに応じた操作制御を実装予定。

### File List

- tennis_mate/src/server/api/routers/lessons.ts
