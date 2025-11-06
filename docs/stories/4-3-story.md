# Story 4.3: to compute a compatibility score based on level

Status: drafted

## Story

As a system,
I want to compute a compatibility score based on level distance, area proximity, and time overlap,
so that 有用な候補を上位に提示できる。.

## Acceptance Criteria

1. Given ユーザープロフィール A/B When スコア関数を実行 Then レベル差・距離・時間帯重なりを重み付けしたスコアを返す（決定的出力）

## Tasks / Subtasks

- [ ] Implement per acceptance criteria

## Dev Notes

- Technical Notes: 単純な重み付けから開始（w_level > w_area > w_time）/ 将来ML拡張可
- Prerequisites: Stories 4.1–4.2

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
