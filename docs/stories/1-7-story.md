# Story 1.7: to scaffold UploadThing S3 (private) for uploads

Status: drafted

## Story

As a developer,
I want to scaffold UploadThing + S3 (private) for uploads,
so that 画像/添付のアップロード基盤が整う。.

## Acceptance Criteria

1. Given `UPLOADTHING_*` と `S3_*` を設定 When 許可された拡張子/サイズのファイルをアップロード Then S3 に保存され、署名付きURLで取得できる

## Tasks / Subtasks

- [ ] Implement per acceptance criteria

## Dev Notes

- Technical Notes: 認可はサーバで検証 / CORS 設定
- Prerequisites: Stories 1.5, 1.4

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
