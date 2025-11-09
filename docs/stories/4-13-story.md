# Story 4.13: block and report UI

Status: done

## Story

As a user,
I want to block or report another player from their profile,
so that 不適切な相手を避けられる。

## Acceptance Criteria

1. Given プロフィール画面 When ブロック/報告を実行 Then 確認ダイアログ後に反映（UIフラグで可）
2. ブロック済みは検索/提案から除外（UIで非表示/ラベル表示）

## Tasks / Subtasks

- [ ] プロフィールカードに「ブロック/報告」アクション追加
- [ ] 状態保持/ラベル表示

## Dev Notes

- サーバAPIは後続、まずはクライアント状態で反映

### References

- Source: docs/epics.md
- Source: docs/architecture.md
- Source: docs/prd.md

## Dev Agent Record

### Context Reference

- docs/stories/4-13-story.context.xml

### Agent Model Used

N/A

### Debug Log References

N/A

### Completion Notes List

- 検索カードに「報告」「ブロック」を実装。ブロックはクライアント状態で除外、報告はダミー提示。

### File List

- tennis_mate/src/app/matching/search/page.tsx
