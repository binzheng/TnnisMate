# Story 3.2: to define pricing and cancellation policy per lesson

Status: drafted

## Story

As an operator,
I want to define pricing and cancellation policy per lesson type,
so that 料金表示とキャンセル時の扱いが一貫する。.

## Acceptance Criteria

1. Given レッスン種別に 料金/キャンセル期限/ペナルティ を設定 When 予約/変更/キャンセルを行う Then UI にポリシーが明示され、計算ロジックに反映される（現段階では表示/フラグのみ）

## Tasks / Subtasks

- [ ] Implement per acceptance criteria

## Dev Notes

- Technical Notes: Policy テーブル/フィールド追加（将来の決済/返金に備えフラグで保持）
- Prerequisites: Story 3.1

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
