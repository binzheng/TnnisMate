# 作業手順と成果物一覧

版: v0.1 / ステータス: Draft

本書はバックログ（docs/task.md）に対応する、実行手順（How）と成果物（What）を簡潔にまとめたものです。

## 0. プロジェクト初期設定
- 手順
  - `npm create t3-app@latest` で雛形作成（既存ならスキップ）
  - ESLint/Prettier 設定をプロジェクト方針へ整合
  - Vitest/RTL を導入しサンプルテストを実行
  - `src/` 配下のディレクトリを `features/components/lib` に整理
  - `.env.example` を整備
- 成果物
  - 設定ファイル: `.eslintrc.*`, `.prettierrc`, `vitest.config.*`
  - ディレクトリ構成: `src/features`, `src/components`, `src/lib`
  - サンプルテスト: `src/__tests__/health.test.ts`
  - ドキュメント更新: `README.md`, `docs/README.md`

## 1. インフラ/環境
- 手順
  - Neon で dev/preview/prod データベース作成
  - Vercel でプロジェクト作成、Git と連携
  - 環境変数を各環境に設定（`DATABASE_URL`, `NEXTAUTH_*`）
  - Prisma のマイグレーション運用方針を定義
- 成果物
  - Neon インスタンス3種（接続情報）
  - Vercel プロジェクト（Preview URL 発行）
  - 運用メモ: `docs/design/basic-design.md:13` 及び `docs/task.md: インフラ`

## 2. 認証/認可（RBAC）
- 手順
  - NextAuth を Email/Passwordless で設定
  - Prisma に User/Account/Session/VerificationToken を定義
  - `role: ADMIN|COACH|STUDENT` を `User` に追加しシード
  - tRPC middleware で `ctx.session.user.role` を検証、所有権チェックを実装
  - 最低限のサインイン/アウト UI を実装
- 成果物
  - スキーマ: `prisma/schema.prisma`（User + role）
  - シード: `prisma/seed.ts`
  - 認可ユーティリティ: `src/lib/authz.ts`
  - tRPC 中間層: `src/server/trpc/middleware/auth.ts`
  - ページ: `src/app/(auth)/sign-in/page.tsx`
  - テスト: `src/__tests__/authz.test.ts`

## 3. データモデル/マイグレーション
- 手順
  - エンティティを Prisma で定義（Court/Lane/LessonSlot/Reservation 等）
  - 主要制約・インデックスを設計
  - 初期シード（コート/レーン、ダミーユーザ/枠）
  - `prisma migrate dev` → `migrate deploy` を通す
- 成果物
  - `prisma/schema.prisma`, `prisma/migrations/*`
  - シードデータ: `prisma/seed.ts`
  - ER 図: `docs/er/diagram.mmd`（Mermaid）

## 4. API（tRPC ルータ）
- 手順
  - ルータ単位で zod スキーマを作成（入出力）
  - 認可ミドルウェアを適用
  - Prisma 経由のクエリ/トランザクションを実装
  - 正常/異常系のテストを作成
- 成果物
  - ルータ: `src/server/api/routers/*.ts`
  - スキーマ: `src/server/api/schemas/*.ts`
  - テスト: `src/__tests__/api/*.test.ts`

## 5. フロントエンド UI/UX
- 手順
  - MUI テーマ/レイアウト（AppBar/Drawer）作成
  - 主要ページをルーティング（dashboard/schedule/reservations/...）
  - カレンダー/フォーム/テーブル等の共通コンポーネントを実装
  - `react-hook-form` + `@hookform/resolvers/zod` を適用
- 成果物
  - レイアウト: `src/app/(app)/layout.tsx`
  - ページ: `src/app/dashboard/page.tsx`, `src/app/schedule/page.tsx` 等
  - 共通 UI: `src/components/ui/*`
  - フォーム: `src/components/forms/*`
 - 追加（レスポンシブ対応）
   - 手順: MUI ブレークポイント（xs/sm/md/lg/xl）を用意し、Grid/Stack/Hidden を用いた再配置。モバイルはボトムナビ/簡素ヘッダに最適化。`next/image` 利用。
   - 成果物: レスポンシブスタイル定義（各コンポーネント内）、検証レポート `docs/testing/responsive-check.md`（375/768/1024/1440 のスクショ/確認項目）

## 6. ダッシュボード/KPI
- 手順
  - KPI 算出式をコード化（Prisma/SQL）
  - 期間/フィルタを引数化し tRPC で提供
  - チャートラッパ（Chart.js/Recharts）を作成
- 成果物
  - ルータ: `src/server/api/routers/dashboard.ts`
  - 集計ユーティリティ: `src/lib/metrics.ts`
  - チャート: `src/components/charts/*`
  - サンプルデータ: `src/__tests__/fixtures/kpi.json`

## 7. コーチ業務/運用
- 手順
  - シフト入力/担当割当の UI/API を実装
  - 出欠記録の UI/API を実装（モバイル最適化）
- 成果物
  - ルータ: `src/server/api/routers/coach.ts`, `attendance.ts`
  - ページ: `src/app/coach/attendance/page.tsx`
  - テスト: `src/__tests__/coach/*.test.ts`

## 8. 通知/外部連携
- 手順
  - メール送信基盤（トランスポート/MJML などのテンプレ）
  - 予約/変更/キャンセル/出欠でイベントハンドラを実装
- 成果物
  - メール: `src/lib/mailer.ts`, `src/templates/email/*`
  - イベント: `src/server/events/*.ts`
  - 設定: `.env.example` にメール関連キー

## 9. 請求/プラン（軽量）
- 手順
  - プラン/チケット最小モデルを実装
  - 予約時の残数検証と振替/取消時の戻しロジック
- 成果物
  - Prisma: `PricingPlan` などのモデル
  - ルータ: `src/server/api/routers/billing.ts`
  - UI: `src/app/billing/*`

## 10. 非機能/品質
- 手順
  - セキュリティ対策（CSRF、XSS、RBAC 抜け）
  - パフォーマンス計測（p95、N+1 チェック）
  - アクセシビリティの基本対応
- 成果物
  - セキュリティ方針: `docs/design/basic-design.md:11`
  - 計測レポート: `docs/testing/perf-report.md`
  - a11y チェックリスト: `docs/testing/a11y.md`

## 11. テスト/CI/CD
- 手順
  - 単体/結合/統合テストの整備、カバレッジ閾値設定
  - GitHub Actions で lint/test/build/preview を自動化
  - Prisma マイグレーション検証を CI に追加
- 成果物
  - ワークフロー: `.github/workflows/ci.yml`
  - テスト: `src/__tests__/**/*`
  - カバレッジ設定: `vitest.config.*`

## 12. 運用/監視
- 手順
  - エラートラッキング導入（Sentry 等、任意）
  - Neon バックアップ/リストアの手順検証
  - 運用ランブック作成
- 成果物
  - 監視設定: `docs/operations/monitoring.md`
  - DB 手順: `docs/operations/neon-backup-restore.md`
  - ランブック: `docs/operations/runbook.md`

## 13. ドキュメント/ナレッジ
- 手順
  - 基本設計の継続更新、差分管理
  - ER 図の更新（スキーマ変更ごと）
  - テスト計画/仕様の充実
- 成果物
  - 基本設計: `docs/design/basic-design.md`
  - ER 図: `docs/er/diagram.mmd` or `docs/er/diagram.png`
  - テスト計画/仕様: `docs/testing/test-plan.md`, `docs/testing/specs/*`

---

補足:
- コマンド例
  - 開発: `npm run dev`
  - ビルド: `npm run build`
  - 预览: `npm run preview`
  - Lint: `npm run lint`
  - テスト: `npm run test` / カバレッジ: `npm run test -- --coverage`
- PR には DoD/スクリーンショット/関連 Issue を記載してください。
