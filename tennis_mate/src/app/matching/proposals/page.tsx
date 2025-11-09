"use client";
import { api } from "@/trpc/react";
import { Box, Button, Container, Stack, TextField, Typography, Card, CardContent, CardActions, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { parseLocalDateTime, formatDateTime } from "@/lib/dates";

export default function ProposalsPage() {
  const incoming = api.matching.listIncomingProposals.useQuery();
  const outgoing = api.matching.listOutgoingProposals.useQuery();
  const act = api.matching.actOnProposal.useMutation({ onSuccess: () => { incoming.refetch(); } });

  const [toUser, setToUser] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [msg, setMsg] = useState("");
  const send = api.matching.sendProposal.useMutation({ onSuccess: () => { outgoing.refetch(); } });
  const [toast, setToast] = useState<{ open: boolean; msg: string; severity: 'success'|'error'|'info' }>({ open: false, msg: '', severity: 'success' });

  return (
    <>
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>提案一覧 / 作成</Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
        <TextField size="small" label="宛先ユーザーID" value={toUser} onChange={(e) => setToUser(e.target.value)} />
        <TextField size="small" label="開始" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} error={!!start && !parseLocalDateTime(start)} helperText={!!start && !parseLocalDateTime(start) ? '形式が正しくありません' : ' '} />
        <TextField size="small" label="終了" type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} error={!!end && !parseLocalDateTime(end)} helperText={!!end && !parseLocalDateTime(end) ? '形式が正しくありません' : ' '} />
        <TextField size="small" label="メッセージ" value={msg} onChange={(e) => setMsg(e.target.value)} />
        <Button variant="contained" disabled={!toUser || !start || !end || !parseLocalDateTime(start) || !parseLocalDateTime(end) || !(new Date(start) < new Date(end))} onClick={async () => {
          try { await send.mutateAsync({ toUser, start: new Date(start), end: new Date(end), message: msg || undefined }); setToast({ open: true, msg: '送信しました', severity: 'success' }); setToUser(''); setStart(''); setEnd(''); setMsg(''); } catch (e: any) { setToast({ open: true, msg: e?.message ?? '送信失敗', severity: 'error' }); }
        }}>送信</Button>
      </Stack>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>受信（pending）</Typography>
      <Stack spacing={1}>
        {(incoming.data || []).map((p) => (
          <Card key={p.id} variant="outlined">
            <CardContent>
              <Box>From: {p.fromUser}</Box>
              <Box>{formatDateTime(new Date(p.start))} - {formatDateTime(new Date(p.end))}</Box>
              <Box>Status: {p.status}</Box>
            </CardContent>
            <CardActions>
              <Button size="small" variant="contained" onClick={() => act.mutate({ id: p.id, action: 'accept' })}>承認</Button>
              <Button size="small" color="error" onClick={() => act.mutate({ id: p.id, action: 'decline' })}>却下</Button>
            </CardActions>
          </Card>
        ))}
      </Stack>

      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>送信（最新）</Typography>
      <Stack spacing={1}>
        {(outgoing.data || []).map((p) => (
          <Card key={p.id} variant="outlined">
            <CardContent>
              <Box>To: {p.toUser}</Box>
              <Box>{formatDateTime(new Date(p.start))} - {formatDateTime(new Date(p.end))}</Box>
              <Box>Status: {p.status}</Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
    <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((t) => ({ ...t, open: false }))}>
      <Alert severity={toast.severity} sx={{ width: '100%' }}>{toast.msg}</Alert>
    </Snackbar>
    </>
  );
}
