"use client";
import { useState } from "react";
import { api } from "@/trpc/react";
import { Alert, Box, Button, Container, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { formatDateTime } from "@/lib/dates";

export default function ScoreHistoryPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const query = api.scores.myHistory.useQuery({ from: from ? new Date(from) : undefined, to: to ? new Date(to) : undefined });
  const [toast, setToast] = useState<{ open: boolean; msg: string; severity: "success" | "error" | "info" }>({ open: false, msg: "", severity: "success" });

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>スコア履歴</Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
        <TextField size="small" type="date" label="From" value={from} onChange={(e) => setFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField size="small" type="date" label="To" value={to} onChange={(e) => setTo(e.target.value)} InputLabelProps={{ shrink: true }} />
        <Button variant="outlined" onClick={() => query.refetch()}>適用</Button>
        <Button variant="text" onClick={() => { setFrom(""); setTo(""); }}>リセット</Button>
      </Stack>

      {query.isLoading && <Typography color="text.secondary">読み込み中…</Typography>}
      {!query.isLoading && (query.data || []).length === 0 && <Typography color="text.secondary">履歴がありません</Typography>}

      <Stack spacing={1}>
        {(query.data || []).map((r) => (
          <Box key={r.id} sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 1 }}>
            <Typography variant="body2">{formatDateTime(new Date(r.date))} — vs {r.opponentId}</Typography>
            <Typography variant="subtitle2">結果: {r.result}</Typography>
          </Box>
        ))}
      </Stack>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        <Alert severity={toast.severity} sx={{ width: "100%" }}>{toast.msg}</Alert>
      </Snackbar>
    </Container>
  );
}
