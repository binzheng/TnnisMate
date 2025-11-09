# Story 4.11: minimal proposal thread view

Status: done

## Story

As a user,
I want to view a simple message thread for a proposal,
so that やり取りの履歴を確認できる。

## Acceptance Criteria

1. Given 提案詳細 When 画面を開く Then メッセージのタイムラインが見える（ダミー/直近のみでも可）
2. 後続で返信UI追加予定（本ストーリーは閲覧のみ）

## Tasks / Subtasks

- [ ] 提案詳細画面/Drawer にタイムライン領域を追加

## Dev Notes

- API未実装のためダミーデータで可（将来拡張）

### References

- Source: docs/epics.md
- Source: docs/architecture.md
- Source: docs/prd.md

## Dev Agent Record

### Context Reference

- docs/stories/4-11-story.context.xml

### Agent Model Used

N/A

### Debug Log References

N/A

### Completion Notes List

- 提案詳細 `/matching/proposals/[id]` にダミーメッセージで最小スレッド表示を実装。

### File List

- tennis_mate/src/app/matching/proposals/[id]/page.tsx
