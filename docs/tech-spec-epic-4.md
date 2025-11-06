# Tech Spec — Epic 4

作成日: 2025-11-06
対象エピック: Epic 4
目的（Goal）: レベル/場所/時間帯の適合度に基づき、提案→合意までをシンプルに完了できる

## 1. 概要
- 本ドキュメントは PRD（docs/prd.md）、アーキテクチャ（docs/architecture.md）、UX（該当時）に基づき、Epic 4 の技術仕様を示す。
- ストーリーは単一セッションで完了できる粒度を維持する。

## 2. 対象範囲（Scope）
- 含む: 下記ストーリー一覧の機能
- 含まない: 他エピックの機能（依存は明記）

## 3. ストーリー一覧（Traceability）
- 4.1 — to create and edit my match profile (level/area/available times)
- 4.2 — to search players with filters (level range/area/time)
- 4.3 — to compute a compatibility score based on level distance, area proximity, and time overlap
- 4.4 — to send a match proposal and the other player can accept/decline
- 4.5 — to cross-check proposals with both players' calendars for conflicts
- 4.6 — a minimal in-app conversation thread on a proposal
- 4.7 — to block or report another player


## 4. 依存関係 / 事前条件
- 共通基盤（認証/DB/テーマ等）: Epic 1 を前提
- 関連API/データ構造: docs/architecture.md の該当章を参照

## 5. データモデル / スキーマ（概要）
- 主要エンティティと関係（必要最小限）。詳細は実装時に拡張

## 6. API / インターフェース（概要）
- tRPC ルーター/手続きの一覧（入力/出力 zod スキーマ）
- エラー shape: { code, message, details? }

## 7. NFR アラインメント
- パフォーマンス: 初回<2s/P95<300ms を意識したAPI設計/キャッシュ
- セキュリティ: JWT/RBAC/監査ログの適用
- 可用性: 監視/ロギング/SLO観点

## 8. 受け入れ基準のカバレッジ
- 各ストーリーの Given/When/Then を満たす設計になっていること

## 9. リスク / 留意点
- 技術的複雑性、依存、段階的ロールアウト計画

## 10. 実装ノート（Tasksのヒント）
- 実装用タスクの雛形と留意事項
