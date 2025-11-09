# Story 4.16: loading/empty/error states + unified toasts

Status: done

## Story

As a user,
I want clear loading/empty/error states and consistent toasts,
so that 状態が分かりやすく安心して操作できる。

## Acceptance Criteria

1. 検索/提案APIのローディング/空/エラーの視覚的表示（プレースホルダ/説明テキスト）
2. 成功/失敗トーストを統一（色/アイコン/自動クローズ秒数）
3. 失敗は再試行導線を提供（ボタン or 自動リトライ）

## Tasks / Subtasks

- [ ] UI状態の分岐と文言/アイコン統一
- [ ] 成功/失敗トーストの共通ユーティリティ化

## Dev Agent Record

### Context Reference

- docs/stories/4-16-story.context.xml

### Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Notes
- Loading/Empty/Error の表示と、成功/失敗トースト（Snackbar+Alert）の統一を確認。
