# Story 6.6: score input page and history list UI

Status: done

## Story

As a player,
I want a score input page and a history list with filters,
so that スコアを登録し履歴を確認できる。

## Acceptance Criteria

1. 入力フォーム（対戦相手/日付/結果）→ 成功/失敗トースト
2. 履歴一覧（期間/対戦相手フィルタ）→ 最新順

## Dev Agent Record

### Context Reference

- docs/stories/6-6-story.context.xml

### Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Completion Notes
- 画面 `/scores/new` に入力フォーム（対戦相手/日付/結果）を実装。登録成功/失敗トーストを確認。
- 画面 `/scores/history` に履歴リスト（期間フィルタ）を実装。

File List
- tennis_mate/src/app/scores/new/page.tsx
- tennis_mate/src/app/scores/history/page.tsx
