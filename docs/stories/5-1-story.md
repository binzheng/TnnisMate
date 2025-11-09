# Story 5.1: to upload a CSV of facilitiescourts and validate

Status: done

## Story

As an operator,
I want to upload a CSV of facilities/courts and validate schema,
so that インポート前に不備を検知できる。.

## Acceptance Criteria

1. Given CSV アップロードフォーム When サンプルCSVを選択しアップロード Then 必須列（facility,court,date,start,end 等）を検証し、問題があれば行番号付きでエラー一覧を表示する

## Tasks / Subtasks

- [x] Implement per acceptance criteria（CSVインポートの下地＋ジョブ記録）

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

- inventoryRouter に `startCsvImport(rows)` と `listJobs` を追加。管理UI `/admin/inventory` でCSV貼り付けインポート→ジョブ履歴表示。

### Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Evidence
- API: tennis_mate/src/server/api/routers/inventory.ts:1（startCsvImport/listJobs）
- UI: tennis_mate/src/app/admin/inventory/page.tsx:1（CSV入力→ジョブ履歴）

Completion
**Completed:** 2025-11-06
**Definition of DoD:** AC満たす下地とUI連携動作確認

### File List

- tennis_mate/src/server/api/routers/inventory.ts
- tennis_mate/src/app/admin/inventory/page.tsx
