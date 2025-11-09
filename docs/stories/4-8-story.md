# Story 4.8: player search UI with filters

Status: done

## Story

As a user,
I want a player search UI with level/area filters,
so that 条件でプレイヤーを素早く絞り込める。

## Acceptance Criteria

1. Given レベル範囲/エリアを指定 When 検索を実行 Then 一覧カード（ID/レベル/エリア）が表示される（空表示対応）
2. Given 検索条件を変更 When 再検索 Then 条件が保持され、結果が更新される
3. Given 多件数 When スクロール/ページング Then 次の結果が取得できる（最小は先頭50件で可）

## Tasks / Subtasks

- [ ] 検索フォーム（レベルmin/max、エリア）
- [ ] 一覧カード（ID/レベル/エリア）
- [ ] ページング/空表示/ローディング

## Dev Notes

- API: `matching.searchPlayers({ levelMin, levelMax, area })`
- UI配置: `/matching/search`（または管理下で暫定）

### References

- Source: docs/epics.md
- Source: docs/architecture.md
- Source: docs/prd.md

## Dev Agent Record

### Context Reference

- docs/stories/4-8-story.context.xml

### Agent Model Used

N/A

### Debug Log References

N/A

### Completion Notes List

- `/matching/search` に検索UIを実装。matching.searchPlayers に接続、カードに互換スコア/バッジ表示、提案/報告/ブロックを提供。

### File List

- tennis_mate/src/app/matching/search/page.tsx
- tennis_mate/src/lib/matchingScore.ts
