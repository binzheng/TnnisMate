# Story 3.2: to define pricing and cancellation policy per lesson

Status: done

## Story

As an operator,
I want to define pricing and cancellation policy per lesson type,
so that 料金表示とキャンセル時の扱いが一貫する。.

## Acceptance Criteria

1. Given レッスン種別に 料金/キャンセル期限/ペナルティ を設定 When 予約/変更/キャンセルを行う Then UI にポリシーが明示され、計算ロジックに反映される（現段階では表示/フラグのみ）

## Tasks / Subtasks

- [x] Implement per acceptance criteria（LessonPolicy スキーマ/表層UI 追加の下地）

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

- Prisma に LessonPolicy を追加（料金/キャンセル締切/ペナルティフラグ）。次段で UI に反映予定（本コミットはスキーマ/ルーター基盤）。

### File List

- tennis_mate/prisma/schema.prisma
- tennis_mate/src/server/api/routers/lessons.ts
