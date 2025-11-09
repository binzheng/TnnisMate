"use client";
import { api } from "@/trpc/react";
import { Alert, Box, Card, CardContent, Container, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function AdminDashboardPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const kpis = api.admin.kpis.useQuery({ from: from ? new Date(from) : undefined, to: to ? new Date(to) : undefined });
  const [toast, setToast] = useState<{ open: boolean; msg: string; severity: 'success'|'error'|'info' }>({ open: false, msg: '', severity: 'success' });

  const data = kpis.data ?? { reservationsCount: 0, lessonReservationsTotal: 0, cancellationsCount: 0, utilizationPercent: 0, estimateYen: 0 };

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>運営ダッシュボード</Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
        <TextField size="small" label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField size="small" label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} InputLabelProps={{ shrink: true }} />
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 2 }}>
        <Box>
          <Card variant="outlined"><CardContent>
            <Typography variant="subtitle2">稼働率（レッスン）</Typography>
            <Typography variant="h5">{data.utilizationPercent}%</Typography>
          </CardContent></Card>
        </Box>
        <Box>
          <Card variant="outlined"><CardContent>
            <Typography variant="subtitle2">収益推計</Typography>
            <Typography variant="h5">¥{(data.estimateYen ?? 0).toLocaleString('ja-JP')}</Typography>
          </CardContent></Card>
        </Box>
        <Box>
          <Card variant="outlined"><CardContent>
            <Typography variant="subtitle2">予約数（期間内）</Typography>
            <Typography variant="h5">{data.reservationsCount}</Typography>
          </CardContent></Card>
        </Box>
        <Box>
          <Card variant="outlined"><CardContent>
            <Typography variant="subtitle2">キャンセル（レッスン）</Typography>
            <Typography variant="h5">{data.cancellationsCount}</Typography>
          </CardContent></Card>
        </Box>
      </Box>

      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>KPI 概要</Typography>
        {kpis.isLoading && <Typography color="text.secondary">集計中…</Typography>}
        {!kpis.isLoading && (
          <Stack spacing={0.5}>
            <Typography variant="body2">・稼働率（レッスン）= 予約件数 / 期間内の枠容量合計</Typography>
            <Typography variant="body2">・収益推計 = レッスン予約件数 × 平均価格（未設定時は¥2,000）</Typography>
            <Typography variant="body2">・予約数（期間内）= 期間の Reservation 件数</Typography>
            <Typography variant="body2">・キャンセル = LessonReservation の status=cancelled 件数</Typography>
          </Stack>
        )}
      </Box>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        <Alert severity={toast.severity} sx={{ width: '100%' }}>{toast.msg}</Alert>
      </Snackbar>
    </Container>
  );
}
