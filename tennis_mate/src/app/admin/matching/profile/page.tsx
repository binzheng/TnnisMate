"use client";
import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { api } from "@/trpc/react";
import { useState } from "react";

export default function MatchingProfilePage() {
  const utils = api.useUtils();
  const search = api.matching.searchPlayers.useQuery({});
  const upsert = api.matching.upsertProfile.useMutation({ onSuccess: () => utils.matching.searchPlayers.invalidate() });
  const [level, setLevel] = useState(3);
  const [area, setArea] = useState("");

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>マッチングプロフィール</Typography>
      <Stack spacing={1} direction="row" sx={{ mb: 2 }}>
        <TextField size="small" label="レベル" type="number" value={level} onChange={(e) => setLevel(Number(e.target.value))} />
        <TextField size="small" label="エリア" value={area} onChange={(e) => setArea(e.target.value)} />
        <Button variant="contained" onClick={async () => upsert.mutateAsync({ level, area })}>保存</Button>
      </Stack>
      <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
        {(search.data || []).map((p) => (
          <Box key={p.userId}>{p.userId} — Lv.{p.level} — {p.area ?? ""}</Box>
        ))}
      </Box>
    </Container>
  );
}

