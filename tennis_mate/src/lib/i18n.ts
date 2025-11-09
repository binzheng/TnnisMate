type Dict = Record<string, string>;

const ja: Dict = {
	search: "検索",
	reset: "条件リセット",
	playerSearch: "プレイヤー検索",
	proposalSend: "マッチ提案を送信",
	start: "開始",
	end: "終了",
	message: "メッセージ",
	cancel: "キャンセル",
	send: "送信",
	report: "報告",
	block: "ブロック",
	pendingIncoming: "受信（pending）",
	outgoing: "送信（最新）",
};

export function t(key: string): string {
	return ja[key] ?? key;
}
