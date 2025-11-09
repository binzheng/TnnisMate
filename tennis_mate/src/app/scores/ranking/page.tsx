"use client";
import { api } from "@/trpc/react";
import { Container, Stack, Typography, Box } from "@mui/material";

export default function RankingPage() {
  const q = api.scores.rankingSummary.useQuery();
  const rows = q.data || [];
  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>ランキング</Typography>
      {q.isLoading && <Typography color="text.secondary">読み込み中…</Typography>}
      {!q.isLoading && rows.length === 0 && <Typography color="text.secondary">データがありません</Typography>}
      <Stack spacing={1}>
        {rows.map((r, i) => (
          <Box key={r.playerId} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1 }}>
            <Typography variant="subtitle1">#{i + 1} — {r.playerId}</Typography>
            <Typography variant="body2">試合数: {('count' in r ? (r as any).count : 0)}</Typography>
          </Box>
        ))}
      </Stack>
    </Container>
  );
}
