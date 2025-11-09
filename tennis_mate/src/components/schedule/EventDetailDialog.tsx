"use client";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography } from "@mui/material";
import type { CalendarEvent } from "@/components/schedule/WeeklyCalendar";

export function EventDetailDialog({
  open,
  event,
  onClose,
  onCancel,
}: {
  open: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
  onCancel: (id: string) => void;
}) {
  if (!event) return null;
  const policySummary = "キャンセルポリシー（例）: 開始24時間前までは無料、それ以降はペナルティ対象（将来拡張）。";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>予約詳細</DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ mt: 1 }}>
          <Typography variant="subtitle2">タイトル</Typography>
          <Typography variant="body2">{event.title}</Typography>
          <Typography variant="subtitle2">コート/時間</Typography>
          <Typography variant="body2">
            {event.court} / {event.startHour}:00 ~ {event.endHour}:00
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 1 }}>キャンセルポリシー</Typography>
          <Typography variant="body2" color="text.secondary">{policySummary}</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
        <Button color="error" variant="contained" onClick={() => onCancel(event.id)}>
          キャンセル
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EventDetailDialog;

