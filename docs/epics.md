# TennisMate Epics and Stories

Generated: 2025-11-06
Owner: ben

## Context Extract (from PRD)
- Users: 一般プレイヤー / コーチ / 施設運営者
- Core Use Cases: 対戦相手マッチング / コート検索・予約 / スコア記録 / レッスン予約
- FR: スケジュール可視化＋予約管理 / 大会マッチング / 在庫一括同期
- NFR: 初回<2s, P95<300ms, 稼働率99.9%, セキュリティ/監査, 水平スケール
- Constraints: T3採用, レスポンシブWeb

---

## Proposed Epic Structure (epics_summary)

1. Foundation Setup（基盤整備）
   - 価値: 実装を加速する土台（テーマ/認証/DB/デプロイ）を一括で整備
   - 範囲: プロジェクト初期化, 認証基盤, DBスキーマ初期, デプロイ/環境変数, 観測/ロギング
   - 先行理由: 以降の全機能の前提

2. Reservation & Schedule（予約・スケジュール）
   - 価値: コート/枠の予約作成・変更・キャンセルを迷わず高速に提供
   - 範囲: 週ビューカレンダー, クイック予約, リスケ, 競合検出, 影響プレビュー, 取消(Undo)

3. Lesson Management（レッスン管理）
   - 価値: コーチ枠の管理と受講者の変更体験の最適化
   - 範囲: 枠管理, 料金/キャンセルポリシー, 候補枠提案, 一括変更

4. Matching（対戦相手マッチング）
   - 価値: レベル/場所/時間帯での相手探索とマッチング成立
   - 範囲: プロフィール/条件検索, マッチ提案, 承認フロー, 簡易チャネル連絡（通知は後続）

5. Inventory Sync（施設・コート在庫同期）
   - 価値: 施設提供データの一括インポート/差分同期で運用負荷を削減
   - 範囲: CSV/外部API取込, 差分判定, 監査ログ, 失敗リカバリ

6. Scores & Records（戦績管理）
   - 価値: スコア記録の一貫管理と履歴の可視化
   - 範囲: スコア入力, ランキング, 履歴表示

7. Admin & Reporting（運営/レポート）
   - 価値: 稼働/売上/混雑の可視化と運営効率化
   - 範囲: ダッシュボード, エクスポート, 権限管理強化, 設定

### Suggested Sequencing
- Phase A: 1 Foundation → 2 Reservation
- Phase B: 3 Lesson → 5 Inventory Sync
- Phase C: 4 Matching → 6 Scores
- Phase D: 7 Admin & Reporting（継続拡張）

---

> 承認後、各エピックを「単一セッション完了」サイズのストーリーに分解します。

---

## Epic 1 — Foundation Setup（基盤整備）
Goal (epic_goal_1): 実装を加速する土台（テーマ/認証/DB/デプロイ/観測）を最短で整える

Story 1.1（story_title_1_1）
As a developer,
I want to initialize the Next.js (T3) project and repository,
So that the team can run and iterate quickly with a consistent base.

Acceptance Criteria (BDD)
Given プロジェクト作成コマンドを実行
When TypeScript/App Router/tRPC/Prisma/NextAuth/Tailwind を選択
Then 開発サーバが起動し、初期ページが表示できる

Prerequisites: なし
Technical Notes: `npm create t3-app@latest` / Git初期化 / README雛形

Story 1.2（story_title_1_2）
As a developer,
I want to set up Material UI theme with semantic colors and typography,
So that UIの色分けと可読性が一貫する。

Acceptance Criteria (BDD)
Given MUI を導入し `createTheme` を定義
When primary/secondary/success/warning/error/info を設定し、Robоto/Noto Sans JP を適用
Then ボタン/カードにテーマが反映され、A11yコントラスト基準を満たす

Prerequisites: Story 1.1
Technical Notes: `@mui/material @emotion/react @emotion/styled` / theme provider 追加 / カラールールはUX仕様に準拠

Story 1.3（story_title_1_3）
As a developer,
I want to configure NextAuth (Credentials) + Prisma Adapter with JWT,
So that ログインとRBACの基礎が利用できる。

Acceptance Criteria (BDD)
Given `/api/auth/[...nextauth]` が実装され
When ユーザーID+パスワードで認証
Then JWT セッションが発行され、`ctx.session` からロール参照できる

Prerequisites: Story 1.1
Technical Notes: bcrypt でハッシュ化 / Prisma User モデルに `role` 追加 / 環境変数 `NEXTAUTH_URL`, `NEXTAUTH_SECRET`

Story 1.4（story_title_1_4）
As a developer,
I want to connect Prisma to Neon(PostgreSQL) and create initial schema,
So that データを安全に保存できる。

Acceptance Criteria (BDD)
Given `DATABASE_URL` が設定され
When `prisma migrate dev` を実行
Then User/Facility/Court の初期テーブルが作成される

Prerequisites: Story 1.1
Technical Notes: Prisma schema 初期化 / Neon 接続確認 / 基本リレーション定義

Story 1.5（story_title_1_5）
As a developer,
I want to deploy the app to Vercel with environment variables,
So that  dev/stg/prod で動作が確認できる。

Acceptance Criteria (BDD)
Given Vercel プロジェクト作成
When `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `DATABASE_URL` を登録
Then `main` ブランチのデプロイが成功し、健康チェックが通る

Prerequisites: Stories 1.1, 1.3, 1.4
Technical Notes: Preview/環境分離 / 保護ブランチ

Story 1.6（story_title_1_6）
As a developer,
I want to add structured logging and Sentry,
So that エラーの検知と原因追跡が可能になる。

Acceptance Criteria (BDD)
Given Sentry DSN とログ出力が設定され
When 例外が発生
Then Sentry にイベントが送信され、構造化ログに `level,msg,requestId,userId` が出力される

Prerequisites: Story 1.5
Technical Notes: サーバ側のみ先行 / PIIは出力しない

Story 1.7（story_title_1_7）
As a developer,
I want to scaffold UploadThing + S3 (private) for uploads,
So that 画像/添付のアップロード基盤が整う。

Acceptance Criteria (BDD)
Given `UPLOADTHING_*` と `S3_*` を設定
When 許可された拡張子/サイズのファイルをアップロード
Then S3 に保存され、署名付きURLで取得できる

Prerequisites: Stories 1.5, 1.4
Technical Notes: 認可はサーバで検証 / CORS 設定

Story 1.8（story_title_1_8）
As a developer,
I want to create tRPC base router with auth middleware and error shape,
So that API 実装が一貫した規約で進められる。

Acceptance Criteria (BDD)
Given tRPC コンテキストで `ctx.session` が提供され
When 未認証/権限不足の呼び出し
Then `TRPCError`（UNAUTHORIZED/FORBIDDEN）が返る。成功/失敗のshapeが統一される

Prerequisites: Stories 1.3, 1.4
Technical Notes: zod スキーマ / 共通ユーティリティに切り出し

---

## Epic 2 — Reservation & Schedule（予約・スケジュール）
Goal (epic_goal_2): 週ビューを中心に、作成/変更/キャンセルを迷わず素早く行える予約体験を提供する

Story 2.1（story_title_2_1）
As a player/coach/operator,
I want to view a weekly calendar with a clear legend and tabs,
So that 空き/混雑/衝突/特価が一目で分かる。

Acceptance Criteria (BDD)
Given 週ビュー（Day/Week/Month 切替）を開く
When カレンダーが描画される
Then 凡例（空き=緑/混雑=橙/衝突=赤/特価=青）とタブが表示される

Prerequisites: Epic 1 完了（テーマ/MUI/基盤）
Technical Notes: FullCalendar 導入 / MUIテーマでスタイル上書き / レスポンシブ（モバイルはDay/Week）

Story 2.2（story_title_2_2）
As a player/coach,
I want to drag-select a time range to open a quick-create modal,
So that 最小入力で素早く予約を作成できる。

Acceptance Criteria (BDD)
Given 範囲ドラッグでスロットを選択
When モーダルが開く（日時/コート/タイトル）
Then 作成すると即時反映し、成功Snackbar（Undo付き）が表示される

Prerequisites: Story 2.1, Epic 1（tRPC ルーター）
Technical Notes: zod バリデ / サーバで権限チェック / Undoはローカルキャッシュ+サーバ再呼び出し

Story 2.3（story_title_2_3）
As a developer,
I want a server-side conflict detection API,
So that 予約重複や衝突を事前に防げる。

Acceptance Criteria (BDD)
Given API に日時/コート/参加者を渡す
When 衝突がある
Then 衝突一覧と原因（対象予約ID/時間帯）を返す / なければOKを返す

Prerequisites: Epic 1（DB/スキーマ）
Technical Notes: SQL 重なり判定（[start,end) で比較）/ インデックス設計

Story 2.4（story_title_2_4）
As an operator/coach,
I want to drag-and-drop reschedule with an impact preview,
So that 競合やペナルティを把握してから確定できる。

Acceptance Criteria (BDD)
Given 予約を別スロットにドラッグ
When プレビューが表示
Then 競合/ペナルティ/関係者通知の要約が見え、確定で更新・Undo可能

Prerequisites: Stories 2.1, 2.3
Technical Notes: プレビューAPI / 更新APIのトランザクション化 / 監査ログ

Story 2.5（story_title_2_5）
As a player/coach,
I want to cancel a reservation with clear policy and Undo,
So that 安心して操作できる。

Acceptance Criteria (BDD)
Given 予約詳細から「キャンセル」を選択
When ポリシー要約が表示され確定
Then 予約が取り消され、Undo Snackbar（6–8秒）が表示される

Prerequisites: Story 2.1
Technical Notes: 返金/ペナルティは将来拡張用のフラグ保持 / 監査ログ

Story 2.6（story_title_2_6）
As an operator,
I want filter chips and quick search,
So that 近日/変更あり/要確認や施設/コーチ/期間で素早く絞り込める。

Acceptance Criteria (BDD)
Given フィルタチップ（近日/変更あり/要確認）
When チップ/検索で条件を指定
Then カレンダーに反映、全解除ボタンで元に戻る

Prerequisites: Story 2.1
Technical Notes: クエリパラメータ同期 / ロール別に最後の選択を記憶

Story 2.7（story_title_2_7）
As a user,
I want a reservation detail drawer with summary and actions,
So that 状態/期間/コート/参加者/料金を確認し主要操作ができる。

Acceptance Criteria (BDD)
Given 予約をクリック
When 右Drawerが開く
Then 概要/履歴/主要アクション（変更/キャンセル）が表示される

Prerequisites: Story 2.1
Technical Notes: Drawer + Stack + Timeline（簡易）

Story 2.8（story_title_2_8）
As a developer,
I want audit logging for reservation lifecycle,
So that 重要操作の追跡ができる。

Acceptance Criteria (BDD)
Given 生成/変更/キャンセルが行われる
When サーバが処理
Then 構造化ログ（level,msg,userId,role,resource,requestId）が出力される

Prerequisites: Epic 1（ログ/Sentry）
Technical Notes: PIIを出力しない / requestId 付与

---

## Epic 3 — Lesson Management（レッスン管理）
Goal (epic_goal_3): コーチ枠の管理と受講者の変更体験を最適化し、運営負荷を下げる

Story 3.1（story_title_3_1）
As a coach/operator,
I want to create/edit/delete lesson slots (date/time/court/coach/capacity),
So that 提供枠を柔軟に管理できる。

Acceptance Criteria (BDD)
Given レッスン枠作成フォーム
When 日時/コート/コーチ/定員を入力し保存
Then 枠が作成され、カレンダー/一覧に反映される（編集/削除も同様に反映）

Prerequisites: Epic 1（MUI/DB/認証）, Epic 2（カレンダー）
Technical Notes: Prisma モデル（LessonSlot）/ DataGrid + Drawer / バリデーション

Story 3.2（story_title_3_2）
As an operator,
I want to define pricing and cancellation policy per lesson type,
So that 料金表示とキャンセル時の扱いが一貫する。

Acceptance Criteria (BDD)
Given レッスン種別に 料金/キャンセル期限/ペナルティ を設定
When 予約/変更/キャンセルを行う
Then UI にポリシーが明示され、計算ロジックに反映される（現段階では表示/フラグのみ）

Prerequisites: Story 3.1
Technical Notes: Policy テーブル/フィールド追加（将来の決済/返金に備えフラグで保持）

Story 3.3（story_title_3_3）
As a player/coach,
I want to get candidate slots when changing a lesson reservation,
So that 合致する候補枠を素早く選べる。

Acceptance Criteria (BDD)
Given レッスン予約変更画面
When レベル/場所/時間帯などの条件を指定
Then 候補枠カード（色分け + 競合/料金バッジ）が一覧表示される

Prerequisites: Story 3.1, Epic 2（カレンダー/フィルタ）
Technical Notes: 検索API / インデックス最適化 / ページング

Story 3.4（story_title_3_4）
As an operator,
I want to bulk change multiple lesson reservations,
So that 運営都合の変更にも素早く対応できる。

Acceptance Criteria (BDD)
Given 予約一覧（複数選択）
When 候補枠へ一括変更を実行
Then 影響要約（通知/ペナルティ）を確認後、確定で更新・Undo可能

Prerequisites: Stories 3.1, 3.3
Technical Notes: トランザクション/バッチ更新 / Undo用の簡易ロールバック戦略

Story 3.5（story_title_3_5）
As a system,
I want to enforce role-based permissions for lesson operations,
So that 不正な変更を防止できる。

Acceptance Criteria (BDD)
Given ロール（player/coach/operator/admin）
When レッスン枠の作成/編集/一括変更/キャンセルを実行
Then 許可されたロールのみ成功し、権限不足はエラー（FORBIDDEN）になる

Prerequisites: Epic 1（RBAC）, Stories 3.1–3.4
Technical Notes: tRPC ミドルウェアで権限チェック / UI 側も表示制御

---

## Epic 4 — Matching（対戦相手マッチング）
Goal (epic_goal_4): レベル/場所/時間帯の適合度に基づき、提案→合意までをシンプルに完了できる

Story 4.1（story_title_4_1）
As a player,
I want to create and edit my match profile (level/area/available times),
So that 適切な相手候補が出てくる。

Acceptance Criteria (BDD)
Given プロフィール編集画面
When レベル（NTRP 等）/活動エリア/希望時間帯 を入力し保存
Then 検索・提案に反映される（UIに要件が表示）

Prerequisites: Epic 1（認証/DB）
Technical Notes: Profile モデル追加 / 入力は zod バリデーション

Story 4.2（story_title_4_2）
As a player,
I want to search players with filters (level range/area/time),
So that 条件に合う相手を一覧できる。

Acceptance Criteria (BDD)
Given 検索フォーム
When レベル幅/エリア/時間帯を指定
Then ページングされた結果が表示され、並び替え（適合度/距離）も可能

Prerequisites: Story 4.1
Technical Notes: 検索API / インデックス（level, area）/ ページング・ソート

Story 4.3（story_title_4_3）
As a system,
I want to compute a compatibility score based on level distance, area proximity, and time overlap,
So that 有用な候補を上位に提示できる。

Acceptance Criteria (BDD)
Given ユーザープロフィール A/B
When スコア関数を実行
Then レベル差・距離・時間帯重なりを重み付けしたスコアを返す（決定的出力）

Prerequisites: Stories 4.1–4.2
Technical Notes: 単純な重み付けから開始（w_level > w_area > w_time）/ 将来ML拡張可

Story 4.4（story_title_4_4）
As a player,
I want to send a match proposal and the other player can accept/decline,
So that マッチングが合意ベースで成立する。

Acceptance Criteria (BDD)
Given 候補一覧から提案を送信
When 相手が承認/辞退を選択
Then ステータスが更新（提案中→成立/不成立）され履歴に記録

Prerequisites: Stories 4.1–4.3
Technical Notes: Proposal エンティティ / ステートマシン（pending/accepted/declined）/ 監査ログ

Story 4.5（story_title_4_5）
As a system,
I want to cross-check proposals with both players' calendars for conflicts,
So that 成立後にスケジュール衝突が起きない。

Acceptance Criteria (BDD)
Given 提案成立処理
When 双方の予約と候補時間を照合
Then 衝突があれば警告を返し、別候補を促す（成立不可）。なければ成立

Prerequisites: Epic 2（カレンダー/衝突API）
Technical Notes: Epic2 2.3 の衝突APIを再利用

Story 4.6（story_title_4_6）
As a player,
I want a minimal in-app conversation thread on a proposal,
So that 詳細調整がアプリ内で完結する（通知は後続）。

Acceptance Criteria (BDD)
Given 提案詳細
When 短いメッセージを送信
Then スレッドに追記され、双方の詳細に表示される（既読は将来拡張）

Prerequisites: Story 4.4
Technical Notes: シンプルな Message モデル（proposal_id/thread）/ リアルタイムは後続

Story 4.7（story_title_4_7）
As a player,
I want to block or report another player,
So that 望まない提案や迷惑行為を防げる。

Acceptance Criteria (BDD)
Given プロフィール/提案画面
When ブロック/通報を実行
Then ブロックリストに登録され、以後の提案/検索候補から除外される（通報は監査に記録）

Prerequisites: Stories 4.1–4.2
Technical Notes: Blocklist モデル / 検索・提案クエリで除外

---

## Epic 5 — Inventory Sync（施設・コート在庫同期）
Goal (epic_goal_5): 施設データを安全に取り込み、差分適用で在庫を最新化し運営負荷を削減する

Story 5.1（story_title_5_1）
As an operator,
I want to upload a CSV of facilities/courts and validate schema,
So that インポート前に不備を検知できる。

Acceptance Criteria (BDD)
Given CSV アップロードフォーム
When サンプルCSVを選択しアップロード
Then 必須列（facility,court,date,start,end 等）を検証し、問題があれば行番号付きでエラー一覧を表示する

Prerequisites: Epic 1（Upload/S3）, Epic 2（カレンダー概念）
Technical Notes: サーバ側でパース/スキーマ検証（zod）/ S3に原本保存

Story 5.2（story_title_5_2）
As an operator,
I want a field-mapping configuration (CSV→domain fields),
So that ベンダー差異のある列名にも対応できる。

Acceptance Criteria (BDD)
Given マッピングUI（左:CSV列 / 右:ドメイン項目）
When 対応関係を設定して保存
Then 次回以降のインポートに適用され、未マップは警告される

Prerequisites: Story 5.1
Technical Notes: Mapping 設定はDB保存 / 検証時に適用

Story 5.3（story_title_5_3）
As an operator,
I want a dry-run diff report before applying changes,
So that 差分の影響を安全に確認できる。

Acceptance Criteria (BDD)
Given 検証済みCSV
When ドライランを実行
Then 追加/更新/削除件数と代表例（最大N件）が表示され、適用の確認が求められる

Prerequisites: Stories 5.1–5.2
Technical Notes: 既存在庫とキー（facility,court,date,time）で比較 / 大量時はサンプリング

Story 5.4（story_title_5_4）
As a system,
I want to apply the diff with audit logging and partial rollback on failure,
So that 一貫性を保ちつつ更新できる。

Acceptance Criteria (BDD)
Given 適用を確定
When 更新処理を実行
Then 変更がトランザクションで反映され、監査ログに記録される。失敗時は影響範囲のみロールバックされる

Prerequisites: Story 5.3, Epic 1（DB/ログ）
Technical Notes: バルク処理 / 監査ログ（誰がいつ何件適用）

Story 5.5（story_title_5_5）
As an operator,
I want to configure and run an external API sync (optional),
So that ベンダーAPIから自動で在庫を取り込める。

Acceptance Criteria (BDD)
Given API のベースURL/認証/マッピング設定
When 同期を実行
Then 取得→検証→ドライラン→適用のフローで反映される

Prerequisites: Stories 5.1–5.4
Technical Notes: 将来拡張のためインターフェース化 / タイムアウトとリトライ

Story 5.6（story_title_5_6）
As a system operator,
I want scheduled sync and failure notifications (log-based),
So that 定期同期と失敗検知ができる。

Acceptance Criteria (BDD)
Given スケジュール設定（cron相当）
When 同期が失敗
Then 構造化ログにエラーが出力され、ダッシュボードに失敗バッジが表示される

Prerequisites: Story 5.5（任意）
Technical Notes: Vercel Cron / メール通知はPhase1対象外（後続）

---

## Epic 6 — Scores & Records（戦績管理）
Goal (epic_goal_6): スコア記録をミスなく素早く登録し、履歴とランキングを一貫して閲覧できるようにする

Story 6.1（story_title_6_1）
As a player/coach,
I want to input a match score with basic validations,
So that 戦績を正しく登録できる。

Acceptance Criteria (BDD)
Given スコア入力フォーム（対戦相手/日時/セットスコア）
When 保存
Then セット合計/勝敗が検証され、記録が作成される（Undo可）

Prerequisites: Epic 1（DB/認証）
Technical Notes: Score/Match モデル / zod 検証 / 競技ルールは最小実装から

Story 6.2（story_title_6_2）
As a user,
I want to view my match history with filters,
So that 期間や相手別に履歴を確認できる。

Acceptance Criteria (BDD)
Given 履歴画面
When 期間/相手/種別で絞り込み
Then 一覧/詳細（スコア/備考）が表示される

Prerequisites: Story 6.1
Technical Notes: DataGrid + Drawer / ページング

Story 6.3（story_title_6_3）
As a system,
I want to compute and display a simple ranking/summary,
So that 勝率や連勝/直近成績を可視化できる。

Acceptance Criteria (BDD)
Given 履歴データ
When 集計を実行
Then 勝率/連勝/直近N戦のサマリが表示される（グラフは simple から）

Prerequisites: Stories 6.1–6.2
Technical Notes: サマリ関数 / Recharts で簡易可視化

Story 6.4（story_title_6_4）
As an operator,
I want to import/export scores via CSV,
So that 他システムからの取り込み/バックアップが可能になる。

Acceptance Criteria (BDD)
Given CSV インポート/エクスポート
When 処理を実行
Then バリデーション/重複検出を行い、問題があれば行番号でエラー表示。エクスポートは現在の絞り込みを反映

Prerequisites: Stories 6.1–6.2
Technical Notes: 在庫同期の検証/マッピングのパターンを再利用

Story 6.5（story_title_6_5）
As a system,
I want to audit changes to scores (create/update/delete),
So that なりすましや改ざんの痕跡を追跡できる。

Acceptance Criteria (BDD)
Given スコアの生成/更新/削除
When 操作が行われる
Then 構造化ログ/監査テーブルに記録される（誰が/いつ/何を）

Prerequisites: Epic 1（ログ/監査）
Technical Notes: 監査テーブル（append-only）/ PII配慮

---

## Epic 7 — Admin & Reporting（運営/レポート）
Goal (epic_goal_7): 稼働/売上/混雑の可視化と運営設定を一元管理し、意思決定と日次運用を効率化する

Story 7.1（story_title_7_1）
As an operator,
I want a dashboard with KPIs (utilization, revenue estimate, cancellations),
So that いまの状況を一目で把握できる。

Acceptance Criteria (BDD)
Given ダッシュボード画面
When 集計を表示
Then 稼働率/推定売上/キャンセル数 がカード+スパークラインで表示される（期間切替可）

Prerequisites: Epics 2–6 の基礎データ
Technical Notes: まずは単純集計（当日/週/月）/ Recharts を利用

Story 7.2（story_title_7_2）
As an operator,
I want a heatmap of busy times by court/facility,
So that 混雑傾向を把握しやすい。

Acceptance Criteria (BDD)
Given ヒートマップ表示
When 施設/期間を選択
Then 時間帯×曜日のマトリクスが色分けで表示（凡例あり）

Prerequisites: Epic 2（予約データ）
Technical Notes: 集計SQL → 可視化（行=曜日, 列=時間帯）

Story 7.3（story_title_7_3）
As an admin,
I want to manage roles and permissions,
So that 運営/コーチ/一般の権限を適切に制御できる。

Acceptance Criteria (BDD)
Given ロール管理画面
When ユーザーのロールを変更
Then 直ちに権限が反映され、監査に記録される

Prerequisites: Epic 1（RBAC）
Technical Notes: 変更は権限チェック必須 / 重要操作は監査ログ

Story 7.4（story_title_7_4）
As an operator,
I want exports of reservations/lessons/scores as CSV,
So that 事務処理や外部レポートに活用できる。

Acceptance Criteria (BDD)
Given エクスポート画面
When 対象/期間を選択し出力
Then CSV がダウンロードされ、現在の絞り込み条件が反映される

Prerequisites: Epics 2,3,6 のデータ
Technical Notes: 大量時のストリーミング / ヘッダはロケール対応

Story 7.5（story_title_7_5）
As an admin,
I want to configure operational settings (policies, branding basics),
So that 運用ルールと外観の基本を統一できる。

Acceptance Criteria (BDD)
Given 設定画面
When キャンセル期限/ペナルティ/ブランド色やロゴを設定
Then UI と計算/表示に反映される（ロゴはS3保管）

Prerequisites: Epics 1–3
Technical Notes: 設定テーブル / S3 アップロード再利用 / ポリシーは将来の決済連携に備えフラグ化

Story 7.6（story_title_7_6）
As an operator,
I want an observability view of errors and slow endpoints (summary only),
So that 問題の早期発見ができる。

Acceptance Criteria (BDD)
Given 観測ビュー
When ログ/エラー/遅延を集計
Then 今日のエラー率/上位エラー/遅いAPIトップNが表示される

Prerequisites: Epic 1（ログ/Sentry）
Technical Notes: まずはアプリ内の集計表示（外部SaaSダッシュボードへのリンクも併記）
