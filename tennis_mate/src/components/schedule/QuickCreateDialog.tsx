"use client";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem, Stack } from "@mui/material";
import { useEffect, useState } from "react";

export type QuickCreateInput = {
  dayIndex: number;
  startHour: number;
  endHour: number;
};

export type CourtOption = { id: string; name: string; facilityName?: string };

export type ReservationDraft = QuickCreateInput & {
  title: string;
  courtId: string;
};

export function QuickCreateDialog({
  open,
  initial,
  courts,
  onClose,
  onSubmit,
}: {
  open: boolean;
  initial: QuickCreateInput | null;
  courts: CourtOption[];
  onClose: () => void;
  onSubmit: (draft: ReservationDraft) => void;
}) {
  const [title, setTitle] = useState("");
  const [courtId, setCourtId] = useState("");
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(10);
  const [dayIndex, setDayIndex] = useState(0);

  useEffect(() => {
    if (initial) {
      setDayIndex(initial.dayIndex);
      setStartHour(initial.startHour);
      setEndHour(Math.max(initial.endHour, initial.startHour + 1));
    }
    if (courts && courts.length > 0) {
      setCourtId((prev) => prev || courts[0]!.id);
    }
  }, [initial, courts]);

  const handleSubmit = () => {
    if (!courtId) return;
    onSubmit({ title: title || "予約", courtId, dayIndex, startHour, endHour });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>クイック予約作成</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="コート予約"
            fullWidth
          />
          <TextField select label="コート" value={courtId} onChange={(e) => setCourtId(e.target.value)} disabled={!courts.length}>
            {courts.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.facilityName ? `${c.facilityName} / ${c.name}` : c.name}
              </MenuItem>
            ))}
          </TextField>
          <Stack direction="row" spacing={2}>
            <TextField
              label="開始"
              type="number"
              inputProps={{ min: 6, max: 21 }}
              value={startHour}
              onChange={(e) => setStartHour(Number(e.target.value))}
            />
            <TextField
              label="終了"
              type="number"
              inputProps={{ min: 7, max: 22 }}
              value={endHour}
              onChange={(e) => setEndHour(Number(e.target.value))}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!courtId}>
          作成
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default QuickCreateDialog;
