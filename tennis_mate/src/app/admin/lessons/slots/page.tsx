"use client";
import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { formatDateTime } from "@/lib/dates";
import { api } from "@/trpc/react";
import { useState } from "react";

export default function LessonSlotsAdminPage() {
  const utils = api.useUtils();
  const slots = api.lessons.listSlots.useQuery();
  const createSlot = api.lessons.createSlot.useMutation({ onSuccess: () => utils.lessons.listSlots.invalidate() });
  const deleteSlot = api.lessons.deleteSlot.useMutation({ onSuccess: () => utils.lessons.listSlots.invalidate() });
  const [form, setForm] = useState({ courtId: "", start: "", end: "", capacity: 4 });

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>レッスン枠 管理</Typography>

      <Stack spacing={1} direction="row" sx={{ mb: 2 }}>
        <TextField size="small" label="CourtId" value={form.courtId} onChange={(e) => setForm({ ...form, courtId: e.target.value })} />
        <TextField size="small" label="開始(ISO)" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
        <TextField size="small" label="終了(ISO)" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
        <TextField size="small" label="定員" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
        <Button
          variant="contained"
          disabled={!form.courtId || !form.start || !form.end}
          onClick={async () => {
            await createSlot.mutateAsync({ courtId: form.courtId, start: new Date(form.start), end: new Date(form.end), capacity: form.capacity });
          }}
        >
          追加
        </Button>
      </Stack>

      <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
        {(slots.data || []).map((s) => (
          <Stack key={s.id} direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Box sx={{ flex: 1 }}>{s.court?.name ?? ''} | {formatDateTime(new Date(s.start))} - {formatDateTime(new Date(s.end))} | 定員 {s.capacity}</Box>
            <Button size="small" color="error" onClick={async () => { if (confirm("削除しますか？")) await deleteSlot.mutateAsync({ id: s.id }); }}>削除</Button>
          </Stack>
        ))}
      </Box>
    </Container>
  );
}
