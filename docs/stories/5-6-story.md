# Story 5.6: scheduled sync and failure notifications (log-based)

Status: drafted

## Story

As a system operator,
I want scheduled sync and failure notifications (log-based),
so that 定期同期と失敗検知ができる。.

## Acceptance Criteria

1. Given スケジュール設定（cron相当） When 同期が失敗 Then 構造化ログにエラーが出力され、ダッシュボードに失敗バッジが表示される

## Tasks / Subtasks

- [ ] Implement per acceptance criteria

## Dev Notes

- Technical Notes: Vercel Cron / メール通知はPhase1対象外（後続）
- Prerequisites: Story 5.5（任意）

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
