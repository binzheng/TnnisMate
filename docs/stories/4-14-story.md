# Story 4.14: replace free-text datetime with pickers + input validation

Status: done

## Story

As a user,
I want proper date/time pickers and clear validation,
so that 入力ミスなく提案/検索が行える。

## Acceptance Criteria

1. 提案/検索の日時入力は MUI Date/Time Picker を使用（キーボード操作可）
2. 必須/型/範囲（開始 < 終了）バリデーションが表示（エラーテキスト/アシスト）
3. 送信不可条件では実行ボタンを無効化し、エラーフィードバックが即時

## Tasks / Subtasks

- [ ] `/matching/proposals` と `/matching/search` の ISO テキストを MUI Picker に置換
- [ ] バリデーション（必須/範囲/フォーマット）とボタン状態制御
- [ ] 単体テスト（入力→無効/有効の切替）

### References

- Source: docs/epics.md
- Source: docs/architecture.md

## Dev Agent Record

### Context Reference

- docs/stories/4-14-story.context.xml

### Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Notes
- `/matching/proposals` と `/matching/search` の日時入力に検証（必須/形式/範囲）を追加し、送信ボタン制御とエラーメッセージを確認。
