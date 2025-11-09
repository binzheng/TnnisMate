"use client";
import { api } from "@/trpc/react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { formatDateTime } from "@/lib/dates";
import { useParams } from "next/navigation";

export default function ProposalThreadPage() {
  const params = useParams<{ id: string }>();
  const q = api.matching.getProposal.useQuery({ id: String(params.id) });
  const p = q.data;
  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>提案スレッド</Typography>
      {!p && <Typography color="text.secondary">読み込み中…</Typography>}
      {p && (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">提案ID: {p.id}</Typography>
            <Typography variant="body2">From: {p.fromUser} → To: {p.toUser}</Typography>
            <Typography variant="body2">{formatDateTime(new Date(p.start))} - {formatDateTime(new Date(p.end))}</Typography>
            <Typography variant="body2">Status: {p.status}</Typography>
          </Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>メッセージ（ダミー）</Typography>
          <Stack spacing={1}>
            <Box>・{p.fromUser}: こんにちは、対戦どうですか？</Box>
            <Box>・{p.toUser}: ぜひお願いします！</Box>
          </Stack>
        </>
      )}
    </Container>
  );
}
