# Story 2.2: to drag-select a time range to open a

Status: drafted

## Story

As a player/coach,
I want to drag-select a time range to open a quick-create modal,
so that 最小入力で素早く予約を作成できる。.

## Acceptance Criteria

1. Given 範囲ドラッグでスロットを選択 When モーダルが開く（日時/コート/タイトル） Then 作成すると即時反映し、成功Snackbar（Undo付き）が表示される

## Tasks / Subtasks

- [ ] Implement per acceptance criteria

## Dev Notes

- Technical Notes: zod バリデ / サーバで権限チェック / Undoはローカルキャッシュ+サーバ再呼び出し
- Prerequisites: Story 2.1, Epic 1（tRPC ルーター）

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
