# Story 4.10: compatibility score visualization on cards

Status: done

## Story

As a user,
I want compatibility score badges on player cards,
so that 合致度を一目で把握できる。

## Acceptance Criteria

1. Given 検索結果 When カードを表示 Then スコア/バッジ（色分け）と凡例が表示
2. スコアはレベル差/エリア一致を用いた簡易式（クライアント算出で可）

## Tasks / Subtasks

- [ ] バッジ表示/凡例
- [ ] 簡易スコア算出（後にサーバ拡張）

## Dev Notes

- 候補: `score = max(0, 100 - |levelDiff|*15) + (areaMatch? 10:0)`

### References

- Source: docs/epics.md
- Source: docs/architecture.md
- Source: docs/prd.md

## Dev Agent Record

### Context Reference

- docs/stories/4-10-story.context.xml

### Agent Model Used

N/A

### Debug Log References

N/A

### Completion Notes List

- 検索カードに互換スコア（簡易式）と色分けバッジを表示。凡例は文言で周知（UI強化は後続）。

### File List

- tennis_mate/src/lib/matchingScore.ts
- tennis_mate/src/app/matching/search/page.tsx
