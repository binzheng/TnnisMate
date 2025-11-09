# Story 4.5: to cross-check proposals with both players calendars for

Status: done

## Story

As a system,
I want to cross-check proposals with both players' calendars for conflicts,
so that 成立後にスケジュール衝突が起きない。.

## Acceptance Criteria

1. Given 提案成立処理 When 双方の予約と候補時間を照合 Then 衝突があれば警告を返し、別候補を促す（成立不可）。なければ成立

## Tasks / Subtasks

- [ ] Implement per acceptance criteria

## Dev Notes

- Technical Notes: Epic2 2.3 の衝突APIを再利用
- Prerequisites: Epic 2（カレンダー/衝突API）

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
