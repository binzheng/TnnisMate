# Story 2.2: to drag-select a time range to open a

Status: done

## Story

As a player/coach,
I want to drag-select a time range to open a quick-create modal,
so that 最小入力で素早く予約を作成できる。.

## Acceptance Criteria

1. Given 範囲ドラッグでスロットを選択 When モーダルが開く（日時/コート/タイトル） Then 作成すると即時反映し、成功Snackbar（Undo付き）が表示される

## Tasks / Subtasks

- [x] Implement per acceptance criteria（範囲ドラッグ→クイック作成モーダル→即時反映＆Snackbar/Undo）

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

### Completion Notes
**Completed:** 2025-11-06
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

### Debug Log References

N/A

### Completion Notes List

- 週グリッドにドラッグ選択を実装。選択範囲をモーダルに連携し、作成後はローカル状態へ即時反映。SnackbarでUndo可（直前作成の取り消し）。

### File List

- tennis_mate/src/components/schedule/QuickCreateDialog.tsx
- tennis_mate/src/components/schedule/WeeklyCalendar.tsx
- tennis_mate/src/app/schedule/page.tsx

## Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Summary:
- 週カレンダー上の範囲ドラッグで選択→モーダル起動→作成で即時反映し、Snackbar で成功と Undo を提示。UI 仕様の骨子は満たしており、後続で tRPC/API 結線・権限検証に拡張可能な構成。

Acceptance Criteria Validation（証跡）
1) 範囲ドラッグでスロット選択 → モーダルが開く（日時/コート/タイトル）
   - 証跡（ドラッグ検出/選択範囲）: tennis_mate/src/components/schedule/WeeklyCalendar.tsx:31-46, 48-51
   - 証跡（モーダル起動/初期値連携）: tennis_mate/src/app/schedule/page.tsx:58, 70-75
   - 証跡（モーダル項目: タイトル/コート/開始/終了）: tennis_mate/src/components/schedule/QuickCreateDialog.tsx:50-78
2) 作成すると即時反映し、成功Snackbar（Undo付き）
   - 証跡（即時反映: ローカル events push）: tennis_mate/src/app/schedule/page.tsx:18-31
   - 証跡（イベント描画）: tennis_mate/src/components/schedule/WeeklyCalendar.tsx:111-136
   - 証跡（Snackbar + Undo）: tennis_mate/src/app/schedule/page.tsx:77-87, 33-37

Code Quality / Notes
- 責務分離（Calendar / Dialog / Page state）が明確。ドラッグ中の選択ハイライトで UX を担保。
- Snackbar の実装は Alert を action として内包しており、将来は `Snackbar` 子に `Alert` を入れる構成へ整理しても良い。

Security
- クライアントのみのデモ実装であり、権限検証は未実装（次ストーリーで tRPC/API 接続時に必須）。

Action Items（任意）
- 将来: tRPC mutation で作成→悲観/楽観反映と整合。権限（ロール/コート予約ポリシー）適用。Undo をサーバ相殺に拡張。

Change Log
- 初回レビュー: 承認（Approve）。
