# Story 2.1: to view a weekly calendar with a clear

Status: done

## Story

As a player/coach/operator,
I want to view a weekly calendar with a clear legend and tabs,
so that 空き/混雑/衝突/特価が一目で分かる。.

## Acceptance Criteria

1. Given 週ビュー（Day/Week/Month 切替）を開く When カレンダーが描画される Then 凡例（空き=緑/混雑=橙/衝突=赤/特価=青）とタブが表示される

## Tasks / Subtasks

- [x] Implement per acceptance criteria（週ビュー画面を追加し、タブと凡例を表示）

## Dev Notes

- Technical Notes: FullCalendar 導入 / MUIテーマでスタイル上書き / レスポンシブ（モバイルはDay/Week）
- Prerequisites: Epic 1 完了（テーマ/MUI/基盤）

### References

- Source: docs/epics.md
- Source: docs/architecture.md
- Source: docs/prd.md

## Dev Agent Record

### Context Reference

<!-- Story Context XML will be attached by story-context workflow -->

### Agent Model Used

N/A

### Completion Notes
**Completed:** 2025-11-06
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

### Debug Log References

N/A

### Completion Notes List

- 初期週ビュー（MUI Tabs + 凡例 + 週グリッド）を追加。Day/Monthはプレースホルダー表示。

### File List

- tennis_mate/src/app/schedule/page.tsx
- tennis_mate/src/components/schedule/Legend.tsx
- tennis_mate/src/components/schedule/WeeklyCalendar.tsx

## Senior Developer Review (AI)

Reviewer: ben  |  Date: 2025-11-06

Outcome: Approve

Summary:
- 週ビュー画面が追加され、Day/Week/Month タブと凡例が表示され、デフォルトで Week が描画される。UIはMUIを用いたシンプルなグリッドで、後続のイベント/在庫連携の土台として適切。

Acceptance Criteria Validation（証跡）
1) タブ表示（Day/Week/Month）と切替可能
   - 証跡: tennis_mate/src/app/schedule/page.tsx:16-25（Tabs/Tab 実装、value/state 管理）
2) 凡例（空き=緑/混雑=橙/衝突=赤/特価=青）
   - 証跡: tennis_mate/src/components/schedule/Legend.tsx:9-13（色とラベル定義）、:18-28（凡例描画）
3) 週ビューのカレンダー描画（列: 月〜日、行: 時間帯）
   - 証跡: tennis_mate/src/components/schedule/WeeklyCalendar.tsx:16-29（ヘッダー列生成）、:31-59（時間×曜日グリッド）

Tasks/Subtasks 確認
- [x] Implement per acceptance criteria（画面・タブ・凡例実装）→ 実装済（上記証跡に合致）

Code Quality
- シンプルな関数コンポーネント、責務分離（Legend/WeeklyCalendar）。可読性良好。
- 後続で FullCalendar 等に差し替える前提でも、現在のモックは妥当。

Security
- ユーザー入力なし。外部依存も UI のみで新規リスクなし。

Accessibility
- 色による識別に加えてラベルを併記済み（Legend）。コントラストはテーマ次第だが、#2e7d32/#ed6c02/#d32f2f/#1976d2 は一般的に十分。最終テーマ確定後に再確認を推奨。

Action Items（任意）
- 将来: FullCalendar 導入、在庫・衝突データのバインド、キーボード操作/フォーカス順のUX検証。

Change Log
- 初回レビューで承認（Approve）。
