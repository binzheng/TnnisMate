# Story 5.3: a dry-run diff report before applying changes

Status: drafted

## Story

As an operator,
I want a dry-run diff report before applying changes,
so that 差分の影響を安全に確認できる。.

## Acceptance Criteria

1. Given 検証済みCSV When ドライランを実行 Then 追加/更新/削除件数と代表例（最大N件）が表示され、適用の確認が求められる

## Tasks / Subtasks

- [ ] Implement per acceptance criteria

## Dev Notes

- Technical Notes: 既存在庫とキー（facility,court,date,time）で比較 / 大量時はサンプリング
- Prerequisites: Stories 5.1–5.2

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
