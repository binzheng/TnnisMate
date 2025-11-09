"use client";
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Snackbar,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { api } from "@/trpc/react";

type Role = "player" | "coach" | "operator" | "admin";

export default function AdminUsersPage() {
	const utils = api.useUtils();
	const q = api.users.list.useQuery();
	const create = api.users.create.useMutation({
		onSuccess: () => {
			utils.users.list.invalidate();
			showSuccess("ユーザーを作成しました");
		},
		onError: (error) => showError(error.message),
	});
	const update = api.users.update.useMutation({
		onSuccess: () => {
			utils.users.list.invalidate();
			showSuccess("ユーザーを更新しました");
		},
		onError: (error) => showError(error.message),
	});
	const remove = api.users.remove.useMutation({
		onSuccess: () => {
			utils.users.list.invalidate();
			showSuccess("ユーザーを削除しました");
		},
		onError: (error) => showError(error.message),
	});
	const reset = api.users.resetPassword.useMutation({
		onSuccess: () => showSuccess("パスワードをリセットしました"),
		onError: (error) => showError(error.message),
	});

	const [openNew, setOpenNew] = useState(false);
	const [openEdit, setOpenEdit] = useState<{ open: boolean; id?: string }>({
		open: false,
	});
	const [openPw, setOpenPw] = useState<{ open: boolean; id?: string }>({
		open: false,
	});

	const [form, setForm] = useState<{
		email: string;
		name?: string;
		role: Role;
		password?: string;
	}>({ email: "", name: "", role: "player" });
	const [edit, setEdit] = useState<{
		id: string;
		email?: string;
		name?: string;
		role?: Role;
	}>({ id: "" });
	const [pw, setPw] = useState<string>("");

	const [snackbar, setSnackbar] = useState<{
		open: boolean;
		message: string;
		severity: "success" | "error";
	}>({ open: false, message: "", severity: "success" });

	const showSuccess = (message: string) => {
		setSnackbar({ open: true, message, severity: "success" });
	};

	const showError = (message: string) => {
		setSnackbar({ open: true, message, severity: "error" });
	};

	const rows = useMemo(() => q.data || [], [q.data]);

	if (q.isLoading) {
		return (
			<Container
				sx={{
					py: 3,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "50vh",
				}}
			>
				<CircularProgress />
			</Container>
		);
	}

	if (q.isError) {
		const isForbidden = q.error.data?.code === "FORBIDDEN";

		if (isForbidden) {
			return (
				<>
					<Container sx={{ py: 3 }}>
						<Alert severity="warning">
							このページにアクセスする権限がありません。
						</Alert>
					</Container>
					<Dialog fullWidth maxWidth="sm" open={true}>
						<DialogTitle>アクセス権限エラー</DialogTitle>
						<DialogContent>
							<Stack spacing={2} sx={{ mt: 1 }}>
								<Alert severity="error">
									このページにアクセスする権限がありません
								</Alert>
								<Typography color="text.secondary" variant="body2">
									ユーザーマスタにアクセスするには、以下のいずれかのロールが必要です：
								</Typography>
								<Box component="ul" sx={{ pl: 2, m: 0 }}>
									<Typography component="li" variant="body2">
										operator（運営者）
									</Typography>
									<Typography component="li" variant="body2">
										admin（管理者）
									</Typography>
								</Box>
								<Typography color="text.secondary" variant="body2">
									現在のユーザーはこれらの権限を持っていません。管理者に連絡して権限を付与してもらってください。
								</Typography>
							</Stack>
						</DialogContent>
						<DialogActions>
							<Button
								onClick={() => (window.location.href = "/")}
								variant="contained"
							>
								トップページに戻る
							</Button>
						</DialogActions>
					</Dialog>
				</>
			);
		}

		return (
			<Container sx={{ py: 3 }}>
				<Alert severity="error">エラーが発生しました: {q.error.message}</Alert>
			</Container>
		);
	}

	return (
		<Container sx={{ py: 3 }}>
			<Typography sx={{ mb: 2 }} variant="h5">
				ユーザーマスタ
			</Typography>
			<Stack direction="row" spacing={1} sx={{ mb: 2 }}>
				<Button
					onClick={() => {
						setForm({ email: "", name: "", role: "player" });
						setOpenNew(true);
					}}
					variant="contained"
				>
					新規作成
				</Button>
			</Stack>

			{rows.length === 0 ? (
				<Alert severity="info">
					ユーザーが登録されていません。新規作成ボタンから登録してください。
				</Alert>
			) : (
				<Box sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}>
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: "2fr 1fr 1fr 2fr",
							gap: 1,
							p: 1,
							bgcolor: "background.default",
							fontWeight: 600,
						}}
					>
						<div>Email</div>
						<div>氏名</div>
						<div>ロール</div>
						<div>操作</div>
					</Box>
					{rows.map((u) => (
						<Box
							key={u.id}
							sx={{
								display: "grid",
								gridTemplateColumns: "2fr 1fr 1fr 2fr",
								gap: 1,
								p: 1,
								borderTop: 1,
								borderColor: "divider",
							}}
						>
							<div>{u.email}</div>
							<div>{u.name}</div>
							<div>{u.role}</div>
							<Stack direction="row" spacing={1}>
								<Button
									onClick={() => {
										setEdit({
											id: u.id,
											email: u.email ?? "",
											name: u.name ?? "",
											role: u.role as Role,
										});
										setOpenEdit({ open: true, id: u.id });
									}}
									size="small"
								>
									編集
								</Button>
								<Button
									onClick={() => {
										setOpenPw({ open: true, id: u.id });
									}}
									size="small"
								>
									PWリセット
								</Button>
								<Button
									color="error"
									onClick={async () => {
										if (confirm("削除しますか？"))
											await remove.mutateAsync({ id: u.id });
									}}
									size="small"
								>
									削除
								</Button>
							</Stack>
						</Box>
					))}
				</Box>
			)}

			{/* New */}
			<Dialog
				onClose={() => !create.isPending && setOpenNew(false)}
				open={openNew}
			>
				<DialogTitle>ユーザー新規作成</DialogTitle>
				<DialogContent>
					<Stack spacing={2} sx={{ mt: 1, minWidth: 320 }}>
						<TextField
							disabled={create.isPending}
							fullWidth
							label="Email"
							onChange={(e) =>
								setForm((f) => ({ ...f, email: e.target.value }))
							}
							required
							type="email"
							value={form.email}
						/>
						<TextField
							disabled={create.isPending}
							fullWidth
							label="氏名"
							onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
							value={form.name ?? ""}
						/>
						<FormControl disabled={create.isPending} fullWidth>
							<InputLabel>ロール</InputLabel>
							<Select
								label="ロール"
								onChange={(e) =>
									setForm((f) => ({ ...f, role: e.target.value as Role }))
								}
								value={form.role}
							>
								{["player", "coach", "operator", "admin"].map((r) => (
									<MenuItem key={r} value={r}>
										{r}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<TextField
							disabled={create.isPending}
							fullWidth
							helperText="6文字以上"
							label="初期パスワード(任意)"
							onChange={(e) =>
								setForm((f) => ({ ...f, password: e.target.value }))
							}
							type="password"
							value={form.password ?? ""}
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button disabled={create.isPending} onClick={() => setOpenNew(false)}>
						キャンセル
					</Button>
					<Button
						disabled={create.isPending || !form.email}
						onClick={async () => {
							await create.mutateAsync(form);
							setOpenNew(false);
							setForm({ email: "", name: "", role: "player" });
						}}
						variant="contained"
					>
						{create.isPending ? <CircularProgress size={24} /> : "作成"}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Edit */}
			<Dialog
				onClose={() => !update.isPending && setOpenEdit({ open: false })}
				open={openEdit.open}
			>
				<DialogTitle>ユーザー編集</DialogTitle>
				<DialogContent>
					<Stack spacing={2} sx={{ mt: 1, minWidth: 320 }}>
						<TextField
							disabled={update.isPending}
							fullWidth
							label="Email"
							onChange={(e) =>
								setEdit((f) => ({ ...f, email: e.target.value }))
							}
							type="email"
							value={edit.email ?? ""}
						/>
						<TextField
							disabled={update.isPending}
							fullWidth
							label="氏名"
							onChange={(e) => setEdit((f) => ({ ...f, name: e.target.value }))}
							value={edit.name ?? ""}
						/>
						<FormControl disabled={update.isPending} fullWidth>
							<InputLabel>ロール</InputLabel>
							<Select
								label="ロール"
								onChange={(e) =>
									setEdit((f) => ({ ...f, role: e.target.value as Role }))
								}
								value={edit.role ?? "player"}
							>
								{["player", "coach", "operator", "admin"].map((r) => (
									<MenuItem key={r} value={r}>
										{r}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button
						disabled={update.isPending}
						onClick={() => setOpenEdit({ open: false })}
					>
						キャンセル
					</Button>
					<Button
						disabled={update.isPending || !edit.id}
						onClick={async () => {
							await update.mutateAsync(edit as any);
							setOpenEdit({ open: false });
						}}
						variant="contained"
					>
						{update.isPending ? <CircularProgress size={24} /> : "保存"}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Reset Password */}
			<Dialog
				onClose={() => !reset.isPending && setOpenPw({ open: false })}
				open={openPw.open}
			>
				<DialogTitle>パスワードリセット</DialogTitle>
				<DialogContent>
					<Stack spacing={2} sx={{ mt: 1, minWidth: 320 }}>
						<TextField
							disabled={reset.isPending}
							fullWidth
							helperText="6文字以上"
							label="新しいパスワード"
							onChange={(e) => setPw(e.target.value)}
							required
							type="password"
							value={pw}
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button
						disabled={reset.isPending}
						onClick={() => {
							setPw("");
							setOpenPw({ open: false });
						}}
					>
						キャンセル
					</Button>
					<Button
						disabled={reset.isPending || !pw || pw.length < 6}
						onClick={async () => {
							await reset.mutateAsync({ id: openPw.id!, password: pw });
							setPw("");
							setOpenPw({ open: false });
						}}
						variant="contained"
					>
						{reset.isPending ? <CircularProgress size={24} /> : "リセット"}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Snackbar for feedback */}
			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				autoHideDuration={4000}
				onClose={() => setSnackbar({ ...snackbar, open: false })}
				open={snackbar.open}
			>
				<Alert
					onClose={() => setSnackbar({ ...snackbar, open: false })}
					severity={snackbar.severity}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Container>
	);
}
