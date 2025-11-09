# Story 3.1: to createeditdelete lesson slots (datetimecourtcoachcapacity)

Status: review

## Story

As a coach/operator,
I want to create/edit/delete lesson slots (date/time/court/coach/capacity),
so that 提供枠を柔軟に管理できる。.

## Acceptance Criteria

1. Given レッスン枠作成フォーム When 日時/コート/コーチ/定員を入力し保存 Then 枠が作成され、カレンダー/一覧に反映される（編集/削除も同様に反映）

## Tasks / Subtasks

- [x] Implement per acceptance criteria（枠の作成/一覧/削除の最小UIとAPI）

## Dev Notes

- Technical Notes: Prisma モデル（LessonSlot）/ DataGrid + Drawer / バリデーション
- Prerequisites: Epic 1（MUI/DB/認証）, Epic 2（カレンダー）

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

- Prisma に LessonSlot/Reservation/Policy を追加。tRPC lessonsRouter を作成し、list/create/update/delete/search を実装。管理UI `/admin/lessons/slots` で枠の追加/一覧/削除が可能に。

### File List

- tennis_mate/prisma/schema.prisma
- tennis_mate/src/server/api/routers/lessons.ts
- tennis_mate/src/server/api/root.ts
- tennis_mate/src/app/admin/lessons/slots/page.tsx
