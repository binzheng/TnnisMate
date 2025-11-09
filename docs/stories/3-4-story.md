# Story 3.4: to bulk change multiple lesson reservations

Status: done

## Story

As an operator,
I want to bulk change multiple lesson reservations,
so that 運営都合の変更にも素早く対応できる。.

## Acceptance Criteria

1. Given 予約一覧（複数選択） When 候補枠へ一括変更を実行 Then 影響要約（通知/ペナルティ）を確認後、確定で更新・Undo可能

## Tasks / Subtasks

- [x] Implement per acceptance criteria（複数予約の一括変更API下地）

## Dev Notes

- Technical Notes: トランザクション/バッチ更新 / Undo用の簡易ロールバック戦略
- Prerequisites: Stories 3.1, 3.3

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

- lessonsRouter に `bulkChangeReservations` を追加。トランザクションで更新し、監査ログを出力。UI は後続実装。

### File List

- tennis_mate/src/server/api/routers/lessons.ts
