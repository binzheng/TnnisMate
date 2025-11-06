# Story 5.1: to upload a CSV of facilitiescourts and validate

Status: drafted

## Story

As an operator,
I want to upload a CSV of facilities/courts and validate schema,
so that インポート前に不備を検知できる。.

## Acceptance Criteria

1. Given CSV アップロードフォーム When サンプルCSVを選択しアップロード Then 必須列（facility,court,date,start,end 等）を検証し、問題があれば行番号付きでエラー一覧を表示する

## Tasks / Subtasks

- [ ] Implement per acceptance criteria

## Dev Notes

- Technical Notes: サーバ側でパース/スキーマ検証（zod）/ S3に原本保存
- Prerequisites: Epic 1（Upload/S3）, Epic 2（カレンダー概念）

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
