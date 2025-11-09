# Story 4.4: to send a match proposal and the other

Status: done

## Story

As a player,
I want to send a match proposal and the other player can accept/decline,
so that マッチングが合意ベースで成立する。.

## Acceptance Criteria

1. Given 候補一覧から提案を送信 When 相手が承認/辞退を選択 Then ステータスが更新（提案中→成立/不成立）され履歴に記録

## Tasks / Subtasks

- [x] Implement per acceptance criteria（提案APIと承認/却下API）

## Dev Notes

- Technical Notes: Proposal エンティティ / ステートマシン（pending/accepted/declined）/ 監査ログ
- Prerequisites: Stories 4.1–4.3

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

- matchingRouter に `sendProposal` / `actOnProposal(accept/decline)` を追加。ステータスは pending/accepted/declined。

### File List

- tennis_mate/src/server/api/routers/matching.ts
