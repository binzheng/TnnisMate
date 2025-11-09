"use client";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	Typography,
} from "@mui/material";
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
	const policySummary =
		"キャンセルポリシー（例）: 開始24時間前までは無料、それ以降はペナルティ対象（将来拡張）。";

	return (
		<Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
			<DialogTitle>予約詳細</DialogTitle>
			<DialogContent>
				<Stack spacing={1} sx={{ mt: 1 }}>
					<Typography variant="subtitle2">タイトル</Typography>
					<Typography variant="body2">{event.title}</Typography>
					<Typography variant="subtitle2">コート/時間</Typography>
					<Typography variant="body2">
						{event.court} / {event.startHour}:00 ~ {event.endHour}:00
					</Typography>
					<Typography sx={{ mt: 1 }} variant="subtitle2">
						キャンセルポリシー
					</Typography>
					<Typography color="text.secondary" variant="body2">
						{policySummary}
					</Typography>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>閉じる</Button>
				<Button
					color="error"
					onClick={() => onCancel(event.id)}
					variant="contained"
				>
					キャンセル
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default EventDetailDialog;
