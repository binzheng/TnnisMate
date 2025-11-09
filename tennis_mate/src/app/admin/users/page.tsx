"use client";
import { useMemo, useState } from "react";
import { api } from "@/trpc/react";
import { Box, Button, Container, Stack, TextField, Typography, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar, CircularProgress, FormControl, InputLabel } from "@mui/material";

type Role = "player" | "coach" | "operator" | "admin";

export default function AdminUsersPage() {
  const utils = api.useUtils();
  const q = api.users.list.useQuery();
  const create = api.users.create.useMutation({
    onSuccess: () => {
      utils.users.list.invalidate();
      showSuccess("ユーザーを作成しました");
    },
    onError: (error) => showError(error.message)
  });
  const update = api.users.update.useMutation({
    onSuccess: () => {
      utils.users.list.invalidate();
      showSuccess("ユーザーを更新しました");
    },
    onError: (error) => showError(error.message)
  });
  const remove = api.users.remove.useMutation({
    onSuccess: () => {
      utils.users.list.invalidate();
      showSuccess("ユーザーを削除しました");
    },
    onError: (error) => showError(error.message)
  });
  const reset = api.users.resetPassword.useMutation({
    onSuccess: () => showSuccess("パスワードをリセットしました"),
    onError: (error) => showError(error.message)
  });

  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState<{ open: boolean; id?: string }>({ open: false });
  const [openPw, setOpenPw] = useState<{ open: boolean; id?: string }>({ open: false });

  const [form, setForm] = useState<{ email: string; name?: string; role: Role; password?: string }>({ email: "", name: "", role: "player" });
  const [edit, setEdit] = useState<{ id: string; email?: string; name?: string; role?: Role }>({ id: "" });
  const [pw, setPw] = useState<string>("");

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });

  const showSuccess = (message: string) => {
    setSnackbar({ open: true, message, severity: "success" });
  };

  const showError = (message: string) => {
    setSnackbar({ open: true, message, severity: "error" });
  };

  const rows = useMemo(() => q.data || [], [q.data]);

  if (q.isLoading) {
    return (
      <Container sx={{ py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (q.isError) {
    const isForbidden = q.error.data?.code === 'FORBIDDEN';

    if (isForbidden) {
      return (
        <>
          <Container sx={{ py: 3 }}>
            <Alert severity="warning">
              このページにアクセスする権限がありません。
            </Alert>
          </Container>
          <Dialog open={true} maxWidth="sm" fullWidth>
            <DialogTitle>アクセス権限エラー</DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Alert severity="error">
                  このページにアクセスする権限がありません
                </Alert>
                <Typography variant="body2" color="text.secondary">
                  ユーザーマスタにアクセスするには、以下のいずれかのロールが必要です：
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <Typography component="li" variant="body2">operator（運営者）</Typography>
                  <Typography component="li" variant="body2">admin（管理者）</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  現在のユーザーはこれらの権限を持っていません。管理者に連絡して権限を付与してもらってください。
                </Typography>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={() => window.location.href = '/'}>
                トップページに戻る
              </Button>
            </DialogActions>
          </Dialog>
        </>
      );
    }

    return (
      <Container sx={{ py: 3 }}>
        <Alert severity="error">
          エラーが発生しました: {q.error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>ユーザーマスタ</Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => { setForm({ email: "", name: "", role: "player" }); setOpenNew(true); }}>新規作成</Button>
      </Stack>

      {rows.length === 0 ? (
        <Alert severity="info">ユーザーが登録されていません。新規作成ボタンから登録してください。</Alert>
      ) : (
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: 1, p: 1, bgcolor: 'background.default', fontWeight: 600 }}>
            <div>Email</div><div>氏名</div><div>ロール</div><div>操作</div>
          </Box>
          {rows.map((u) => (
            <Box key={u.id} sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: 1, p: 1, borderTop: 1, borderColor: 'divider' }}>
              <div>{u.email}</div>
              <div>{u.name}</div>
              <div>{u.role}</div>
              <Stack direction="row" spacing={1}>
                <Button size="small" onClick={() => { setEdit({ id: u.id, email: u.email ?? '', name: u.name ?? '', role: u.role as Role }); setOpenEdit({ open: true, id: u.id }); }}>編集</Button>
                <Button size="small" onClick={() => { setOpenPw({ open: true, id: u.id }); }}>PWリセット</Button>
                <Button size="small" color="error" onClick={async () => { if (confirm('削除しますか？')) await remove.mutateAsync({ id: u.id }); }}>削除</Button>
              </Stack>
            </Box>
          ))}
        </Box>
      )}

      {/* New */}
      <Dialog open={openNew} onClose={() => !create.isPending && setOpenNew(false)}>
        <DialogTitle>ユーザー新規作成</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 320 }}>
            <TextField
              label="Email"
              type="email"
              required
              fullWidth
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              disabled={create.isPending}
            />
            <TextField
              label="氏名"
              fullWidth
              value={form.name ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              disabled={create.isPending}
            />
            <FormControl fullWidth disabled={create.isPending}>
              <InputLabel>ロール</InputLabel>
              <Select
                value={form.role}
                label="ロール"
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
              >
                {['player','coach','operator','admin'].map((r) => (<MenuItem key={r} value={r}>{r}</MenuItem>))}
              </Select>
            </FormControl>
            <TextField
              label="初期パスワード(任意)"
              type="password"
              fullWidth
              value={form.password ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              helperText="6文字以上"
              disabled={create.isPending}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNew(false)} disabled={create.isPending}>キャンセル</Button>
          <Button
            variant="contained"
            onClick={async () => {
              await create.mutateAsync(form);
              setOpenNew(false);
              setForm({ email: "", name: "", role: "player" });
            }}
            disabled={create.isPending || !form.email}
          >
            {create.isPending ? <CircularProgress size={24} /> : "作成"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit */}
      <Dialog open={openEdit.open} onClose={() => !update.isPending && setOpenEdit({ open: false })}>
        <DialogTitle>ユーザー編集</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 320 }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={edit.email ?? ''}
              onChange={(e) => setEdit((f) => ({ ...f, email: e.target.value }))}
              disabled={update.isPending}
            />
            <TextField
              label="氏名"
              fullWidth
              value={edit.name ?? ''}
              onChange={(e) => setEdit((f) => ({ ...f, name: e.target.value }))}
              disabled={update.isPending}
            />
            <FormControl fullWidth disabled={update.isPending}>
              <InputLabel>ロール</InputLabel>
              <Select
                value={edit.role ?? 'player'}
                label="ロール"
                onChange={(e) => setEdit((f) => ({ ...f, role: e.target.value as Role }))}
              >
                {['player','coach','operator','admin'].map((r) => (<MenuItem key={r} value={r}>{r}</MenuItem>))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit({ open: false })} disabled={update.isPending}>キャンセル</Button>
          <Button
            variant="contained"
            onClick={async () => {
              await update.mutateAsync(edit as any);
              setOpenEdit({ open: false });
            }}
            disabled={update.isPending || !edit.id}
          >
            {update.isPending ? <CircularProgress size={24} /> : "保存"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password */}
      <Dialog open={openPw.open} onClose={() => !reset.isPending && setOpenPw({ open: false })}>
        <DialogTitle>パスワードリセット</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 320 }}>
            <TextField
              label="新しいパスワード"
              type="password"
              fullWidth
              required
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              helperText="6文字以上"
              disabled={reset.isPending}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setPw(''); setOpenPw({ open: false }); }} disabled={reset.isPending}>キャンセル</Button>
          <Button
            variant="contained"
            disabled={reset.isPending || !pw || pw.length < 6}
            onClick={async () => {
              await reset.mutateAsync({ id: openPw.id!, password: pw });
              setPw('');
              setOpenPw({ open: false });
            }}
          >
            {reset.isPending ? <CircularProgress size={24} /> : "リセット"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

