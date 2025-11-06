# 機能一覧（外部設計）

版: v0.1 / ステータス: Draft

目的: TennisMate の提供機能をユーザー視点で一覧化し、ロール・優先度・導入フェーズ（M0〜M4）を明確化する。

凡例
- P: 優先度（High/Med/Low）
- M: 導入フェーズ（M0〜M4）
- R: 対応ロール（ADMIN/COACH/STUDENT）

## 認証/アカウント
- F-AUT-001 サインイン/アウト（Email/Passwordless） [P:High/M:M1/R:ALL]
- F-AUT-002 セッション維持/失効 [P:High/M:M1/R:ALL]
- F-AUT-003 プロフィール閲覧/編集（氏名/アイコン） [P:Med/M:M1/R:ALL]

## ユーザープロファイル/台帳
- F-USR-001 生徒プロファイル（レベル/生年月日/保護者） [P:High/M:M1/R:ADMIN]
- F-USR-002 コーチプロファイル（資格/自己紹介） [P:Med/M:M2/R:ADMIN]
- F-USR-003 台帳検索/フィルタ/一覧 [P:Med/M:M2/R:ADMIN]

## スケジュール/枠（LessonSlot）
- F-SCH-001 カレンダー表示（月/週/日、フィルタ: コーチ/レーン/レベル） [P:High/M:M1/R:ALL]
- F-SCH-002 枠作成/編集/削除（ADMIN/COACH） [P:High/M:M1/R:ADMIN,COACH]
- F-SCH-003 レーン/コート管理（設定） [P:Med/M:M2/R:ADMIN]

## 予約
- F-RES-001 予約作成（定員/重複チェック、ウェイトリスト） [P:High/M:M1/R:STUDENT]
- F-RES-002 予約キャンセル/振替 [P:High/M:M1/M2/R:STUDENT]
- F-RES-003 予約一覧/検索（自分） [P:High/M:M1/R:STUDENT]
- F-RES-004 予約管理（枠別参加者一覧/制御） [P:Med/M:M1/M2/R:COACH]

## 出欠/コーチ業務
- F-ATT-001 出欠記録（present/absent/late） [P:High/M:M2/R:COACH]
- F-ATT-002 一括記録/修正 [P:Med/M:M2/R:COACH]
- F-COA-001 シフト入力/担当割当 [P:Med/M:M2/R:COACH]

## 試合/成績
- F-MAT-001 試合イベント作成/エントリー [P:High/M:M3/R:ADMIN,COACH]
- F-MAT-002 対戦表（簡易）生成 [P:Med/M:M3/R:ADMIN,COACH]
- F-MAT-003 結果入力/成績集計・ランキング [P:High/M:M3/R:ADMIN,COACH,STUDENT閲覧]

## ダッシュボード/KPI
- F-KPI-001 KPI 概要カード（予約率/出席率/レーン稼働率） [P:High/M:M2/R:ADMIN,COACH]
- F-KPI-002 時系列・フィルタ（期間/レベル/コーチ/レーン） [P:Med/M:M2/R:ADMIN,COACH]
- F-KPI-003 売上・試合成績（段階導入） [P:Med/M:M3/M4/R:ADMIN]

## 請求/プラン（軽量）
- F-BIL-001 プラン/チケット最小モデル [P:Med/M:M4/R:ADMIN]
- F-BIL-002 残数/有効期限検証と表示 [P:Med/M:M4/R:ADMIN,STUDENT]

## 通知
- F-NTF-001 メール通知（予約/変更/キャンセル/出欠リマインド） [P:Med/M:M4/R:ALL]

## 共通/UX/レスポンシブ
- F-CMN-001 レスポンシブ対応（375/768/1024/1440） [P:High/M:M1〜/R:ALL]
- F-CMN-002 アクセシビリティ基本対応 [P:High/M:M1〜/R:ALL]
- F-CMN-003 エラーハンドリング/トースト/ローディング/空状態 [P:High/M:M1〜/R:ALL]
