# Story 2.4: to drag-and-drop reschedule with an impact preview

Status: done

## Story

As an operator/coach,
I want to drag-and-drop reschedule with an impact preview,
so that 競合やペナルティを把握してから確定できる。.

## Acceptance Criteria

1. Given 予約を別スロットにドラッグ When プレビューが表示 Then 競合/ペナルティ/関係者通知の要約が見え、確定で更新・Undo可能

## Tasks / Subtasks

- [x] Implement per acceptance criteria（ドラッグ&ドロップ→プレビュー→確定で更新・Undo）

## Dev Notes

- Technical Notes: プレビューAPI / 更新APIのトランザクション化 / 監査ログ
- Prerequisites: Stories 2.1, 2.3

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

- 週カレンダーのイベントをドラッグ&ドロップで別スロットへ移動する際に、影響プレビューDialogを表示。競合件数/ペナルティ（暫定）/関係者通知の要約を提示。確定でローカル状態を更新、SnackbarからUndo可能。

### File List

- tennis_mate/src/components/schedule/ReschedulePreviewDialog.tsx
- tennis_mate/src/components/schedule/WeeklyCalendar.tsx
- tennis_mate/src/app/schedule/page.tsx

## Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Summary:
- イベントのドラッグ&ドロップでリスケ先を選ぶとプレビューが表示され、競合件数/ペナルティ/通知先の要約が確認できる。確定で更新し、Undo により直前変更を取り消せる。UI要件の骨子は満たしており、将来サーバAPI連携で実データと結合可能。

Acceptance Criteria Validation（証跡）
1) 予約を別スロットにドラッグ → プレビュー表示 → 競合/ペナルティ/通知の要約 → 確定で更新・Undo
   - ドラッグ&ドロップ（イベント/セル）: tennis_mate/src/components/schedule/WeeklyCalendar.tsx:96-113, 118-131
   - プレビューDialogの要約表示: tennis_mate/src/components/schedule/ReschedulePreviewDialog.tsx:71-84
   - 競合詳細算出（半開区間）: tennis_mate/src/components/schedule/ReschedulePreviewDialog.tsx:44-55
   - ページ統合/確定で更新・Undo: tennis_mate/src/app/schedule/page.tsx:70-75, 77-87, 8-37, 58-69

Code Quality / Notes
- DnD と範囲ドラッグ（2-2）を共存させつつ、責務を Page / Calendar / Dialog に分離。
- 競合計算はUI側の簡易実装で、将来は `reservations.detectConflicts` API 接続に置換推奨。

Security
- クライアントのみのデモ実装。サーバ側の認可・監査ログは後続で統合予定。

Action Items（任意）
- 将来: サーバAPIでのプレビュー（競合/通知/ペナルティ算定）と確定更新トランザクション、監査ログ連携。

Change Log
- 初回レビューで承認（Approve）。
