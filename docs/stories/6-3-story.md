# Story 6.3: to compute and display a simple rankingsummary

Status: review

## Story

As a system,
I want to compute and display a simple ranking/summary,
so that 勝率や連勝/直近成績を可視化できる。.

## Acceptance Criteria

1. Given 履歴データ When 集計を実行 Then 勝率/連勝/直近N戦のサマリが表示される（グラフは simple から）

## Tasks / Subtasks

- [x] Implement per acceptance criteria（簡易ランキング集計API）

## Dev Notes

- Technical Notes: サマリ関数 / Recharts で簡易可視化
- Prerequisites: Stories 6.1–6.2

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

- scoresRouter に `rankingSummary` を追加（勝敗の単純集計ベース）。UI は後続で可視化予定。

### File List

- tennis_mate/src/server/api/routers/scores.ts
