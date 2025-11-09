# Story 4.9: proposal create and approval UI

Status: done

## Story

As a user,
I want to create a match proposal and accept/decline incoming proposals,
so that マッチングの成立/不成立をUIで完結できる。

## Acceptance Criteria

1. Given プロフィール/検索結果から When 提案フォームに日時/メッセージを入力 Then 送信成功/失敗を明示
2. Given 受信提案一覧 When 承認/却下を実行 Then 反映され一覧が更新

## Tasks / Subtasks

- [ ] 提案送信UI（日時/メッセージ）→ `matching.sendProposal`
- [ ] 受信提案一覧と承認/却下 → `matching.actOnProposal`

## Dev Notes

- ページ: `/matching/proposals`

### References

- Source: docs/epics.md
- Source: docs/architecture.md
- Source: docs/prd.md

## Dev Agent Record

### Context Reference

- docs/stories/4-9-story.context.xml

### Agent Model Used

N/A

### Debug Log References

N/A

### Completion Notes List

- `/matching/proposals` で提案作成/受信一覧/承認・却下を実装。matching.sendProposal / actOnProposal / listIncomingProposals / listOutgoingProposals を使用。提案詳細 `/matching/proposals/[id]` にダミースレッド表示。

### File List

- tennis_mate/src/app/matching/proposals/page.tsx
- tennis_mate/src/app/matching/proposals/[id]/page.tsx
