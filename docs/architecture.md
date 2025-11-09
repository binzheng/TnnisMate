# Architecture

## Project Context Understanding

私はTennisMateのプロジェクト文脈を確認しました（スタンドアロン実行）。

- 対象: テニススクール運営システム
- 主要ユーザー: 一般プレイヤー、コーチ、クラブ/施設運営者
- 主要ユースケース: 対戦相手のマッチング、コート検索・予約、スコア記録・戦績管理、レッスン予約/コーチ検索
- 主要FR: 受講者/コーチのスケジュール可視化・予約管理、テニス大会のマッチング、施設/コート在庫の一括インポート/同期
- 主要NFR: P95 API < 300ms/初回ロード<2s、稼働率99.9%、OAuth2/OIDC+監査ログ、水平スケール方針
- 制約/前提: T3 Stack（Create T3 App）を採用、PC/スマホのレスポンシブ対応

この理解で進めて問題ありませんか？

---

## Executive Summary

本アーキテクチャは、テニススクール運営（予約・マッチング・レッスン・在庫同期・戦績）を迅速かつ安定に提供するため、T3 Stack（Next.js App Router + TypeScript + tRPC + Prisma + NextAuth）を基盤に、Neon（PostgreSQL）・Vercel・S3 + UploadThing で構成する。NFR（初回 < 2s / P95 API < 300ms・稼働率 99.9%）達成のため、JWT 認証と単一テナント RBAC、ISR/HTTP/アプリ内キャッシュ、構造化ログ + Sentry を採用し、Phase 1 ではメール通知とリアルタイム更新を除外して複雑性を抑制する。将来は facility スコープやリアルタイム、外部検索/ジョブ基盤へ段階的に拡張可能な設計とする。

プロジェクト初期化（Project Initialization）

- テンプレート: Create T3 App（T3 Stack）
- コマンド: `npm create t3-app@latest`
- 想定オプション: TypeScript=Yes, App Router=Yes, tRPC=Yes, Prisma=Yes, NextAuth=Yes, Tailwind=Yes
- リポジトリ名: `tennismate`（仮）
- 直後の作業: `.env.local` 設定 → Prisma Migrate → 開発サーバ起動

## スターターテンプレート選定（starter_template_decision）

- 採用テンプレート: Create T3 App（T3 Stack）
- 初期化コマンド（記録）:
  - `npm create t3-app@latest`
  - オプション想定: TypeScript=Yes, App Router=Yes, tRPC=Yes, Prisma=Yes, NextAuth=Yes, Tailwind=Yes
- スタータが提供する意思決定（PROVIDED BY STARTER）:
  - フレームワーク: Next.js（App Router）
  - 言語/型: TypeScript
  - API パターン: tRPC（型安全RPC）
  - データアクセス: Prisma ORM
  - 認証: NextAuth.js
  - スタイリング: Tailwind CSS
  - 品質: ESLint/Prettier（基本設定）
- バージョン検証: 現在の環境はWeb検索が制限されているため検証は保留。実行時点の安定版/LTSを採用し、後でバージョンを明記して更新する。
- スターターバージョン: ct3aMetadata.initVersion = 7.40.0（`tennis_mate/package.json` のメタデータに基づく）
- 初回実装ストーリー: 「`npm create t3-app@latest` を用いたプロジェクト初期化」を計画に追加。

---

## 残りの意思決定の特定（decision_identification）

前提（T3 Stack, Next.js+TypeScript+tRPC+Prisma+NextAuth+Tailwind）に基づき、スタータで提供されない、または具体化が必要な意思決定を優先度順に整理します。

1. クリティカル（全体をブロックし得る）

   - データ永続化: PostgreSQL 版数と運用方針（マネージド: Supabase/Neon/Render など or 自前）
   - 認証プロバイダ: メール/パスワード、OAuth（Google/Apple）組み合わせ、ロール設計（受講者/コーチ/施設運営者）
   - デプロイ先: Vercel（推奨）/AWS 他、および環境分離（dev/stg/prod）
   - ドメイン/多テナント方針: 施設ごとのテナンシ（サブドメイン or 単一テナント＋権限境界）
2. 重要（アーキテクチャ形状に影響）

   - スキーマ設計: 予約・コート在庫・大会エンティティ（正規化、楽観ロック/在庫整合）
   - 通知チャネル: メール/プッシュ/カレンダー連携（ICS）
   - ファイル保管: 画像・添付（S3/Cloudinary/UploadThing）
   - バックグラウンド処理: リマインド/在庫同期（BullMQ/Cloud Scheduler/CRON）
   - ロギング/監視: 収集とアラート（OpenTelemetry/LogDrain/Sentry）
3. 望ましい（後回し可）

   - 検索: 施設/大会検索の全文検索（Postgres FTS / Typesense / Algolia）
   - リアルタイム: 予約状態更新/対戦マッチングのライブ反映（Ably/Pusher/Socket.io）
   - 国際化/I18N: 言語切替と日付/通貨表記

スタータで既にカバー済み（再掲）

- TypeScript, Next.js(App Router), tRPC, Prisma, NextAuth, Tailwind, ESLint/Prettier

この優先順位で合意いただければ、クリティカル項目から順に意思決定を進めます。

---

## Decision Summary


| Category                     | Decision                                                 | Version              | Affects Epics                   | Rationale                                                                      |
| ---------------------------- | -------------------------------------------------------- | -------------------- | ------------------------------- | ------------------------------------------------------------------------------ |
| Data Persistence             | Neon (PostgreSQL) + Prisma ORM                           | Pending verification | 全エピック                      | サーバレスPostgresでVercelと相性良、ブランチ/拡張性良                          |
| Authentication/Authorization | NextAuth（Credentialsのみ）+ Prisma RBAC（単一テナント） | Pending verification | セキュリティ/ユーザー系エピック | ユーザーID+パスワードで認証。HTTP Basicは使用せず、API/フロントともにJWTベース |
| Deployment Target            | Vercel（dev/stg/prod + Preview）                         | Pending verification | 全エピック                      | Next.js最適化、プレビュー/環境分離が容易、NFRに合致                            |
| Domain/Tenancy               | 単一テナント（facility_id スコープなし、グローバルRBAC） | N/A                  | 施設運営/ユーザー全般           | 初期をシンプルに。将来 facility スコープや多テナントへ拡張可能                 |
| File Storage                 | Amazon S3 + UploadThing                                  | Pending verification | メディア/プロフィール/大会資料  | Next.js/Vercel と相性良、実装容易で拡張性あり                                  |
| Notifications (Email)        | 当面不要（Phase 1 では未実装）                           | N/A                  | リマインド/お知らせ系           | ユーザー要望により初期スコープ外。将来必要時に採用検討                         |
| Search                       | PostgreSQL Full-Text Search                              | Pending verification | 検索系                          | まずはDB内で完結、将来 Typesense/Algolia を検討                                |
| Real-time                    | 当面不要（Phase 1 では未実装）                           | N/A                  | ライブ更新                      | 予約/在庫はポーリング/再取得で許容。将来 Ably/Pusher を検討                    |
| Background Jobs              | Vercel Cron（スケジュール実行）                          | N/A                  | リマインド/在庫同期             | まずはcron実行で十分。必要に応じてキュー導入                                   |

## Decision Record（decision_record）

カテゴリ: データ永続化（PostgreSQL 運用方式）
決定: Neon（Serverless PostgreSQL）+ Prisma ORM
影響するエピック: スケジュール/予約、在庫同期、大会マッチング、ユーザー管理 ほか全般
バージョン: Postgres（Neon）/Prisma は Version Matrix に準拠
検証日: 2025-11-06（Version Matrix に準拠）
根拠（要旨）: Vercel との親和性、ブランチ/スケール特性、コスト効率、運用容易性

波及事項（次に決めること）

- 接続方式: 直結 or Prisma Accelerate（接続最適化）
- コネクションプーリング: Neon（pgBouncer）設定方針
- 環境変数: `DATABASE_URL` の管理（dev/stg/prod, .env.local）
- マイグレーション: Prisma Migrate の運用（安全な rollout/rollback）
- バックアップ/復元: Neon の PITR/ブランチ利用方針

## Decision Record（decision_record）- Authentication

カテゴリ: 認証/認可
決定: NextAuth.js（Credentials Provider／ユーザーID+パスワード認証）+ Prisma Adapter、単一テナントRBAC（roles: player/coach/facility_admin/admin）。OAuthは採用しない。HTTP Basic認証は使用せず、API も Bearer JWT を採用。
影響するエピック: ユーザー管理、予約/在庫、レッスン、マッチング、運用管理
セッション: JWT（短期）
パスワード保護: bcrypt によるハッシュ保存、強度ポリシー（長さ/複雑性）
ロール付与: `User.role` 列（enum）で管理、UI/権限チェックを共通化
バージョン: NextAuth/Prisma は Version Matrix に準拠
検証日: 2025-11-06（Version Matrix に準拠）
根拠（要旨）: T3 構成と親和、実装・運用のシンプルさ。ユーザーID/パスワード中心で運用ポリシーを簡潔化。

波及事項（次に決めること）

- セキュリティ強化: レート制限、2FA/MFA（将来追加可）
- メール基盤: パスワードリセット/検証メール（Resend/Postmark/SES）
- 監査: ログイン/権限変更の監査ログ保管
- 権限ガード: サーバ/クライアント双方のミドルウェア整備
- API認証の扱い: Bearer JWT を使用（TLS必須、短期トークン＋ローテーション、必要に応じてスコープ/ロール付与）。

## Decision Record（decision_record）- Deployment

カテゴリ: デプロイ先
決定: Vercel を採用（dev/stg/prod 環境分離、Pull Request Preview 有効化）
影響するエピック: 全て（UX/NFR/運用フロー）
構成要点:

- Next.js SSR/ISR 最適化の既定挙動を活用（App Router）
- 環境変数管理: Vercel 環境ごとに `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` 等を登録
- 地理・レイテンシ: リージョンはユーザー層に近いリージョンを選択（後日確定）。Edge Functions は必要箇所に限定採用
- CI/CD: GitHub 連携で自動デプロイ、Previewでレビュー→stg→prod のゲートを設定
- 画像/キャッシュ: Next/Image 最適化、ISR の TTL 設計
- Node バージョン: 20.x LTS（Version Matrix に準拠）
  バージョン/検証日: 2025-11-06（Version Matrix に準拠）
  根拠（要旨）: Next.js との親和性が高く、初速と運用容易性がNFRに合致

波及事項（次に決めること）

- ドメイン設定とHTTPS（Custom Domain, DNS）
- シークレットのローテーション方針
- 監視/ログの収集（Vercel + 外部SaaS）
- Preview でのデータ分離（stg DB/ストレージ）

## Decision Record（decision_record）- Tenancy

カテゴリ: ドメイン/テナンシ境界
決定: 単一テナントで開始。`facility_id` によるスコープは当面導入しない。RBAC はグローバル（roles: player/coach/facility_admin/admin）。
影響するエピック: 施設運営、予約/在庫、大会、ユーザー管理
理由（要旨）: 初期の複雑性を抑え、スピードを重視。将来の拡張（施設スコープ、多テナント/サブドメイン）に移行可能なスキーマ設計を前提にする。
移行パス（将来）:

- スキーマに `facility_id`（NULL許容）を追加→段階的にNOT NULL化
- 認可にスコープ（facility_id）を導入→UI/APIのクエリにフィルタ適用
- 必要に応じて `tenant/org` テーブルとドメインルーティング（サブドメイン）を追加
  リスク/留意点:
- 施設境界がないため、施設管理者の一覧/集計には権限フィルタの抜け漏れに注意
- 監査ログで操作主体（roleと対象範囲）を必ず記録

## Decision Record（decision_record）- File Storage

カテゴリ: ファイル保管（画像・添付）
決定: Amazon S3 + UploadThing を採用
影響するエピック: プロフィール画像、施設画像、資料アップロード、エビデンス保管
構成要点:

- バケット: 環境別に分離（例: `tennismate-dev-uploads`, `tennismate-stg-uploads`, `tennismate-prod-uploads`）
- 可視性: 基本 private。公開が必要な場合は署名付きURL or CDN経由
- CORS: Vercel ドメイン（Preview含む）からのアップロード/取得を許可
- 暗号化: SSE-S3（サーバ側暗号化）を有効化、必要に応じてSSE-KMSへ移行
- ライフサイクル: 一時ファイルは 30〜90 日で自動削除、バージョニングは必要箇所のみ
- CDN: 初期はS3直/Next/Image活用。将来 CloudFront を検討
- 地理: 主要ユーザーに近いリージョンを選択
- エラーハンドリング: 失敗時のリトライ/ユーザー通知を標準化
  環境変数（例）:
- `UPLOADTHING_SECRET`, `UPLOADTHING_APP_ID`
- `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET`, `S3_REGION`
  Next.js 実装方針:
- UploadThing のルーター/エンドポイントを App Router で実装（サーバーアクション/ハンドラ）
- 認可: ロール/サイズ/拡張子をサーバ側で検証
  バージョン/検証日: （後で検証して明記）
  根拠（要旨）: Vercel/Next.js との親和性、実装容易性、将来の画像最適化/配信戦略に展開しやすい

## Decision Record（decision_record）- Notifications (Email)

カテゴリ: 通知（メール）
決定: Phase 1 ではメール通知機能を実装しない
影響するエピック: 予約リマインド/変更通知、大会進行通知、パスワードリセット
代替/運用:

- 通知は当面アプリ内通知（トースト/ダッシュボード表示）で代替
- パスワードリセットは管理者経由の暫定運用、または後続フェーズで実装
- 重要連絡は当面アプリ内に限定（外部配信なし）
  将来拡張:
- 必要性が生じた時点で Resend/Postmark/SES を比較し採用。テンプレート基盤は React Email を候補
  リスク/留意点:
- アカウント回復体験が弱い（メール不在のため）→ 将来の2FA/MFAや通知導入で補完
- 施設運営者への一斉連絡の手段が限定的→ ダッシュボード告知/エクスポート等で暫定対応

## Project Structure（project_structure）

```
tennismate/
  .env.example
  package.json
  tsconfig.json
  next.config.mjs
  .eslintrc.cjs
  prisma/
    schema.prisma
    migrations/
  public/
    favicon.ico
  src/
    app/
      layout.tsx
      page.tsx
      api/
        auth/[...nextauth]/route.ts
    server/
      db.ts
      auth.ts
      trpc.ts
      api/
        routers/
          index.ts
          reservations.ts
          matching.ts
          lessons.ts
          inventory.ts
          scores.ts
    features/
      reservations/
      matching/
      lessons/
      inventory/
      scores/
    components/
      ui/
      layout/
    lib/
      dates.ts
      auth.ts
      logger.ts
    __tests__/
      features/
        reservations/
        matching/
        lessons/
        inventory/
        scores/
  scripts/
    seed.ts
```

## Epic to Architecture Mapping


| Epic                    | Module/Directory            | Primary APIs              | Notes                              |
| ----------------------- | --------------------------- | ------------------------- | ---------------------------------- |
| 予約・スケジュール管理  | `src/features/reservations` | `routers/reservations.ts` | カレンダー表示/重複チェック/ロック |
| 対戦相手マッチング      | `src/features/matching`     | `routers/matching.ts`     | レベル/位置/時間帯マッチング       |
| レッスン予約/コーチ検索 | `src/features/lessons`      | `routers/lessons.ts`      | コーチ枠/料金/キャンセルポリシー   |
| 施設・コート在庫同期    | `src/features/inventory`    | `routers/inventory.ts`    | バルクインポート/差分更新/監査     |
| スコア記録・戦績管理    | `src/features/scores`       | `routers/scores.ts`       | 試合結果/ランキング/履歴           |

## Technology Stack Details

### Core Technologies

- Next.js (App Router), TypeScript, tRPC, Prisma, NextAuth.js, Tailwind CSS
- DB: Neon (PostgreSQL) + Prisma ORM
- 認証: NextAuth Credentials + JWT、RBAC（単一テナント）
- ストレージ: Amazon S3 + UploadThing
- デプロイ: Vercel（dev/stg/prod + Preview）

### Integration Points

- tRPC コンテキスト: NextAuth セッションを注入し RBAC を実施
- Prisma ↔ Neon: `DATABASE_URL` で接続、pgBouncer/Accelerate は後日検討
- UploadThing ↔ S3: 署名付きアップロード、認可はサーバ側で検証
- Vercel 環境変数: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `DATABASE_URL`, `S3_*`, `UPLOADTHING_*`

### Version Matrix

本プロジェクトの実態（`tennis_mate/package.json`）に基づいて確定。必要に応じてセットアップ時に再検証し、検証日と出典を更新する。


| Component    | Version       | Source                 | Verification                        |
| ------------ | ------------- | ---------------------- | ----------------------------------- |
| Node.js      | 20.x LTS      | Runtime policy         | 2025-11-06（ローカル環境方針）      |
| Next.js      | 15.2.3        | package.json           | 2025-11-06（`^15.2.3`）             |
| TypeScript   | 5.8.x         | package.json           | 2025-11-06（`^5.8.2`）              |
| Prisma       | 6.6.x         | package.json           | 2025-11-06（`^6.6.0`）              |
| tRPC         | 11.x          | package.json           | 2025-11-06（`^11.0.0`）             |
| NextAuth.js  | 5.0.0-beta.25 | package.json           | 2025-11-06（`5.0.0-beta.25`）       |
| Tailwind CSS | 4.0.x         | package.json           | 2025-11-06（`^4.0.15`）             |
| UploadThing  | 6.x           | Architectural decision | 2025-11-06（採用方針、導入時にpin） |

Verification Date: 2025-11-06
Verification Sources:

- `tennis_mate/package.json` の依存宣言
- Node.js LTS 方針（実行環境ガイドライン）

### Novel Pattern Designs

現時点では既存パターンで対応可能。新規性が高いワークフローが判明した場合に本節を拡張する。

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

### Naming Conventions

- データベース: テーブル/カラムは `snake_case`、テーブルは複数形（例: `reservations`, `court_inventories`）。Prisma モデルは `PascalCase`、フィールドは `camelCase` にマッピング
- tRPC ルーター: 機能単位で命名（例: `reservations`, `matching`）、procedure は動詞+対象（例: `create`, `update`, `listByDate`）
- React コンポーネント: ファイル/コンポーネント名は `PascalCase`（例: `ReservationCard.tsx`）、hooks は `useXxx`（例: `useMatching`）
- ファイル: ユーティリティは `camelCase`、テストは `*.test.ts(x)`、型は `*.types.ts`

### Code Organization

- 構成: `src/features/{domain}` に UI/ロジック/スタイル/フックを同居、共有UIは `src/components`、横断ユーティリティは `src/lib`
- サーバ: `src/server/api/routers/{feature}.ts` に tRPC ルーター、`src/server/db.ts` に Prisma クライアント
- テスト: `src/__tests__/features/**` に機能テスト、サーバAPIは統合テストを追加

### Error Handling

- サーバ: 予見可能な失敗は `TRPCError` で分類（`BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`）
- クライアント: 失敗時はトースト+リトライガイド、致命的はエラー境界へ委譲
- 監査: 重要操作（予約生成/キャンセル/在庫更新）はユーザーID・ロール・対象IDを構造化ログへ

### Optional Decisions の延期基準（運用ガイド）

次の条件に該当する場合は延期し、根拠を記録する。

- リスク低・価値低であり、MVPスコープ外（例: メール通知）
- 外部サービス選定の比較検証が未了（例: Resend/Postmark/SES）
- 依存タスク（DBスキーマ確定、Auth方式確定など）が未完で実装の前提が揃っていない
- セキュリティ/運用面のレビュー待ち（権限境界、監査要件など）

### Logging Strategy

- 重要イベントは JSON で `level`, `msg`, `userId`, `role`, `resource`, `requestId` を含める
- クライアントは開発時 `console`、本番は最小限。サーバは Vercel Logs + 将来 Sentry 導入

### Date/Time Handling

- 永続化は UTC ISO 文字列。表示はローカルタイム。`src/lib/dates.ts` にフォーマッタを集約
- 期間/重複チェックはサーバで実施（予約の競合回避）

### API Patterns (tRPC)

- 入力/出力は zod スキーマで型検証。戻り値はドメインDTO（UIでそのまま使える構造）
- エラー shape を統一: `{ code, message, details? }`

### AuthZ Patterns

- tRPC コンテキストで JWT 検証→ `ctx.session` を注入、手前でロールチェック
- UI でもロールでレンダリング切替（リンク/操作の出し分け）

### Forms and State

- フォームは React Hook Form + zodResolver。送信時はローディング/成功トースト/エラー表示を統一
- 一覧はページング（デフォルト 20 件）、無限スクロールは後続検討

### Files/Uploads

- UploadThing のポリシーで拡張子/サイズ/ロールを検証。S3 は private、取得は署名付きURL

### Testing

- 単体: ユーティリティ/スキーマ/コンポーネント（重要ロジック）
- 統合: tRPC ルーター（Prisma のテストスキーマを使用）
- 命名: `*.test.ts` / `*.test.tsx`、カバレッジ 80% 目標（変更箇所）

### Backend Clean Architecture（追加要件）

目的: フレームワーク依存を境界外に押し出し、ユースケース主導で保守性とテスト容易性を高める。

- レイヤ定義（内側ほど純粋）

  - Domain（Entities/Value Objects/Domain Services）
  - UseCases（Application Services/Interactors）
  - Interface Adapters（Controllers/Presenters/Mappers/Repository Implementations）
  - Infrastructure（Prisma/外部API/ストレージ/送信処理）
- 依存ルール

  - 依存の向きは内向きのみ（Infrastructure → Adapters → UseCases → Domain）
  - Domain/UseCases は Next.js/Prisma/NextAuth 等の具象に依存しない（型・関数も不可）
  - UseCases は Port/Repository Interface にのみ依存（adapter はそれを実装）
  - tRPC ルーターは Adapter（UI/API）として UseCases を呼び出す
- ディレクトリ（プロジェクトルートまたはアプリ配下。例: `src/server`）

  - `src/server/core/domain` … エンティティ/値オブジェクト/ドメインサービス
  - `src/server/core/usecases` … ユースケース（入力/出力DTO・Port定義含む）
  - `src/server/adapters` … Repository実装（Prismaなど）/ Presenter / Mapper
  - `src/server/infrastructure` … PrismaClient/外部APIクライアント/設定
  - `src/server/interfaces` … tRPCルーター・HTTPハンドラ（外縁）
- 実装規約

  - Domain/UseCases から Prisma 型/NextAuth セッション型を参照しない
  - Repository Port は最小限のメソッドに分割（書き込みと読み取りの分離を優先）
  - DI（依存注入）は Composition Root（tRPC ルーター作成時）で行う
  - DTO は UseCases 外部との境界で定義し、Mapper で相互変換
  - ユースケースは副作用を Adapter に委譲し、純粋なビジネスロジックに集中
- テスト戦略

  - UseCases はポータブルに単体テスト（InMemory Adapterで検証）
  - Adapter は契約テストでポート準拠と副作用を検証
  - tRPC はルート毎の結合テスト（Auth/権限/バリデーションを含む）
- 受け入れ基準への反映（各バックエンドStoryに追加）

  - [CA] UseCases/Domain 層にフレームワーク依存を持ち込まない
  - [CA] ルーター→UseCase→Adapter の呼び出し連鎖と責務分離を保持
  - [CA] Port/Adapter のインターフェース・実装が `src/server/core` と `src/server/adapters` に分離されている
  - [CA] 最低1件のユースケース単体テスト（InMemory）を追加

## Cross-Cutting Decisions（cross_cutting_decisions）

エラー処理

- サーバ: tRPC の `TRPCError` で分類（BAD_REQUEST/UNAUTHORIZED/FORBIDDEN/NOT_FOUND/INTERNAL）
- クライアント: エラー境界 + トースト通知、再試行ガイドを統一
- 監査的失敗は必ずログに記録（ユーザーID/ロール/リクエストID）

ロギング/トレーシング

- エラートラッキング: Sentry（Phase 1 導入）
- ログ: Vercel Logs を使用、重要イベントは構造化JSONで出力
- 要否に応じて OpenTelemetry を将来導入（OTLP エクスポート）

日付/時刻

- サーバ保存は全て UTC（ISO 8601 文字列）
- 表示はユーザーのローカルタイムゾーン。共通のフォーマッタ util を提供

API/レスポンス（tRPC）

- 成功: 明確なデータスキーマ（zod）
- 失敗: `code`, `message`, `details?` を統一（tRPC エラーのshapeを共通化）

認証/認可

- API は Bearer JWT を必須。ミドルウェアで検証、ロールチェックを共通化

テスト方針

- 単体: zod スキーマ/サービスロジック中心（Vitest もしくは Jest、T3 標準に合わせる）
- 統合: tRPC ハンドラ、Prisma リポジトリの結合テスト（DBはテスト用スキーマ）
- E2E: 重要フロー（予約、マッチング）を後続で追加

## Consistency Rules

### Naming Conventions

- DB: `snake_case`（複数形テーブル）、Prisma: `PascalCase`/`camelCase`
- API: ルーターは機能名、procedure は動詞+対象
- フロント: コンポーネント `PascalCase`、hooks `useXxx`、テスト `*.test.ts(x)`

### Code Organization

- ドメイン別の features 構成、共有UIは `src/components`、横断は `src/lib`
- サーバAPIは `src/server/api/routers` に集約、DB クライアントは `src/server/db.ts`

### Error Handling

- tRPC の標準分類＋共通エラーshape `{ code, message, details? }`
- 監査対象操作は構造化ログに必ず記録

### Logging Strategy

- サーバは構造化JSON、重要キー: `level,msg,userId,role,resource,requestId`
- Sentry を導入、Vercel Logs を併用。PII は出力しない

## Data Architecture

主要エンティティと関係（概略）

- User(1) — (N) Reservation（作成者）
- Facility(1) — (N) Court, Court(1) — (N) Reservation
- LessonSlot(1) — (N) Reservation（レッスン予約）
- Match(1) — (N) Score（戦績）
- InventoryImport(1) — (N) CourtInventory（在庫同期）

整合性

- 予約の重複回避は期間の重なりチェック（サーバ側で排他）
- 在庫同期は差分適用と監査ログを記録

## API Contracts

tRPC ルーター例（概略）

- `reservations.create(input: { courtId, start, end }) -> { id }`
- `reservations.listByDate(input: { date }) -> Reservation[]`
- `matching.search(input: { level, area, time }) -> User[]`
- すべて zod で型検証、エラーは共通 shape を返す

## Security Architecture

- 認証: NextAuth Credentials + JWT（短期トークン、ローテーション）
- 認可: 単一テナントRBAC。サーバ/クライアントの両方でガード
- レート制限: IP/ユーザー単位のスライディングウィンドウ（予約作成/認証エンドポイント）
- 秘密管理: Vercel 環境変数。ローカルは `.env.local`（git ignore）。定期ローテーション
- 監査: 重要操作は構造化ログ＋将来の監査テーブルを検討

## Performance Considerations

キャッシュ戦略

- Next.js ISR: 公開ページは適切な revalidate（例: 60–300s）
- HTTP キャッシュ: 画像/静的アセットは長期キャッシュ + ハッシュ
- アプリ内キャッシュ: クライアントは React Query/SWR を利用し短期キャッシュ
- DB/接続: コネクションプール（Neon/pgBouncer）、N+1 を避けるクエリ設計
- 計測: LCP/TTFB/CLS をモニタリング、閾値をダッシュボードで監視

## Deployment Architecture

- Vercel プロジェクト（dev/stg/prod）と PR Preview
- 環境変数を環境ごとに管理、権限を限定
- GitHub 連携で CI/CD、自動デプロイ。保護ブランチ＋承認フロー

## Development Environment

### Prerequisites

- Node.js LTS（v18+ 推奨）、npm または pnpm
- Vercel CLI（任意）
- Neon アカウント（PostgreSQL）
- AWS アカウント（S3 用）

### Setup Commands

```bash
# 1) T3 初期化
npm create t3-app@latest

# 2) 依存と環境変数
cp .env.example .env.local
# NEXTAUTH_URL, NEXTAUTH_SECRET, DATABASE_URL, S3_*, UPLOADTHING_* を設定

# 3) DB 初期化
npx prisma migrate dev
npx prisma db seed # 任意（scripts/seed.ts）

# 4) 開発サーバ
npm run dev
```

## Architecture Decision Records (ADRs)

- Data Persistence: Neon (PostgreSQL) + Prisma ORM（接続/マイグレーション/バックアップ方針）
- Authentication/Authorization: NextAuth Credentials + JWT、単一テナントRBAC
- Deployment: Vercel（dev/stg/prod + Preview、環境変数/CI/CD/リージョン）
- Domain/Tenancy: 単一テナント開始（将来 facility スコープ/多テナント化へ移行可）
- File Storage: Amazon S3 + UploadThing（private + 署名URL、ライフサイクル）
- Notifications: Phase 1 は未実装（将来評価）
- Search: PostgreSQL FTS（将来 Typesense/Algolia 検討）
- Real-time: Phase 1 は未実装（必要時に Ably/Pusher）
- Background Jobs: Vercel Cron（スケジュール実行）

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: ${ISO}_
_For: ben_
