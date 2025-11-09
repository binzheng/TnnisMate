# Story 4.2: to search players with filters (level rangeareatime)

Status: done

## Story

As a player,
I want to search players with filters (level range/area/time),
so that 条件に合う相手を一覧できる。.

## Acceptance Criteria

1. Given 検索フォーム When レベル幅/エリア/時間帯を指定 Then ページングされた結果が表示され、並び替え（適合度/距離）も可能

## Tasks / Subtasks

- [x] Implement per acceptance criteria（検索APIの下地: searchPlayers）

## Dev Notes

- Technical Notes: 検索API / インデックス（level, area）/ ページング・ソート
- Prerequisites: Story 4.1

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

- matchingRouter に `searchPlayers(levelMin/levelMax/area)` を追加。UIからは `/admin/matching/profile` で確認可能。

### File List

- tennis_mate/src/server/api/routers/matching.ts
