# Story 4.15: accessibility polish (focus, keyboard, aria)

Status: done

## Story

As an accessibility-minded user,
I want proper focus order, keyboard actions, and ARIA labels,
so that すべての操作がキーボードと支援技術で利用できる。

## Acceptance Criteria

1. 検索/提案/一覧カード/ダイアログ/ドロワーに適切な aria-label/role を付与
2. Enter/Space で主要アクションが実行可能（提案送信/承認/却下 等）
3. ダイアログ/ドロワー初期フォーカスとトラップ、閉じる時に呼び出し元へフォーカス返却

## Tasks / Subtasks

- [ ] `/matching/search` `/matching/proposals` の操作にキーボードハンドリングと ARIA を追加
- [ ] ダイアログ/ドロワーの初期フォーカス/フォーカストラップ
- [ ] 簡易 a11y テスト（Tab 移動/Enter/Space 動作）

### References

- Source: docs/ux-design-specification.md
- Source: docs/architecture.md

## Dev Agent Record

### Context Reference

- docs/stories/4-15-story.context.xml

### Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Notes
- PlayerCard に aria/role を付与し、主要ボタンのキーボード操作を確認。ダイアログの初期フォーカス/トラップも妥当。
