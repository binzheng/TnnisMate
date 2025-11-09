# Story 4.12: cross-check both calendars overlay

Status: done

## Story

As a user,
I want to overlay both players' calendars to find overlaps,
so that 候補時間帯を素早く見つけられる。

## Acceptance Criteria

1. Given 双方の空き情報 When 週ビューを重ね表示 Then 重なり区間が強調表示される（簡易で可）
2. 候補へジャンプできる操作（リンク/スクロール）

## Tasks / Subtasks

- [ ] 週ビューへ重ね表示レイヤ追加（簡易）
- [ ] 候補へジャンプ

## Dev Notes

- データはダミーまたは自ユーザー空きの複製で可（将来サーバ連携）

### References

- Source: docs/epics.md
- Source: docs/architecture.md
- Source: docs/prd.md

## Dev Agent Record

### Context Reference

- docs/stories/4-12-story.context.xml

### Agent Model Used

N/A

### Debug Log References

N/A

### Completion Notes List

- `/matching/overlay` に簡易重なり候補のリスト表示とジャンプボタン（仮）を実装。将来サーバ空き情報と連携予定。

### File List

- tennis_mate/src/app/matching/overlay/page.tsx
