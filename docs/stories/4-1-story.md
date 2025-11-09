# Story 4.1: to create and edit my match profile (levelareaavailable

Status: done

## Story

As a player,
I want to create and edit my match profile (level/area/available times),
so that 適切な相手候補が出てくる。.

## Acceptance Criteria

1. Given プロフィール編集画面 When レベル（NTRP 等）/活動エリア/希望時間帯 を入力し保存 Then 検索・提案に反映される（UIに要件が表示）

## Tasks / Subtasks

- [x] Implement per acceptance criteria（プロフィール作成/更新APIと最小UI）

## Dev Notes

- Technical Notes: Profile モデル追加 / 入力は zod バリデーション
- Prerequisites: Epic 1（認証/DB）

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

- matchingRouter に upsertProfile/searchPlayers を追加。管理UI `/admin/matching/profile` でレベル/エリアを保存可能。

### Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Evidence
- API: tennis_mate/src/server/api/routers/matching.ts:1（upsertProfile/searchPlayers 実装）
- UI: tennis_mate/src/app/admin/matching/profile/page.tsx:1（プロフィール保存/一覧）

Completion
**Completed:** 2025-11-06
**Definition of Done:** AC満たすUI+APIが動作、簡易検証済み

### File List

- tennis_mate/src/server/api/routers/matching.ts
- tennis_mate/src/app/admin/matching/profile/page.tsx
