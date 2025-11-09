"use client";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	List,
	ListItem,
	ListItemText,
	Stack,
	Typography,
} from "@mui/material";
import type { CalendarEvent } from "@/components/schedule/WeeklyCalendar";
import { formatDateTime } from "@/lib/dates";
import { api } from "@/trpc/react";

export type TargetSlot = {
	dayIndex: number;
	startHour: number;
	endHour: number;
};

function overlapsHalfOpen(
	aStart: number,
	aEnd: number,
	bStart: number,
	bEnd: number,
) {
	return aStart < bEnd && aEnd > bStart;
}

export function ReschedulePreviewDialog({
	open,
	event,
	target,
	allEvents,
	onClose,
	onConfirm,
	serverTarget,
}: {
	open: boolean;
	event: CalendarEvent | null;
	target: TargetSlot | null;
	allEvents: CalendarEvent[];
	onClose: () => void;
	onConfirm: () => void;
	serverTarget?: { start: Date; end: Date };
}) {
	if (!event || !target) return null;

	const conflicts = allEvents.filter(
		(e) =>
			e.id !== event.id &&
			e.dayIndex === target.dayIndex &&
			e.court === event.court &&
			overlapsHalfOpen(
				target.startHour,
				target.endHour,
				e.startHour,
				e.endHour,
			),
	);

	const penalty = conflicts.length > 0 ? "競合回避の再計画が必要" : "なし";
	const notifications = ["予約者", "コーチ"]; // 将来: 実データ連携

	// Server-side conflict detection (best-effort). Falls back to client calc if unavailable.
	const detectQuery = api.reservations.detectConflicts.useQuery(
		serverTarget
			? {
					start: serverTarget.start,
					end: serverTarget.end,
					// courtId / userId は現状未連携（UIは名称のみ）
				}
			: // disabled if no serverTarget
				(undefined as any),
		{
			enabled: open && !!serverTarget,
			staleTime: 5_000,
		},
	);

	return (
		<Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
			<DialogTitle>リスケジュールの影響プレビュー</DialogTitle>
			<DialogContent>
				<Stack spacing={1} sx={{ mt: 1 }}>
					<Typography variant="subtitle2">対象予約</Typography>
					<Typography variant="body2">
						{event.title}（{event.court}）: {event.startHour}:00 →{" "}
						{target.startHour}
						:00（~{target.endHour}:00）
					</Typography>

					<Typography sx={{ mt: 2 }} variant="subtitle2">
						影響サマリ
					</Typography>
					<List dense>
						<ListItem>
							<ListItemText
								primary={`競合: ${
									detectQuery.data?.length ?? conflicts.length
								} 件`}
								secondary={
									detectQuery.isLoading
										? "サーバ確認中…"
										: detectQuery.error
											? "サーバ確認に失敗（ローカル推定を表示）"
											: undefined
								}
							/>
						</ListItem>
						<ListItem>
							<ListItemText primary={`ペナルティ: ${penalty}`} />
						</ListItem>
						<ListItem>
							<ListItemText
								primary={`関係者通知: ${notifications.join(" / ")}`}
							/>
						</ListItem>
					</List>

					{(detectQuery.data?.length ?? conflicts.length) > 0 && (
						<>
							<Typography sx={{ mt: 1 }} variant="subtitle2">
								競合の詳細
							</Typography>
							<List dense>
								{detectQuery.data
									? detectQuery.data.map((c) => (
											<ListItem key={`${c.id}-${c.start}`}>
												<ListItemText
													primary={`予約 ${c.id}`}
													secondary={`${formatDateTime(new Date(c.start))} ~ ${formatDateTime(new Date(c.end))}（理由: ${c.reason}）`}
												/>
											</ListItem>
										))
									: conflicts.map((c) => (
											<ListItem key={c.id}>
												<ListItemText
													primary={`${c.title}（${c.court}）`}
													secondary={`${c.startHour}:00 ~ ${c.endHour}:00`}
												/>
											</ListItem>
										))}
							</List>
						</>
					)}
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>キャンセル</Button>
				<Button
					color={conflicts.length ? "warning" : "primary"}
					onClick={onConfirm}
					variant="contained"
				>
					確定
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ReschedulePreviewDialog;
