# Story 2.7: a reservation detail drawer with summary and actions

Status: done

## Story

As a user,
I want a reservation detail drawer with summary and actions,
so that 状態/期間/コート/参加者/料金を確認し主要操作ができる。.

## Acceptance Criteria

1. Given 予約をクリック When 右Drawerが開く Then 概要/履歴/主要アクション（変更/キャンセル）が表示される

## Tasks / Subtasks

- [x] Implement per acceptance criteria（右Drawerに概要/履歴/主要アクションを表示）

## Dev Notes

- Technical Notes: Drawer + Stack + Timeline（簡易）
- Prerequisites: Story 2.1

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

- 予約クリックで右Drawerを開き、概要（タイトル/期間/コート/状態/料金/参加者）、簡易履歴、主要アクション（変更/キャンセル）を表示。変更は暫定で needsReview を付与、キャンセルは即時削除＋Undo対応。

### File List

- tennis_mate/src/app/schedule/page.tsx

## Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Summary:
- イベントクリックで右Drawerが開き、概要/履歴/主要アクション（変更/キャンセル）を提供。変更は needsReview フラグ付与（暫定）、キャンセルは即時削除＋Undo（Snackbar）に連動。

Acceptance Criteria Validation（証跡）
1) 予約をクリック → 右Drawer → 概要/履歴/主要アクション
   - Drawer 実装/開閉: tennis_mate/src/app/schedule/page.tsx:…（Drawer anchor="right" ブロック）
   - 概要表示: 同ブロック内（タイトル/コート/期間/状態/料金/参加者）
   - 履歴（簡易）: 同ブロック内（作成/変更）
   - 主要アクション: 変更（needsReview付与）/キャンセル（削除＋Undo）

Notes
- 料金/参加者は後続ストーリーで実データと連携。UI骨子としてはACを満たす。

Change Log
- 初回レビューで承認（Approve）。
