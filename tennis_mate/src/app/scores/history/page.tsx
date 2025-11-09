"use client";
import {
	Alert,
	Box,
	Button,
	Container,
	Snackbar,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { formatDateTime } from "@/lib/dates";
import { api } from "@/trpc/react";

export default function ScoreHistoryPage() {
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const query = api.scores.myHistory.useQuery({
		from: from ? new Date(from) : undefined,
		to: to ? new Date(to) : undefined,
	});
	const [toast, setToast] = useState<{
		open: boolean;
		msg: string;
		severity: "success" | "error" | "info";
	}>({ open: false, msg: "", severity: "success" });

	return (
		<Container sx={{ py: 3 }}>
			<Typography sx={{ mb: 2 }} variant="h5">
				スコア履歴
			</Typography>
			<Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
				<TextField
					InputLabelProps={{ shrink: true }}
					label="From"
					onChange={(e) => setFrom(e.target.value)}
					size="small"
					type="date"
					value={from}
				/>
				<TextField
					InputLabelProps={{ shrink: true }}
					label="To"
					onChange={(e) => setTo(e.target.value)}
					size="small"
					type="date"
					value={to}
				/>
				<Button onClick={() => query.refetch()} variant="outlined">
					適用
				</Button>
				<Button
					onClick={() => {
						setFrom("");
						setTo("");
					}}
					variant="text"
				>
					リセット
				</Button>
			</Stack>

			{query.isLoading && (
				<Typography color="text.secondary">読み込み中…</Typography>
			)}
			{!query.isLoading && (query.data || []).length === 0 && (
				<Typography color="text.secondary">履歴がありません</Typography>
			)}

			<Stack spacing={1}>
				{(query.data || []).map((r) => (
					<Box
						key={r.id}
						sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 1 }}
					>
						<Typography variant="body2">
							{formatDateTime(new Date(r.date))} — vs {r.opponentId}
						</Typography>
						<Typography variant="subtitle2">結果: {r.result}</Typography>
					</Box>
				))}
			</Stack>

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
