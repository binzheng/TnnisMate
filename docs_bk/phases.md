# フェーズ一覧（Milestones）

版: v0.1 / ステータス: Draft

本書は TennisMate の開発を段階的に進めるためのフェーズ定義（M0〜M4）を示します。各フェーズは明確なスコープ・完了基準・成果物を持ち、順次リリース可能な形で進めます。

参照:
- 全体タスク: docs/task.md
- 検収基準: docs/task.md 内「完了確認チェックリスト（Verification）」
- 基本設計: docs/design/basic-design.md

対応デバイス/ブラウザ（共通要件）
- PC とスマートフォンを正式サポート（主ビューポート: 375/768/1024/1440）
- Chrome/Safari/Edge の最新系（自動更新2世代）

---

## M0: ブートストラップ & インフラ
- 目的
  - 開発基盤とCI/CD、DB/ホスティング環境の最小構築
- スコープ
  - t3-app 初期化、ESLint/Prettier/Vitest 設定
  - Neon(dev/preview/prod) と Vercel(Preview/Prod) 準備
  - Prisma 接続/マイグレーション方針、`.env.example` 整備
- 成果物
  - 稼働する dev 環境、Preview 自動デプロイ、初期テスト
- 完了基準
  - `npm run dev` 起動、CI で lint/test/build が緑、Preview URL 動作

## M1: 認証/RBAC/スケジュール参照/基本予約
- 目的
  - 最小限のユーザーフロー（ログイン〜枠参照〜予約/キャンセル）を成立
- スコープ
  - NextAuth（Email/Passwordless）+ RBAC（ADMIN/COACH/STUDENT）
  - スケジュール閲覧（カレンダー）と枠（LessonSlot）一覧
  - 予約作成/キャンセル、定員/重複チェック
- 成果物
  - 主要ページ: `/dashboard`, `/schedule`, `/reservations`
  - tRPC: `auth`, `schedule`, `reservation`
  - Prisma: User/Profile/Court/Lane/LessonSlot/Reservation
- 完了基準
  - Verification 該当項目(M1範囲)を満たす（認証/権限/予約の正常・異常テスト通過）
  - 主要ページが PC/スマホの主ビューポートで視認性・操作性を満たす

## M2: 出欠・コーチ業務・ダッシュボードKPI(一部)
- 目的
  - 運営日常業務（出欠記録/担当）を可能にし、KPIの可視化を開始
- スコープ
  - 出欠（Attendance）記録、コーチ担当割当（簡易シフト）
  - KPI: 予約率/出席率/レーン稼働率（時系列/フィルタ）
  - ダッシュボード UI（カード + チャート）
- 成果物
  - ページ: `/coach/attendance`, `/dashboard`
  - tRPC: `attendance`, `dashboard`, `settings`(一部)
  - 集計ユーティリティ: `metrics`（キャッシュ方針の雛形）
- 完了基準
  - Verification 該当項目(M2範囲)を満たす（KPIの代表データで期待値一致、p95<500ms）
  - 出欠/ダッシュボードがモバイルで操作しやすい（タップ領域 >=44px）

## M3: 試合管理/成績集計・ランキング
- 目的
  - 試合イベントの作成〜エントリー〜結果記録〜成績集計を提供
- スコープ
  - MatchEvent/Entry/Result モデル、対戦表（簡易版）
  - 成績集計（勝率/ランキング）、期間・レベル絞り込み
- 成果物
  - ページ: `/matches/[id]`
  - tRPC: `match`
  - テスト: 成績集計の正常・境界・異常系
- 完了基準
  - Verification 該当項目(M3範囲)を満たす（成績集計一致、UI/API テスト通過）

## M4: 請求（軽量版）・通知
- 目的
  - シンプルなプラン/チケット運用と基本通知の実現
- スコープ
  - PricingPlan 最小モデル、残数/有効期限検証、振替/取消時の整合
  - メール通知（予約/変更/キャンセル/出欠リマインド）
- 成果物
  - tRPC: `billing`（軽量）、通知イベント実装、メールテンプレ
  - UI: 残数/履歴表示
- 完了基準
  - Verification 該当項目(M4範囲)を満たす（残数整合、通知の冪等性・再送戦略）

---

## クロージング & ハードニング（任意の Mx）
- パフォーマンス最適化（N+1/インデックス/キャッシュ）
- セキュリティ監査、a11y 改善、観測性・監視の拡充
- ドキュメントの最終整備、運用ランブック確定

## 進め方の原則
- 各フェーズは 2〜4 週間スプリント相当を想定（チーム規模に依存）
- フェーズ完了の判定は docs/task.md の Verification による
- 各フェーズでデータマイグレーション/後方互換を考慮し、段階的リリースを維持
