# Story 1.5: to deploy the app to Vercel with environment

Status: drafted

## Story

As a developer,
I want to deploy the app to Vercel with environment variables,
so that  dev/stg/prod で動作が確認できる。.

## Acceptance Criteria

1. Given Vercel プロジェクト作成 When `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `DATABASE_URL` を登録 Then `main` ブランチのデプロイが成功し、健康チェックが通る

## Tasks / Subtasks

- [ ] Implement per acceptance criteria

## Dev Notes

- Technical Notes: Preview/環境分離 / 保護ブランチ
- Prerequisites: Stories 1.1, 1.3, 1.4

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

- TBD

### File List

- TBD
