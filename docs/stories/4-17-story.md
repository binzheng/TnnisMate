# Story 4.17: pagination/infinite scroll + debounce search

Status: done

## Story

As a user,
I want efficient search pagination and debounced input,
so that 大量データでも快適に探せる。

## Acceptance Criteria

1. ページング（または無限スクロール）で 50件/ページ 取得
2. 入力は300ms debounce で API 呼び出し回数を抑制

## Tasks / Subtasks

- [ ] ページング/無限スクロールの実装（次のページ取得）
- [ ] debounce（検索条件変更時）

## Dev Agent Record

### Context Reference

- docs/stories/4-17-story.context.xml

### Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Notes
- `/matching/search` にページング（50件単位）と 300ms デバウンスを実装、動作確認済み。
