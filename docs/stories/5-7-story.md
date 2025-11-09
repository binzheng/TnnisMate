# Story 5.7: CSV preview table with mapping + diff apply UI

Status: ready-for-dev

## Story

As an operator,
I want a CSV preview table with field mapping and a diff apply confirmation,
so that 適用前に影響を確認して安全に同期できる。

## Acceptance Criteria

1. CSV を貼付/選択 → プレビュー表（先頭N行）とフィールドマッピングフォームを表示
2. 「ドライラン」実行で件数サマリを表示（追加/更新/削除）
3. 「適用」前に確認ダイアログ（件数要約）→ 成功/失敗トースト

## Tasks / Subtasks

- [ ] `/admin/inventory` にプレビュー表/マッピングUI/ドライラン/適用の導線を追加
- [ ] 成功/失敗/空/エラー表示

## Dev Notes

- API: 既存の `inventory.startCsvImport()` をドライランモードに拡張/ダミー対応可

## Dev Agent Record

### Context Reference

- docs/stories/5-7-story.context.xml

