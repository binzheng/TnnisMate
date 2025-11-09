# Story 4.19: reusable PlayerCard component + theme alignment

Status: done

## Story

As a developer,
I want a reusable PlayerCard with standardized spacing/typography,
so that 検索結果などで一貫した見た目になる。

## Acceptance Criteria

1. PlayerCard（ID/Lv/エリア/合致度バッジ/アクション）を `src/components/matching/PlayerCard.tsx` に切り出し
2. テーマ準拠の余白/タイポ（MUI spacing, variant）

## Tasks / Subtasks

- [ ] コンポーネント化と既存置換
- [ ] 単純スナップショットテスト（任意）

## Dev Agent Record

### Context Reference

- docs/stories/4-19-story.context.xml

### Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Notes
- PlayerCard コンポーネントを作成し `/matching/search` に適用。テーマ準拠のスペーシング/タイポも適切。
