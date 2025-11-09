# Story 1.3: to configure NextAuth (Credentials) Prisma Adapter with JWT

Status: done

## Story

As a developer,
I want to configure NextAuth (Credentials) + Prisma Adapter with JWT,
so that ログインとRBACの基礎が利用できる。.

## Acceptance Criteria

1. Given `/api/auth/[...nextauth]` が実装され When ユーザーID+パスワードで認証 Then JWT セッションが発行され、`ctx.session` からロール参照できる
2. [CA] UseCases/Domain 層にフレームワーク依存（NextAuth/Prisma型）を持ち込まないこと
3. [CA] ルーター(tRPC)→ UseCase → Adapter(Prisma/NextAuth) の責務分離・依存逆転を満たすこと
4. [CA] Port/Adapter のインターフェースと実装が `src/server/core`（Port/UseCase）と `src/server/adapters`（Prisma/NextAuth実装）に分離されていること
5. [CA] 認証ユースケースのInMemory単体テストを1件以上追加すること（資格情報の検証/ロール反映）

## Tasks / Subtasks

- [ ] Implement per acceptance criteria
- [x] Define AuthPort (verifyCredentials, getUserById, etc.) under src/server/core/usecases/auth
- [x] Implement AuthAdapter (Prisma/NextAuth) under src/server/adapters/auth（構造）
- [ ] Add UseCase (SignIn) and map to tRPC route; inject ports in composition root
- [x] Add InMemoryAuthAdapter for unit tests; cover positive/negative cases

## Dev Notes

- Technical Notes: bcrypt でハッシュ化 / Prisma User モデルに `role` 追加 / 環境変数 `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- Prerequisites: Story 1.1

### References

- Source: docs/epics.md
- Source: docs/architecture.md
- Source: docs/prd.md

## Dev Agent Record

### Context Reference

<!-- Story Context XML will be attached by story-context workflow -->

### Agent Model Used

N/A

### Debug Log References

N/A

### Completion Notes List

- CA準拠のスケルトンを追加（Port/UseCase/Adapter/DI）。tRPCへの組込みとbcrypt検証は後続。

### File List

- TBD
