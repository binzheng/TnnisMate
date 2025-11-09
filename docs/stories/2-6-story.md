# Story 2.6: filter chips and quick search

Status: done

## Story

As an operator,
I want filter chips and quick search,
so that 近日/変更あり/要確認や施設/コーチ/期間で素早く絞り込める。.

## Acceptance Criteria

1. Given フィルタチップ（近日/変更あり/要確認） When チップ/検索で条件を指定 Then カレンダーに反映、全解除ボタンで元に戻る

## Tasks / Subtasks

- [x] Implement per acceptance criteria（フィルタチップ/検索/全解除、カレンダー反映）

## Dev Notes

- Technical Notes: クエリパラメータ同期 / ロール別に最後の選択を記憶
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

- 週ビュー上部に検索ボックスとフィルタチップ（近日/変更あり/要確認）を追加。選択状態でカレンダーの表示イベントを絞り込み、全解除で元に戻す。DnDリスケ時は対象イベントに `changed` フラグを付与して「変更あり」フィルタに反映。

### File List

- tennis_mate/src/app/schedule/page.tsx
- tennis_mate/src/components/schedule/WeeklyCalendar.tsx

## Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Summary:
- 検索ボックスとフィルタチップ（近日/変更あり/要確認）を提供し、カレンダー表示に反映。全解除で元に戻る動作も実装済み。DnD リスケにより `changed` フラグを付与し「変更あり」チップに連動。

Acceptance Criteria Validation（証跡）
1) フィルタチップと検索の指定 → カレンダーに反映、全解除で元に戻る
   - フィルタUI（検索/チップ/全解除）: tennis_mate/src/app/schedule/page.tsx:113-153
   - フィルタ適用ロジック（visibleEvents）: tennis_mate/src/app/schedule/page.tsx:76-92
   - カレンダーへの反映: tennis_mate/src/app/schedule/page.tsx:155-160（events=visibleEvents）
   - 変更フラグ付与（DnD確定時）: tennis_mate/src/app/schedule/page.tsx:63-69

Notes
- 「要確認」チップは現状フラグ連動（needsReview）。将来サーバ側のレビュー状態と同期予定。

Change Log
- 初回レビューで承認（Approve）。
