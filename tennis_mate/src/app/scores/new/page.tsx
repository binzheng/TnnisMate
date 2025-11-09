"use client";
import {
	Alert,
	Button,
	Container,
	Snackbar,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { api } from "@/trpc/react";

export default function ScoreNewPage() {
	const [opponentId, setOpponentId] = useState("");
	const [date, setDate] = useState("");
	const [result, setResult] = useState("");
	const [toast, setToast] = useState<{
		open: boolean;
		msg: string;
		severity: "success" | "error" | "info";
	}>({ open: false, msg: "", severity: "success" });
	const add = api.scores.addScore.useMutation();

	return (
		<Container sx={{ py: 3 }}>
			<Typography sx={{ mb: 2 }} variant="h5">
				スコア登録
			</Typography>
			<Stack spacing={2} sx={{ maxWidth: 520 }}>
				<TextField
					label="対戦相手ユーザーID"
					onChange={(e) => setOpponentId(e.target.value)}
					required
					size="small"
					value={opponentId}
				/>
				<TextField
					InputLabelProps={{ shrink: true }}
					label="日付"
					onChange={(e) => setDate(e.target.value)}
					required
					size="small"
					type="date"
					value={date}
				/>
				<TextField
					label="結果（例: 6-4 6-3 or W/L）"
					onChange={(e) => setResult(e.target.value)}
					required
					size="small"
					value={result}
				/>
				<Button
					disabled={!opponentId || !date || !result}
					onClick={async () => {
						try {
							await add.mutateAsync({
								opponentId,
								date: new Date(date),
								result,
							});
							setToast({
								open: true,
								msg: "登録しました",
								severity: "success",
							});
							setOpponentId("");
							setDate("");
							setResult("");
						} catch (e: any) {
							setToast({
								open: true,
								msg: e?.message ?? "登録に失敗しました",
								severity: "error",
							});
						}
					}}
					variant="contained"
				>
					登録
				</Button>
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
