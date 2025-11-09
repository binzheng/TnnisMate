# Story 6.7: ranking board UI

Status: done

## Story

As a user,
I want a ranking board view,
so that 上位の成績を一覧で見られる。

## Acceptance Criteria

1. ランキング一覧（順位/ユーザー/勝数など）→ `scores.rankingSummary` に接続

## Dev Agent Record

### Context Reference

- docs/stories/6-7-story.context.xml

### Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Completion Notes
- 画面 `/scores/ranking` にランキングボード（順位/ユーザー/試合数）を実装し、`scores.rankingSummary` に接続。

File List
- tennis_mate/src/app/scores/ranking/page.tsx
