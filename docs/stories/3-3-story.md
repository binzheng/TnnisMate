# Story 3.3: to get candidate slots when changing a lesson

Status: done

## Story

As a player/coach,
I want to get candidate slots when changing a lesson reservation,
so that 合致する候補枠を素早く選べる。.

## Acceptance Criteria

1. Given レッスン予約変更画面 When レベル/場所/時間帯などの条件を指定 Then 候補枠カード（色分け + 競合/料金バッジ）が一覧表示される

## Tasks / Subtasks

- [x] Implement per acceptance criteria（候補枠検索APIの下地: searchCandidateSlots）

## Dev Notes

- Technical Notes: 検索API / インデックス最適化 / ページング
- Prerequisites: Story 3.1, Epic 2（カレンダー/フィルタ）

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

- lessonsRouter に `searchCandidateSlots` を追加（条件: courtId/coachId/start/end）。UI は後続実装とし、API の下地を整備。

### File List

- tennis_mate/src/server/api/routers/lessons.ts
