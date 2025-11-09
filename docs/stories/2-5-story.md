# Story 2.5: to cancel a reservation with clear policy and

Status: done

## Story

As a player/coach,
I want to cancel a reservation with clear policy and Undo,
so that 安心して操作できる。.

## Acceptance Criteria

1. Given 予約詳細から「キャンセル」を選択 When ポリシー要約が表示され確定 Then 予約が取り消され、Undo Snackbar（6–8秒）が表示される

## Tasks / Subtasks

- [x] Implement per acceptance criteria（予約詳細→キャンセル→Undo Snackbar 6–8秒）

## Dev Notes

- Technical Notes: 返金/ペナルティは将来拡張用のフラグ保持 / 監査ログ
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

- イベントクリックで予約詳細ダイアログを表示。キャンセルポリシー要約を提示し、確定でローカル状態から削除。Snackbar（約7秒）で Undo を提供。

### File List

- tennis_mate/src/components/schedule/EventDetailDialog.tsx
- tennis_mate/src/components/schedule/WeeklyCalendar.tsx
- tennis_mate/src/app/schedule/page.tsx

## Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Summary:
- 予約詳細→キャンセルの基本フローとポリシー要約表示を実装。Undo スナックバーは 7 秒表示とし、キャンセル時は削除予約を復元可能に修正済み。

Acceptance Criteria Validation（証跡）
1) ポリシー要約の表示と確定→取り消し
   - EventDetailDialog で文言表示: tennis_mate/src/components/schedule/EventDetailDialog.tsx:19-23, 31-37
   - 確定で削除: tennis_mate/src/app/schedule/page.tsx:125-131
2) Undo Snackbar（6–8秒）
   - 表示時間: autoHideDuration=7000（7秒）に更新: tennis_mate/src/app/schedule/page.tsx:133-141 → 反映済み
   - メッセージ: 操作内容に応じて切替（作成/キャンセル）: tennis_mate/src/app/schedule/page.tsx:133-141 → 反映済み
   - Undo 挙動: キャンセルのUndoで削除予約を復元: tennis_mate/src/app/schedule/page.tsx:42-46, 125-131, 133-141 → 反映済み

Findings
- 重大な指摘なし（UIの範囲でAC満たす）。

Action Items（任意）
1) 将来: サーバAPI連携時にキャンセルの監査ログ/返金フラグ等と整合させる。

Change Log
- 初回レビュー: 変更要請（Changes Requested）。
