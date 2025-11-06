# Story 2.3: a server-side conflict detection API

Status: drafted

## Story

As a developer,
I want a server-side conflict detection API,
so that 予約重複や衝突を事前に防げる。.

## Acceptance Criteria

1. Given API に日時/コート/参加者を渡す When 衝突がある Then 衝突一覧と原因（対象予約ID/時間帯）を返す / なければOKを返す

## Tasks / Subtasks

- [ ] Implement per acceptance criteria

## Dev Notes

- Technical Notes: SQL 重なり判定（[start,end) で比較）/ インデックス設計
- Prerequisites: Epic 1（DB/スキーマ）

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

- TBD

### File List

- TBD
