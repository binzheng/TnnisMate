# {{project_name}} UX Design Specification

_Created on {{date}} by {{user_name}}_
_Generated using BMad Method - Create UX Design Workflow v1.0_

---

## Executive Summary

{{project_vision}}

---

## 1. Design System Foundation

### 1.1 Design System Choice — design_system_decision

候補比較（Web/Next.js 前提）

| オプション | スタック適合 | 強み | リスク/懸念 | 補足 |
| --- | --- | --- | --- | --- |
| shadcn/ui | 高 | モダン・拡張性・Tailwind親和 | 指針がないと組み立てに揺れ | T3と相性良 |
| Material UI | 中 | コンポーネント網羅・Docs充実・A11y配慮 | デザイン言語が強い/CSS-in-JSコスト | 予約UIも部品化しやすい |
| Chakra UI | 中 | アクセシビリティ配慮・学習容易 | Tailwind併用で方針分散 | 小〜中規模で安定 |
| Ant Design | 中 | エンタープライズ充実 | 視覚トーンが強い | 管理画面寄り |

決定: Material UI を採用（確定）

理由
- 豊富なコンポーネント（表/ダイアログ/データ表示）が初速に寄与
- アクセシビリティ配慮・ガイドラインが整備され、運営画面に適合
- テーマ/コンポーネントのバリアントで「色分け・一目把握」を再現しやすい

運用ルール
- スタイリングは MUI の `theme`/`sx` を基本とし、Tailwind の併用はユーティリティ（レイアウト余白など）に限定して衝突を回避
- カスタム部品（予約カレンダー、ヒートマップ、ダッシュボード）は MUI のレイアウト/フィードバック（`Grid`, `Box`, `Snackbar`）に準拠
- 動作フィードバックは `Snackbar` + インラインバリデーション、Undo トーストを標準化

併用ライブラリ
- グラフ/可視化: Recharts または Visx（MUI と並置）
- カレンダー: `@fullcalendar/*`（MUI テーマに合わせたCSS上書き）

次のステップでテーマ（色/タイポ/間隔）を定義します。

---

## 2. Core User Experience

### 2.1 Defining Experience

コア体験（Draft） — core_experience_and_platform

- 最頻行動（a）: コート予約作成
- 迷わず素早く行えるべき操作（b）: レッスン予約変更
 - 重要アクション（c）: 予約確定/変更/キャンセル時の影響範囲を一目で可視化

プラットフォーム
- Web（PC）/ Web（スマートフォン）に最適化（レスポンシブWeb）。

### 2.2 Novel UX Patterns

{{novel_ux_patterns}}

---

### 2.3 Desired Emotional Response — desired_emotional_response

望ましい感情: 自信とコントロール（迷わず操作できる安心感）

設計含意（Implications）
- 情報密度は段階的に（プログレッシブディスクロージャ）
- 主要アクションは常に同位置・同スタイルで提示（予測可能性）
- 状態変化に即応するフィードバック（保存/失敗/競合をその場で）
- 色分けの一貫性（空き=グリーン、混雑=オレンジ、衝突=レッド）
- 誤操作防止の保護柵（取り消し/やり直し、確認モーダルの最小化と明確化）

---

### 2.4 Inspiration Analysis — inspiration_analysis

参照アプリと学び（良質体験からの抽出）

1) Google カレンダー
- 俯瞰性: 週/月ビュー切替とミニカレンダーで視野を自在に調整
- 色分け: 種別/所有者/状態のレイヤ重ねで一目で区別
- 操作性: ドラッグ&ドロップによるリスケ、クイック作成で入力負荷を最小化
- フィードバック: 競合/重複を即時警告、確定前にプレビュー
- 密度制御: コンパクト/快適表示の切替で情報量と視認性を両立

2) Gmail
- トリアージ: フィルタチップ/検索で瞬時に絞り込み（状態・ラベル・日付）
- 操作の安心感: 「取り消し」猶予トーストで誤操作を軽減
- バルク操作: 複数選択→一括処理の流れが明快
- レイアウト: 3ペイン（ナビ/一覧/詳細）をレスポンシブに最適化

TennisMate への適用（初期案）
- 予約カレンダー: 施設/コーチ/ユーザーのレイヤ表示 + 状態色分け（空き=緑、混雑=橙、衝突=赤）
- クイック予約: スロット範囲ドラッグ→モーダル最小入力で作成
- リスケ支援: ドラッグ移動時に競合・ペナルティをプレビュー
- トリアージ: 「近日」「変更あり」「キャンセル要確認」などのフィルタチップ
- 一括操作: 複数予約の一括変更/キャンセル（確認は簡潔、Undo対応）

## 3. Visual Foundation

### 3.1 Color System

目的: 「一目で状況把握」できる配色規則を定義し、予約/在庫/変更の意思決定を迷わせない。

セマンティックカラー（MUI Theme 対応）
- primary.main: #2E7D32（グリーン700）… ブランド/主要アクション
- secondary.main: #1565C0（ブルー700）… 補助アクション/特価表示
- success.main: #2E7D32（グリーン700）… 空き（Available）
- warning.main: #ED6C02（オレンジ800）… 混雑（Busy）
- error.main: #D32F2F（レッド700）… 衝突/重複（Conflict）
- info.main: #0288D1（ライトブルー700）… お知らせ/キャンペーン

サーフェス/テキスト
- background.default: #FAFAFA / background.paper: #FFFFFF
- divider: #E0E0E0
- text.primary: #1A1A1A / text.secondary: #5F6368
- action.hover: rgba(0,0,0,0.04) / action.selected: rgba(46,125,50,0.08)

状態の色分け（予約/在庫UIの標準）
- 空き: success（グリーン）
- 混雑: warning（オレンジ）
- 衝突/重複: error（レッド）
- 特価/キャンペーン: info（ブルー）
- 過去枠: text.secondary 60% / 無効枠: disabled（40%）

アクセシビリティ/コントラスト
- 本文/アイコン: 最低 4.5:1（大きい文字は 3:1）
- フォーカスリング: 3px #2962FF + 2px オフセット、キーボード操作で常時表示
- タップ領域: 最小 44x44px、リスト行は 48px 以上
- 色覚多様性: 赤緑の併用時はアイコン/パターン/ラベルを併記（例: ! 衝突）

データ可視化パレット（Recharts/Visx）
- [#2E7D32, #1565C0, #00897B, #7B1FA2, #F9A825, #6D4C41]

ライト/ダーク（将来）
- 初期はライトのみ。ダーク導入時は success/warning/error の明度を調整し、コントラストを再検証

使用ルール（Do/Don't）
- Do: ステータスは色+ラベル+アイコンで冗長表現（例: ✓ 空き / ! 衝突）
- Do: カレンダーはレイヤ別に色分け（施設/コーチ/ユーザー）
- Don't: 同一画面に 6 色以上の強色を併存しない（優先度を落とす）

タイポグラフィ（MUI）
- フォント: Roboto, Noto Sans JP（日本語）
- 見出し: h1 32/40, h2 24/32, h3 20/28
- 本文: body1 16/24, body2 14/20、キャプション 12/16
- 数値/時刻は等幅タブラー（UIでのズレ防止）

**Interactive Visualizations:**

- Color Theme Explorer: [ux-color-themes.html](./ux-color-themes.html)

---

## 4. Design Direction

### 4.1 Chosen Design Approach

{{design_direction_decision}}

**Interactive Mockups:**

- Design Direction Showcase: [ux-design-directions.html](./ux-design-directions.html)

---

## 5. User Journey Flows

### 5.1 Critical User Paths

予約カレンダー（週ビュー基軸）
- レイアウト: 
  - Header: 検索 + フィルタチップ（施設/コーチ/状態/期間）+ 新規予約ボタン
  - Main: 週ビュー（Day/Week/Month 切替タブ）+ 色凡例（空き=緑/混雑=橙/衝突=赤/特価=青）
  - Side Drawer: 選択スロット/予約の詳細（タイトル/参加者/コート/料金/メモ）と主要アクション
- 操作:
  - ドラッグで範囲選択→クイック作成（最小入力）
  - 予約をドラッグ移動→競合・ペナルティを即時プレビュー
  - フィルタチップでトリアージ（近日/変更あり/要確認）
- MUI/ライブラリ: AppBar/Toolbar/Chip/Tabs/Grid/Drawer/Snackbar + FullCalendar（MUIテーマ上書き）

予約詳細（確認/変更/キャンセルの安心設計）
- レイアウト:
  - 左: 概要カード（状態・期間・コート・参加者・料金）
  - 中: タイムライン/履歴（作成→変更→キャンセル）
  - 右: 影響範囲パネル（衝突/関連枠/ペナルティ表示）
- 操作:
  - 変更フォーム（日時/コート/担当コーチ）→ 影響プレビュー → 確定（Undo対応）
  - キャンセル: 返金/ペナルティ規約の明示 + ワンクリック確認
- MUI/ライブラリ: Card/Stack/Alert/Snackbar/Dialog（Timelineはカスタム）

レッスン予約変更（迷わず/素早く）
- レイアウト:
  - 上: 対象レッスン選択（検索・タグ）
  - 左: 予約一覧（DataGrid）/ 右: 空き枠カレンダー（週表示）
- 操作:
  - 候補枠カード（色分け + 競合/料金バッジ）を選択 → プレビュー
  - 影響要約（関係者通知/ペナルティ）→ 確定（Undo）
- MUI/ライブラリ: DataGrid/Tabs/Badge/Card/Snackbar + FullCalendar

---

## 6. Component Library

### 6.1 Component Strategy

コンポーネント方針（Material UI を基盤）
- ベース: Layout（AppBar/Drawer/Grid/Container）/ 表示（Card/Chip/Badge/Alert）/ 入力（TextField/Select/DateTimePicker）
- データ: DataGrid（一覧/一括操作）
- カレンダー: FullCalendar（MUIテーマに合わせCSS上書き、色分け・ドラッグ・リサイズ対応）
- フィードバック: Snackbar（Undo トーストを標準化）/ Dialog（確認は最小限）
- 可視化: Recharts/Visx（稼働率・混雑ヒートマップ・売上トレンド）

再利用パターン
- ReservationCard（状態色/アイコン/ラベルの冗長表示）
- SlotPicker（ドラッグ選択 + 最小入力モーダル）
- ImpactPreview（確定前の影響範囲/ペナルティの可視化）
- FilterChips（近日/変更あり/要確認 等の状態チップ）

アクセシビリティ/レスポンシブ
- モバイル: カレンダーは縦スクロール + 日/週切替、詳細はボトムシート
- フォーカスリング/コントラスト/タップ領域は 3.1節の基準を遵守

---

## 7. UX Pattern Decisions

### 7.1 Consistency Rules

相互作用（Interaction）
- プライマリアクションは画面右下またはフォーム右上に固定（色: primary）/ セカンダリは左隣（色: secondary）
- 破壊的操作は `error` 強調 + 簡潔な確認文（例: 「この予約をキャンセルします」）
- Undo ファースト: 確定後 6–8 秒の Snackbar「取り消す」を標準化（ショートカット: `Z`）
- キーボード: `Enter=送信` / `Esc=閉じる` / `Cmd/Ctrl+K=クイックアクション` / `←→` で日付移動（カレンダー）
- フォーカス管理: ダイアログオープン時は最初の入力へ、クローズでトリガーへ戻す

状態（Loading/Empty/Error）
- Loading: スケルトンを優先、短時間ならインラインスピナー（1 箇所のみ）
- Empty: 「できること」CTA + サンプル（例: 初回は「予約を作成」ボタン）
- Error: `Alert`（severity=error）+ 再試行ボタン。技術メッセージは隠し、ユーザー語で説明

フォーム（Forms）
- ラベルは上、補助文は下。必須はアスタリスク、説明は 1 行で具体
- バリデーションはリアルタイム（blur/submit 時）/ エラーメッセージは入力直下
- 日付/時刻はピッカー + 直接入力を併用。タイムゾーンは UI に明示（既定=ローカル）
- 保存: 「下書き保存」と「確定」を分離（確定時のみ影響プレビュー）

ナビゲーション（Navigation）
- パンくず: 施設 > コート > 予約ID の順で深さを示す
- タブ: Day / Week / Month を同一階層に（ショートカット `D/W/M`）
- 詳細表示は Drawer（右）を既定。編集はフルスクリーン/ダイアログで切替

フィルタ/検索（Filtering & Search）
- フィルタチップ: 状態（近日/変更あり/要確認）/ 施設 / コーチ / 期間。`全解除`を必ず提供
- 保存済みフィルタ: ロール（運営/コーチ/プレイヤー）ごとに最後の選択を記憶

通知（Feedback）
- 成功=success（緑）/ 注意=warning（橙）/ 失敗=error（赤）/ 情報=info（青）で統一
- 長文通知は避け、関連画面要素をハイライト（例: 影響パネルを点滅せず境界強調）

データ密度（Density）
- 表示密度は「快適/コンパクト」をユーザー設定で切替（DataGrid/カード/リストに反映）

アクセシビリティ（A11y）
- コントラスト比: 本文/アイコン 4.5:1 以上。フォーカスリングは常時視認可能
- スクリーンリーダー: 重要状態に `aria-live=polite`、Snackbar は `role=alert`
- ショートカットはツールチップ/ヘルプに併記（例: Cmd/Ctrl+K）

国際化（i18n）
- 日付/時刻/通貨はロケールに従い表示（日本語: 24 時間表記、週開始=月曜）
- 体育会・スクール用語はプロダクト用語集で統一（例: 「枠」「コート」「レッスン」）

---

## 8. Responsive Design & Accessibility

### 8.1 Responsive Strategy

レスポンシブ設計（共通）
- ブレークポイント: xs<600, sm≥600, md≥900, lg≥1200, xl≥1536（MUI既定）
- レイアウト: `Grid`/`Container` を基礎に、md未満は単一カラム、md以上で2–3カラム
- カレンダー: 
  - モバイル: Day/Week 切替、縦スクロール。詳細はボトムシート（90%高さ）
  - デスクトップ: Week 既定、Month/Day タブ切替。詳細は右 `Drawer`
- テーブル: `DataGrid` は sm 未満でカードリスト表示に切替（主要フィールドのみ）
- ナビゲーション: AppBar はモバイルで縮小（検索→アイコン化、フィルタはシートへ）

アクセシビリティ（A11y）
- コントラスト: 本文/アイコン 4.5:1 以上、主要ボタン 3:1 以上
- フォーカス: キーボード操作で常時可視。フォーカスリング 3px/オフセット 2px
- ロール/ラベル: 重要コンポーネントに `aria-*` を適切に付与（例: カレンダーは `aria-grid` 相当のロール）
- ライブリージョン: 成功/失敗/警告は `role=alert` / `aria-live=polite`
- タップ領域: 最小 44x44px、リスト行高は 48px 以上
- 説明補助: 色の意味はラベル/アイコンで冗長化（色覚多様性に配慮）

パフォーマンス
- 画像/アイコンはSVG優先、アイコンフォントを避ける
- 重要画面は遅延読込（コード分割）/ スケルトンで知覚速度を最適化

---

## 9. Implementation Guidance

### 9.1 Completion Summary

決定の要約
- デザインシステム: Material UI（theme/sx 基本、Undo付きSnackbar 標準化）
- 可視化/カレンダー: Recharts/Visx + FullCalendar（MUIテーマ併用）
- コア画面: 予約カレンダー/予約詳細/レッスン変更 — 色分け/競合プレビュー/一括操作
- カラー/タイポ: セマンティックカラー定義、Roboto + Noto Sans JP、等幅数字
- 一貫性: Interaction/状態/フォーム/ナビ/フィルタ/通知/A11y/i18n を明文化

実装ガイド（次ステップ）
1) テーマ着手: MUI `createTheme` でセマンティックカラーとタイポを反映
2) レイアウト: AppBar/Drawer/Container/Grid の骨格とルーティング作成
3) カレンダー: FullCalendarを導入し、色分け/ドラッグ/リサイズ/凡例を実装
4) 予約詳細: 概要カード/影響プレビューパネル/Undo付きフロー
5) データグリッド: レッスン変更画面（カード切替/ブレークポイント対応）
6) フィードバック: `Snackbar` 標準化（成功/注意/失敗/情報）と `role=alert`

関連成果物
- カラープレビュー: ux-color-themes.html（セマンティックの検証用）
- アーキテクチャ連携: docs/architecture.md（API/認証/ストレージ/デプロイ）

検証観点（受け入れの目安）
- モバイル: 主要フローが 3 タップ以内で到達できる
- 可視化: 予約密度の把握が 3 秒以内で可能（色分け+凡例）
- 誤操作: 重要操作は Undo で復帰可能（6–8 秒）

---

## Appendix

### Project & Users (Draft) — project_and_users_confirmed

このセクションは初期理解の確認として保存されています（後で洗練します）。

- プロジェクト概要: テニススクールの運営システム（TennisMate）
- 主要ユーザー: 一般プレイヤー / コーチ / クラブ・施設運営者
- 主要ユースケース: 対戦相手のマッチング、コートの検索・予約、スコア記録・戦績管理、レッスン予約/コーチ検索

（ご確認）この理解で合っていますか？修正したい点があればお知らせください。


### Related Documents

- Product Requirements: `{{prd_file}}`
- Product Brief: `{{brief_file}}`
- Brainstorming: `{{brainstorm_file}}`

### Core Interactive Deliverables

This UX Design Specification was created through visual collaboration:

- **Color Theme Visualizer**: {{color_themes_html}}
  - Interactive HTML showing all color theme options explored
  - Live UI component examples in each theme
  - Side-by-side comparison and semantic color usage

- **Design Direction Mockups**: {{design_directions_html}}
  - Interactive HTML with 6-8 complete design approaches
  - Full-screen mockups of key screens
  - Design philosophy and rationale for each direction

### Optional Enhancement Deliverables

_This section will be populated if additional UX artifacts are generated through follow-up workflows._

<!-- Additional deliverables added here by other workflows -->

### Next Steps & Follow-Up Workflows

This UX Design Specification can serve as input to:

- **Wireframe Generation Workflow** - Create detailed wireframes from user flows
- **Figma Design Workflow** - Generate Figma files via MCP integration
- **Interactive Prototype Workflow** - Build clickable HTML prototypes
- **Component Showcase Workflow** - Create interactive component library
- **AI Frontend Prompt Workflow** - Generate prompts for v0, Lovable, Bolt, etc.
- **Solution Architecture Workflow** - Define technical architecture with UX context

### Version History

| Date     | Version | Changes                         | Author        |
| -------- | ------- | ------------------------------- | ------------- |
| {{date}} | 1.0     | Initial UX Design Specification | {{user_name}} |

---

_This UX Design Specification was created through collaborative design facilitation, not template generation. All decisions were made with user input and are documented with rationale._
