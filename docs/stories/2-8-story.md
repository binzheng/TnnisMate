# Story 2.8: audit logging for reservation lifecycle

Status: drafted

## Story

As a developer,
I want audit logging for reservation lifecycle,
so that 重要操作の追跡ができる。.

## Acceptance Criteria

1. Given 生成/変更/キャンセルが行われる When サーバが処理 Then 構造化ログ（level,msg,userId,role,resource,requestId）が出力される

## Tasks / Subtasks

- [ ] Implement per acceptance criteria

## Dev Notes

- Technical Notes: PIIを出力しない / requestId 付与
- Prerequisites: Epic 1（ログ/Sentry）

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
