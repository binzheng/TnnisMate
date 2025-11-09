# Story 6.1: to input a match score with basic validations

Status: done

## Story

As a player/coach,
I want to input a match score with basic validations,
so that 戦績を正しく登録できる。.

## Acceptance Criteria

1. Given スコア入力フォーム（対戦相手/日時/セットスコア） When 保存 Then セット合計/勝敗が検証され、記録が作成される（Undo可）

## Tasks / Subtasks

- [x] Implement per acceptance criteria（スコア入力APIと履歴取得）

## Dev Notes

- Technical Notes: Score/Match モデル / zod 検証 / 競技ルールは最小実装から
- Prerequisites: Epic 1（DB/認証）

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

- scoresRouter に `addScore` / `myHistory` を追加。ランキング概要は `rankingSummary` を実装。

### Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Evidence
- API: tennis_mate/src/server/api/routers/scores.ts:1（addScore/myHistory 実装）

Completion
**Completed:** 2025-11-06
**Definition of DoD:** AC範囲のAPIが動作

### File List

- tennis_mate/src/server/api/routers/scores.ts
