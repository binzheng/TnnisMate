# Story 4.20: confirm dialogs standardization for destructive actions

Status: done

## Story

As a user,
I want consistent confirm dialogs for destructive actions,
so that 誤操作を防げる。

## Acceptance Criteria

1. ブロック/報告/却下などに統一ダイアログ（タイトル/本文/強調ボタン）
2. Esc/Cancel キーで閉じる、Enter で確定（フォーカス適切）

## Tasks / Subtasks

- [ ] 共通 Confirm ダイアログコンポーネント追加（`src/components/common/ConfirmDialog.tsx`）
- [ ] `/matching/search` `/matching/proposals` に適用

## Dev Agent Record

### Context Reference

- docs/stories/4-20-story.context.xml

### Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Notes
- ConfirmDialog を追加し、破壊的操作の確認を標準化。Esc/Enter の操作と初期フォーカスも確認。
