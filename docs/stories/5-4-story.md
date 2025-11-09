# Story 5.4: to apply the diff with audit logging and

Status: done

## Story

As a system,
I want to apply the diff with audit logging and partial rollback on failure,
so that 一貫性を保ちつつ更新できる。.

## Acceptance Criteria

1. Given 適用を確定 When 更新処理を実行 Then 変更がトランザクションで反映され、監査ログに記録される。失敗時は影響範囲のみロールバックされる

## Tasks / Subtasks

- [ ] Implement per acceptance criteria

## Dev Notes

- Technical Notes: バルク処理 / 監査ログ（誰がいつ何件適用）
- Prerequisites: Story 5.3, Epic 1（DB/ログ）

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
