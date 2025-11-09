# Story 4.18: i18n & date/time formatting consistency

Status: done

## Story

As a user,
I want localized labels and consistent date/time formatting,
so that 表示が統一されて読みやすい。

## Acceptance Criteria

1. 画面上の固定文言を i18n レイヤ（辞書）へ集約（最低限）
2. 日付/時刻は `toLocaleString` を統一ヘルパでラップ（タイムゾーンを意識）

## Tasks / Subtasks

- [ ] ラベル辞書整備（JP英語想定でkeyを切る）
- [ ] 日付/時刻のフォーマッタ util 追加＆置換

## Dev Agent Record

### Context Reference

- docs/stories/4-18-story.context.xml

### Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Notes
- 簡易辞書と日付フォーマット util を追加。段階適用として妥当。
