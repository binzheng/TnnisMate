# Story 5.2: a field-mapping configuration (CSVdomain fields)

Status: drafted

## Story

As an operator,
I want a field-mapping configuration (CSV→domain fields),
so that ベンダー差異のある列名にも対応できる。.

## Acceptance Criteria

1. Given マッピングUI（左:CSV列 / 右:ドメイン項目） When 対応関係を設定して保存 Then 次回以降のインポートに適用され、未マップは警告される

## Tasks / Subtasks

- [ ] Implement per acceptance criteria

## Dev Notes

- Technical Notes: Mapping 設定はDB保存 / 検証時に適用
- Prerequisites: Story 5.1

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
