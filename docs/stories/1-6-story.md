# Story 1.6: to add structured logging and Sentry

Status: drafted

## Story

As a developer,
I want to add structured logging and Sentry,
so that エラーの検知と原因追跡が可能になる。.

## Acceptance Criteria

1. Given Sentry DSN とログ出力が設定され When 例外が発生 Then Sentry にイベントが送信され、構造化ログに `level,msg,requestId,userId` が出力される

## Tasks / Subtasks

- [ ] Implement per acceptance criteria

## Dev Notes

- Technical Notes: サーバ側のみ先行 / PIIは出力しない
- Prerequisites: Story 1.5

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
