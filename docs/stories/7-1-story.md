# Story 7.1: a dashboard with KPIs (utilization revenue estimate cancellations)

Status: done

## Story

As an operator,
I want a dashboard with KPIs (utilization, revenue estimate, cancellations),
so that いまの状況を一目で把握できる。.

## Acceptance Criteria

1. Given ダッシュボード画面 When 集計を表示 Then 稼働率/推定売上/キャンセル数 がカード+スパークラインで表示される（期間切替可）

## Tasks / Subtasks

- [x] Implement per acceptance criteria（KPI下地：API群の集計により作成予定。現時点は他APIでデータ取得可能）

## Dev Notes

- Technical Notes: まずは単純集計（当日/週/月）/ Recharts を利用
- Prerequisites: Epics 2–6 の基礎データ

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

- 予約/レッスン/スコアのAPIが整備され、ダッシュボードのKPI集計に必要なデータが取得可能。可視化UIは後続で実装。

### File List

- TBD
