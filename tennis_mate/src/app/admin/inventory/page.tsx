"use client";
import {
	Alert,
	Box,
	Button,
	Container,
	Divider,
	MenuItem,
	Select,
	Snackbar,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { api } from "@/trpc/react";

export default function InventoryAdminPage() {
	const utils = api.useUtils();
	const jobs = api.inventory.listJobs.useQuery();
	const startCsv = api.inventory.startCsvImport.useMutation({
		onSuccess: () => {
			utils.inventory.listJobs.invalidate();
			setToast({ open: true, msg: "取込に成功しました", severity: "success" });
		},
	});
	const [csv, setCsv] = useState("");
	const [headers, setHeaders] = useState<string[]>([]);
	const [rows, setRows] = useState<string[][]>([]);
	const [mapping, setMapping] = useState<Record<string, string>>({});
	const [dryrun, setDryrun] = useState<{
		added: number;
		updated: number;
		removed: number;
	} | null>(null);
	const [confirm, setConfirm] = useState<{ open: boolean }>({ open: false });
	const [toast, setToast] = useState<{
		open: boolean;
		msg: string;
		severity: "success" | "error" | "info";
	}>({ open: false, msg: "", severity: "success" });

	const domainFields = [
		{ key: "facilityName", label: "施設名" },
		{ key: "courtName", label: "コート名" },
		{ key: "courtId", label: "コートID" },
		{ key: "status", label: "状態" },
	];

	return (
		<Container sx={{ py: 3 }}>
			<Typography sx={{ mb: 2 }} variant="h5">
				在庫同期（CSVインポート）
			</Typography>
			<Stack spacing={2} sx={{ mb: 2 }}>
				<TextField
					label="CSV（ヘッダ付き）"
					minRows={6}
					multiline
					onChange={(e) => setCsv(e.target.value)}
					value={csv}
				/>
				<Stack direction="row" spacing={1}>
					<Button
						disabled={!csv.trim()}
						onClick={() => {
							try {
								const lines = csv
									.trim()
									.split(/\n/)
									.map((l) => l.split(","));
								const [hdr, ...data] = lines;
								setHeaders(hdr ?? []);
								setRows(data ?? []);
								// 初期マッピングを空に
								const init: Record<string, string> = {};
								(hdr ?? []).forEach((h) => (init[h] = ""));
								setMapping(init);
								setDryrun(null);
							} catch {
								setToast({
									open: true,
									msg: "CSVの解析に失敗しました",
									severity: "error",
								});
							}
						}}
						variant="outlined"
					>
						プレビュー
					</Button>
					<Button
						disabled={headers.length === 0}
						onClick={() => {
							// 簡易ドライラン：現在は追加=全行、更新/削除=0 としてダミー表示
							setDryrun({ added: rows.length, updated: 0, removed: 0 });
							setToast({
								open: true,
								msg: "ドライランを実行しました",
								severity: "info",
							});
						}}
						variant="outlined"
					>
						ドライラン
					</Button>
					<Button
						disabled={headers.length === 0}
						onClick={() => setConfirm({ open: true })}
						variant="contained"
					>
						適用
					</Button>
				</Stack>
			</Stack>

			{headers.length > 0 && (
				<Box
					sx={{
						border: 1,
						borderColor: "divider",
						borderRadius: 1,
						p: 2,
						mb: 2,
					}}
				>
					<Typography sx={{ mb: 1 }} variant="subtitle1">
						フィールドマッピング
					</Typography>
					<Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: "wrap" }}>
						{headers.map((h) => (
							<Stack key={h} spacing={0.5} sx={{ minWidth: 220 }}>
								<Typography variant="caption">CSV: {h}</Typography>
								<Select
									displayEmpty
									onChange={(e) =>
										setMapping((m) => ({ ...m, [h]: String(e.target.value) }))
									}
									size="small"
									value={mapping[h] ?? ""}
								>
									<MenuItem value="">
										<em>未割当</em>
									</MenuItem>
									{domainFields.map((f) => (
										<MenuItem key={f.key} value={f.key}>
											{f.label}
										</MenuItem>
									))}
								</Select>
							</Stack>
						))}
					</Stack>

					<Typography variant="subtitle1">プレビュー（先頭 10 行）</Typography>
					<Table size="small">
						<TableHead>
							<TableRow>
								{headers.map((h) => (
									<TableCell key={h}>{h}</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.slice(0, 10).map((r, idx) => (
								<TableRow key={idx}>
									{r.map((v, i) => (
										<TableCell key={i}>{v}</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>

					{dryrun && (
						<Box sx={{ mt: 2 }}>
							<Divider sx={{ mb: 1 }} />
							<Typography variant="subtitle2">ドライラン結果</Typography>
							<Typography variant="body2">
								追加: {dryrun.added} / 更新: {dryrun.updated} / 削除:{" "}
								{dryrun.removed}
							</Typography>
						</Box>
					)}
				</Box>
			)}

			<Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
				<Typography variant="subtitle1">ジョブ履歴</Typography>
				{(jobs.data || []).map((j) => (
					<Box key={j.id} sx={{ py: 0.5 }}>
						{String(j.createdAt)} — {j.type}/{j.status} added:{j.added} updated:
						{j.updated} removed:{j.removed}
					</Box>
				))}
			</Box>

			<ConfirmDialog
				content={
					dryrun
						? `追加:${dryrun.added} 更新:${dryrun.updated} 削除:${dryrun.removed}`
						: undefined
				}
				onClose={() => setConfirm({ open: false })}
				onConfirm={async () => {
					setConfirm({ open: false });
					try {
						// マッピングは現状ダミー。プレビューのヘッダと行から JSON 配列を生成して送信
						const mapped = rows.map((r) =>
							Object.fromEntries(r.map((v, i) => [headers[i] ?? `col${i}`, v])),
						);
						await startCsv.mutateAsync({ rows: mapped });
						setCsv("");
						setHeaders([]);
						setRows([]);
						setDryrun(null);
					} catch (e: any) {
						setToast({
							open: true,
							msg: e?.message ?? "適用に失敗しました",
							severity: "error",
						});
					}
				}}
				open={confirm.open}
				title="適用を実行しますか？"
			/>

			<Snackbar
				autoHideDuration={4000}
				onClose={() => setToast((t) => ({ ...t, open: false }))}
				open={toast.open}
			>
				<Alert severity={toast.severity} sx={{ width: "100%" }}>
					{toast.msg}
				</Alert>
			</Snackbar>
		</Container>
	);
}
