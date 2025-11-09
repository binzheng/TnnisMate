# Story 6.5: to audit changes to scores (createupdatedelete)

Status: done

## Story

As a system,
I want to audit changes to scores (create/update/delete),
so that なりすましや改ざんの痕跡を追跡できる。.

## Acceptance Criteria

1. Given スコアの生成/更新/削除 When 操作が行われる Then 構造化ログ/監査テーブルに記録される（誰が/いつ/何を）

## Tasks / Subtasks

- [ ] Implement per acceptance criteria

## Dev Notes

- Technical Notes: 監査テーブル（append-only）/ PII配慮
- Prerequisites: Epic 1（ログ/監査）

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
