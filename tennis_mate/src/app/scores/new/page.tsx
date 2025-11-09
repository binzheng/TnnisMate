"use client";
import { useState } from "react";
import { api } from "@/trpc/react";
import { Alert, Button, Container, Snackbar, Stack, TextField, Typography } from "@mui/material";

export default function ScoreNewPage() {
  const [opponentId, setOpponentId] = useState("");
  const [date, setDate] = useState("");
  const [result, setResult] = useState("");
  const [toast, setToast] = useState<{ open: boolean; msg: string; severity: "success" | "error" | "info" }>({ open: false, msg: "", severity: "success" });
  const add = api.scores.addScore.useMutation();

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>スコア登録</Typography>
      <Stack spacing={2} sx={{ maxWidth: 520 }}>
        <TextField size="small" label="対戦相手ユーザーID" value={opponentId} onChange={(e) => setOpponentId(e.target.value)} required />
        <TextField size="small" type="date" label="日付" value={date} onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} required />
        <TextField size="small" label="結果（例: 6-4 6-3 or W/L）" value={result} onChange={(e) => setResult(e.target.value)} required />
        <Button
          variant="contained"
          disabled={!opponentId || !date || !result}
          onClick={async () => {
            try {
              await add.mutateAsync({ opponentId, date: new Date(date), result });
              setToast({ open: true, msg: "登録しました", severity: "success" });
              setOpponentId(""); setDate(""); setResult("");
            } catch (e: any) {
              setToast({ open: true, msg: e?.message ?? "登録に失敗しました", severity: "error" });
            }
          }}
        >登録</Button>
      </Stack>
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        <Alert severity={toast.severity} sx={{ width: "100%" }}>{toast.msg}</Alert>
      </Snackbar>
    </Container>
  );
}

