# TennisMate 作業一覧（Backlog）

版: v0.1 / ステータス: Draft

本ファイルはプロジェクト完遂までの作業を、段階（フェーズ）と領域別にチェックリスト化したものです。優先度は上から順に高い想定です。

## フェーズ概要
- M1: 認証/RBAC/スケジュール参照/基本予約（キャンセル含む）
- M2: 出欠・コーチ業務・ダッシュボードKPI（予約率/出席率/レーン稼働率）
- M3: 試合管理/成績集計・ランキング
- M4: 請求/プラン（軽量版）、通知

---

## 0. プロジェクト初期設定
- [ ] リポジトリ整備（README、Conventional Commits、Issue/PR テンプレ）
- [ ] t3-app スキャフォールド（Next.js + tRPC + Prisma + NextAuth）
- [ ] ESLint/Prettier 設定、エイリアス、パス構成（src/ 配下）
- [ ] Vitest/RTL セットアップ、初期テスト通過確認
- [ ] `.env.example` 整備（安全なデフォルト）
- [ ] `src/` 構成準拠（features/components/lib）とバー レル運用方針

## 1. インフラ/環境
- [ ] Neon（PostgreSQL）プロビジョニング（dev/preview/prod）
- [ ] Vercel プロジェクト作成・接続（Preview/Prod）
- [ ] 環境変数設定（DATABASE_URL/NEXTAUTH_SECRET/NEXTAUTH_URL/Email Provider）
- [ ] Prisma Migration のデプロイ戦略（自動 or 手動）

## 2. 認証/認可（RBAC）
- [ ] NextAuth プロバイダ決定（Email/Passwordless、将来: OAuth）
- [ ] Prisma User/Account/Session/VerificationToken のモデル確定
- [ ] 役割 `role: ADMIN|COACH|STUDENT` 設計・初期化（シード）
- [ ] tRPC middleware によるロール/所有権チェック実装
- [ ] 認可ユーティリティ（`canRead/Write` 等）とテスト
- [ ] 認証 UI（サインイン/アウト、セッション状態）

## 3. データモデル/マイグレーション
- [ ] Prisma スキーマ定義（User/StudentProfile/CoachProfile/Court/Lane/LessonSlot/Reservation/Attendance/MatchEvent/MatchEntry/MatchResult/PricingPlan）
- [ ] リレーション・制約・ユニーク・インデックス最適化
- [ ] シードデータ（コート/レーン、レベル、ダミーユーザ/スロット）
- [ ] マイグレーション作成/適用/ロールバック手順整備

## 4. API（tRPC ルータ）
- [ ] `auth`: getSession/signIn/signOut
- [ ] `users`: getMe/getById/search/updateProfile
- [ ] `schedule`: listSlots/createSlot/update/delete（ADMIN/COACH）
- [ ] `reservation`: create/cancel/listMine/waitlist/move
- [ ] `attendance`: mark/bulkMark/listBySlot
- [ ] `match`: createEvent/registerEntry/generateBracket/recordResult/rankings
- [ ] `dashboard`: kpiOverview/kpiTimeseries/laneUtilization
- [ ] `settings`: courts/lanes/pricing/policies CRUD
- [ ] 入出力の zod スキーマ化・エラー整形（TRPCError）
- [ ] 主要ルータの単体/結合テスト

## 5. フロントエンド UI/UX
- [ ] MUI テーマ/レイアウト/ナビゲーション（AppBar/Drawer/レスポンシブ）
- [ ] ダッシュボード `/dashboard`（KPI カード + チャート）
- [ ] カレンダー `/schedule`（月/週/日、フィルタ：コーチ/レーン/レベル）
- [ ] レッスン詳細 `/lessons/[id]`（枠/参加者/操作）
- [ ] 予約一覧 `/reservations`（予約/キャンセル/振替）
- [ ] 試合 `/matches/[id]`（エントリー/結果入力）
- [ ] 管理設定 `/admin/settings`（料金/ポリシー/レーン）
- [ ] 人員台帳 `/people/students`, `/people/coaches`
- [ ] 共通コンポーネント（Table/Form/Dialogs/Toasts/Loading/EmptyStates）
- [ ] フォーム: react-hook-form + zod resolver
- [ ] チャート: Chart.js or Recharts ラッパーとテーマ連携
 - [ ] レスポンシブ設計: ブレークポイント（375/768/1024/1440）で UI 崩れ無し、ボトムナビ（モバイル）/ドロワー（デスクトップ）最適化、タップ領域 >=44px、`next/image` 最適化

## 6. ダッシュボード/KPI
- [ ] KPI 定義確定（予約率/出席率/売上/レーン稼働率/試合成績）
- [ ] 集計クエリ（Prisma or SQL）設計・インデックス最適化
- [ ] タイムシリーズ/フィルタ（期間/レベル/コーチ/レーン）
- [ ] キャッシュ戦略（再計算間隔、失効）
- [ ] 可視化コンポーネント（カード/折れ線/棒/円）

## 7. コーチ業務/運用
- [ ] シフト入力・担当割当 UI
- [ ] 出欠記録（スマホ最適化）
- [ ] アナウンス/連絡（将来: メール配信連携）

## 8. 通知/外部連携（段階導入）
- [ ] メール送信基盤（Provider、テンプレ、レート制御）
- [ ] 予約/変更/キャンセル/出欠リマインドのトリガ設計
- [ ] Stripe（将来）連携の PoC（Billing が確定後）

## 9. 請求/プラン（M4 以降軽量版）
- [ ] プラン/チケット モデル最小版（消費/有効期限/回数）
- [ ] 予約との整合（残数/ペナルティ）
- [ ] UI（購入/残数表示/履歴）

## 10. 非機能/品質
- [ ] セキュリティ（CSRF、セッション、入力検証、RBAC 漏れテスト）
- [ ] パフォーマンス（p95<500ms、N+1 対策、クエリ計測）
- [ ] アクセシビリティ（キーボード/ARIA/コントラスト）
- [ ] ログ/監査（重要イベントの監査テーブル）
- [ ] エラーハンドリング（UI/サーバ統一ポリシー）

## 11. テスト/CI/CD
- [ ] ユニットテスト（lib/utils、zod、RBAC）
- [ ] ルータ結合テスト（Prisma テスト DB）
- [ ] コンポーネント/ページの統合テスト（主要フロー）
- [ ] カバレッジ >= 80%（変更ファイル）
- [ ] GitHub Actions: lint/test/build/preview URL 共有
- [ ] Prisma マイグレーションの自動適用 or ガード

## 12. 運用/監視
- [ ] エラートラッキング（Sentry 等、任意）
- [ ] メトリクス/ログの保全指針
- [ ] バックアップ/リストア手順（Neon）
- [ ] ランブック（障害時/ロールバック/権限付与）

## 13. ドキュメント/ナレッジ
- [ ] 基本設計書の更新（docs/design/basic-design.md）
- [ ] 詳細設計書（tRPC I/O、画面項目、状態遷移）
- [ ] ER 図の具体化（Mermaid or 画像エクスポート）
- [ ] テスト計画/仕様（ケース/データ/基準）
- [ ] セットアップ手順/開発ガイド/コーディング規約

---

## 参考: 進捗の見える化ルール
- 各タスクは小さく保ち、PR ベースでクローズ
- 受入条件（DoD）を PR 説明に記載（テスト・スクショ・注記）
- マイルストーン（M1〜M4）に紐付けて燃尽/可視化

---

## 完了確認チェックリスト（Verification）
各セクションの「作業」が完了しているかを検証するための観点一覧です。PR の受入条件として転記してください。

### 0. プロジェクト初期設定
- [ ] `npm run dev` が無修正状態で起動する（初回）
- [ ] `npm run lint` がエラー0、警告は許容範囲
- [ ] `npm run test` が全件パス、カバレッジ報告が出力される
- [ ] `src/` 配下の構成（features/components/lib）が準拠
- [ ] `.env.example` が最新で不足キーがない

### 1. インフラ/環境
- [ ] Neon の dev/preview/prod が作成済み、接続確認（Prisma で `prisma db push`/`migrate deploy` が成功）
- [ ] Vercel 環境にプロジェクト接続・環境変数反映済み
- [ ] Preview デプロイが PR 作成で自動生成され、動作確認できる
- [ ] 本番デプロイ時にマイグレーション手順が明文化（自動/手動）

### 2. 認証/認可（RBAC）
- [ ] サインイン/アウト/セッション維持が UI/Server 双方で確認できる
- [ ] 役割の初期化（シード）が実行できる（ADMIN/COACH/STUDENT）
- [ ] tRPC middleware で未認証・権限不足が 401/403 を返す
- [ ] 自他リソースの所有権チェックが有効（COACH/・STUDENT）
- [ ] 未認可抜けのユニット/結合テストが存在する

### 3. データモデル/マイグレーション
- [ ] `prisma validate` が成功、リレーション/ユニーク/インデックスが定義済み
- [ ] `prisma migrate dev` → `migrate deploy` の往復が可能
- [ ] シード実行でダミーデータが投入・参照できる
- [ ] 主要外部キーの削除/更新時動作（CASCADE/RESTRICT）が期待通り

### 4. API（tRPC ルータ）
- [ ] すべての入力/出力が zod スキーマで型定義済み
- [ ] 正常/異常（バリデーション/認可/存在しない）のレスポンスが定義通り（TRPCError 含む）
- [ ] 主要ルータのユニット/結合テストが 80%以上のラインカバレッジ
- [ ] N+1 が発生しないクエリ設計（`include/select`、適切な index）

### 5. フロントエンド UI/UX
- [ ] 全ページがルーティング可能で 404/リダイレクトが正しい
- [ ] レイアウト（AppBar/Drawer/レスポンシブ）が崩れない（モバイル/タブレット/デスクトップ）
- [ ] フォームは `react-hook-form` + zod で同期/非同期バリデーション済み
- [ ] ローディング/空状態/エラー表示が用意されている
- [ ] 基本のキーボード操作とARIA属性がチェック済み（重要導線）
 - [ ] ビューポート 375/768/1024/1440px で主要ページ（dashboard/schedule/reservations）が機能・視認性ともに合格（手動チェック or Percy 等）

### 6. ダッシュボード/KPI
- [ ] KPI 算出式が基本設計と一致（予約率/出席率/稼働率/売上/成績）
- [ ] 代表データ（フィクスチャ）で期待値とグラフが一致
- [ ] 期間/レベル/コーチ/レーンのフィルタが反映される
- [ ] 集計 API p95 < 500ms（対象データ量のテスト基準で）

### 7. コーチ業務/運用
- [ ] シフト入力→担当割当→反映までの一連フローが成功
- [ ] 出欠記録が枠/予約と矛盾なく保存・表示される
- [ ] スマホ解像度で主要操作がストレスなく行える

### 8. 通知/外部連携
- [ ] メール送信（開発環境はモック/ログ）がイベントに応じて発火
- [ ] 冪等性（同イベント重複送信が抑止）と失敗時の再送戦略が定義
- [ ] 通知オン/オフの設定が尊重される

### 9. 請求/プラン（軽量）
- [ ] プラン/チケットの残数・有効期限が予約フローで正しく検証される
- [ ] 取消/振替時の残数戻しが正しい
- [ ] 履歴/残数表示 UI が整合

### 10. 非機能/品質
- [ ] セキュリティ: CSRF/入力検証/RBAC バイパス試行に耐性
- [ ] パフォーマンス: 主要ページの初回描画が許容範囲、API p95 指標達成
- [ ] アクセシビリティ: 重要導線に対するラベル/コントラスト/フォーカスリング確認
- [ ] ログ/監査: 重要イベントの記録/閲覧（将来設計なら方針が文書化）

### 11. テスト/CI/CD
- [ ] CI（lint/test/build）が PR で緑、プレビュー URL が生成
- [ ] 変更ファイルのカバレッジ >= 80%
- [ ] スキーマ変更時にマイグレーションが CI で検証される

### 12. 運用/監視
- [ ] エラートラッキングが致命的エラーを捕捉（開発/プレビューで確認）
- [ ] Neon のバックアップ/リストア手順が検証済み（dev 環境）
- [ ] 運用ランブック（権限付与/ロールバック/障害対応）が docs に存在

### 13. ドキュメント/ナレッジ
- [ ] 基本設計書が最新（機能・API・モデル差分反映）
- [ ] ER 図が現行スキーマと一致（主/外部キー・インデックス）
- [ ] テスト計画/仕様が主要フロー/異常系をカバー
- [ ] セットアップ/開発ガイドが初見で迷いなく動作する
