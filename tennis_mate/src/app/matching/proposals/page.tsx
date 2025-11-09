"use client";
import {
	Alert,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Container,
	Snackbar,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { formatDateTime, parseLocalDateTime } from "@/lib/dates";
import { api } from "@/trpc/react";

export default function ProposalsPage() {
	const incoming = api.matching.listIncomingProposals.useQuery();
	const outgoing = api.matching.listOutgoingProposals.useQuery();
	const act = api.matching.actOnProposal.useMutation({
		onSuccess: () => {
			incoming.refetch();
		},
	});

	const [toUser, setToUser] = useState("");
	const [start, setStart] = useState("");
	const [end, setEnd] = useState("");
	const [msg, setMsg] = useState("");
	const send = api.matching.sendProposal.useMutation({
		onSuccess: () => {
			outgoing.refetch();
		},
	});
	const [toast, setToast] = useState<{
		open: boolean;
		msg: string;
		severity: "success" | "error" | "info";
	}>({ open: false, msg: "", severity: "success" });

	return (
		<>
			<Container sx={{ py: 3 }}>
				<Typography sx={{ mb: 2 }} variant="h5">
					提案一覧 / 作成
				</Typography>

				<Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
					<TextField
						label="宛先ユーザーID"
						onChange={(e) => setToUser(e.target.value)}
						size="small"
						value={toUser}
					/>
					<TextField
						error={!!start && !parseLocalDateTime(start)}
						helperText={
							!!start && !parseLocalDateTime(start)
								? "形式が正しくありません"
								: " "
						}
						label="開始"
						onChange={(e) => setStart(e.target.value)}
						size="small"
						type="datetime-local"
						value={start}
					/>
					<TextField
						error={!!end && !parseLocalDateTime(end)}
						helperText={
							!!end && !parseLocalDateTime(end) ? "形式が正しくありません" : " "
						}
						label="終了"
						onChange={(e) => setEnd(e.target.value)}
						size="small"
						type="datetime-local"
						value={end}
					/>
					<TextField
						label="メッセージ"
						onChange={(e) => setMsg(e.target.value)}
						size="small"
						value={msg}
					/>
					<Button
						disabled={
							!toUser ||
							!start ||
							!end ||
							!parseLocalDateTime(start) ||
							!parseLocalDateTime(end) ||
							!(new Date(start) < new Date(end))
						}
						onClick={async () => {
							try {
								await send.mutateAsync({
									toUser,
									start: new Date(start),
									end: new Date(end),
									message: msg || undefined,
								});
								setToast({
									open: true,
									msg: "送信しました",
									severity: "success",
								});
								setToUser("");
								setStart("");
								setEnd("");
								setMsg("");
							} catch (e: any) {
								setToast({
									open: true,
									msg: e?.message ?? "送信失敗",
									severity: "error",
								});
							}
						}}
						variant="contained"
					>
						送信
					</Button>
				</Stack>

				<Typography sx={{ mt: 2, mb: 1 }} variant="subtitle1">
					受信（pending）
				</Typography>
				<Stack spacing={1}>
					{(incoming.data || []).map((p) => (
						<Card key={p.id} variant="outlined">
							<CardContent>
								<Box>From: {p.fromUser}</Box>
								<Box>
									{formatDateTime(new Date(p.start))} -{" "}
									{formatDateTime(new Date(p.end))}
								</Box>
								<Box>Status: {p.status}</Box>
							</CardContent>
							<CardActions>
								<Button
									onClick={() => act.mutate({ id: p.id, action: "accept" })}
									size="small"
									variant="contained"
								>
									承認
								</Button>
								<Button
									color="error"
									onClick={() => act.mutate({ id: p.id, action: "decline" })}
									size="small"
								>
									却下
								</Button>
							</CardActions>
						</Card>
					))}
				</Stack>

				<Typography sx={{ mt: 3, mb: 1 }} variant="subtitle1">
					送信（最新）
				</Typography>
				<Stack spacing={1}>
					{(outgoing.data || []).map((p) => (
						<Card key={p.id} variant="outlined">
							<CardContent>
								<Box>To: {p.toUser}</Box>
								<Box>
									{formatDateTime(new Date(p.start))} -{" "}
									{formatDateTime(new Date(p.end))}
								</Box>
								<Box>Status: {p.status}</Box>
							</CardContent>
						</Card>
					))}
				</Stack>
			</Container>
			<Snackbar
				autoHideDuration={4000}
				onClose={() => setToast((t) => ({ ...t, open: false }))}
				open={toast.open}
			>
				<Alert severity={toast.severity} sx={{ width: "100%" }}>
					{toast.msg}
				</Alert>
			</Snackbar>
		</>
	);
}
