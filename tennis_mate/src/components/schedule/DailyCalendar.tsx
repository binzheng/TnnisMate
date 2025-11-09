"use client";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import type { CalendarEvent } from "./WeeklyCalendar";

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6:00 - 21:00

export function DailyCalendar({
	events = [],
	courts = [],
	currentDate,
	onDateChange,
	onDragSelect,
	onDropEvent,
	onEventClick,
}: {
	events?: CalendarEvent[];
	courts?: Array<{ id: string; name: string }>;
	currentDate?: Date;
	onDateChange?: (date: Date) => void;
	onDragSelect?: (sel: {
		courtId: string;
		startHour: number;
		endHour: number;
	}) => void;
	onDropEvent?: (
		eventId: string,
		target: { courtId: string; startHour: number; endHour: number },
	) => void;
	onEventClick?: (eventId: string) => void;
}) {
	const date = currentDate || new Date();
	const [dragging, setDragging] = useState<{
		courtIndex: number;
		startHour: number;
	} | null>(null);
	const overRef = useRef<{ endHour: number } | null>(null);

	const handlePrevDay = () => {
		const newDate = new Date(date);
		newDate.setDate(newDate.getDate() - 1);
		onDateChange?.(newDate);
	};

	const handleNextDay = () => {
		const newDate = new Date(date);
		newDate.setDate(newDate.getDate() + 1);
		onDateChange?.(newDate);
	};

	const handleDown = (courtIndex: number, hour: number) => () => {
		setDragging({ courtIndex, startHour: hour });
		overRef.current = { endHour: hour + 1 };
	};

	const handleEnter = (courtIndex: number, hour: number) => () => {
		if (dragging && dragging.courtIndex === courtIndex) {
			overRef.current = { endHour: Math.max(hour + 1, dragging.startHour + 1) };
		}
	};

	const handleUp = () => {
		if (dragging && overRef.current && onDragSelect) {
			const court = courts[dragging.courtIndex];
			if (court) {
				onDragSelect({
					courtId: court.id,
					startHour: dragging.startHour,
					endHour: overRef.current.endHour,
				});
			}
		}
		setDragging(null);
		overRef.current = null;
	};

	const cellBg = (courtIdx: number, hour: number) => {
		if (!dragging || dragging.courtIndex !== courtIdx || !overRef.current)
			return "background.default";
		return hour >= dragging.startHour && hour < overRef.current.endHour
			? "action.selected"
			: "background.default";
	};

	const byCourt = useMemo(() => {
		const map = new Map<string, CalendarEvent[]>();
		events.forEach((e) => {
			if (!map.has(e.court)) map.set(e.court, []);
			map.get(e.court)?.push(e);
		});
		return map;
	}, [events]);

	const formatDate = (d: Date) => {
		return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
	};

	const displayCourts =
		courts.length > 0 ? courts : [{ id: "default", name: "コート" }];

	return (
		<Box>
			{/* Date Navigation */}
			<Stack
				alignItems="center"
				direction="row"
				justifyContent="space-between"
				sx={{ mb: 2 }}
			>
				<IconButton aria-label="前の日" onClick={handlePrevDay}>
					<ChevronLeft />
				</IconButton>
				<Typography variant="h6">{formatDate(date)}</Typography>
				<IconButton aria-label="次の日" onClick={handleNextDay}>
					<ChevronRight />
				</IconButton>
			</Stack>

			<Box
				onMouseUp={handleUp}
				sx={{
					border: 1,
					borderColor: "divider",
					borderRadius: 1,
					overflow: "hidden",
				}}
			>
				{/* Header Row */}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: `80px repeat(${displayCourts.length}, 1fr)`,
						bgcolor: "background.default",
						borderBottom: 1,
						borderColor: "divider",
					}}
				>
					<Box sx={{ p: 1, bgcolor: "action.hover" }} />
					{displayCourts.map((court) => (
						<Box
							key={court.id}
							sx={{ p: 1, textAlign: "center", fontWeight: 600 }}
						>
							{court.name}
						</Box>
					))}
				</Box>

				{/* Time Grid */}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: `80px repeat(${displayCourts.length}, 1fr)`,
					}}
				>
					{HOURS.map((h) => (
						<Box key={`row-${h}`} sx={{ display: "contents" }}>
							{/* Time label */}
							<Box
								sx={{
									p: 1,
									borderRight: 1,
									borderColor: "divider",
									bgcolor: "background.paper",
								}}
							>
								{`${String(h).padStart(2, "0")}:00`}
							</Box>
							{/* Court cells */}
							{displayCourts.map((court, ci) => (
								<Box
									key={`${court.id}-${h}`}
									onDragOver={(e) => {
										if (onDropEvent) e.preventDefault();
									}}
									onDrop={(e) => {
										if (!onDropEvent) return;
										try {
											const id = e.dataTransfer.getData("text/event-id");
											if (id)
												onDropEvent(id, {
													courtId: court.id,
													startHour: h,
													endHour: h + 1,
												});
										} catch {}
									}}
									onMouseDown={handleDown(ci, h)}
									onMouseEnter={handleEnter(ci, h)}
									sx={{
										position: "relative",
										borderLeft: 1,
										borderBottom: 1,
										borderColor: "divider",
										height: 48,
										bgcolor: cellBg(ci, h),
										cursor: "crosshair",
									}}
								>
									{/* render events starting at this hour */}
									{(byCourt.get(court.name) || [])
										.filter((e) => e.startHour === h)
										.map((e) => (
											<Box
												aria-label={`${e.title} ${e.startHour}:00 から ${e.endHour}:00`}
												draggable
												key={e.id}
												onClick={() => onEventClick?.(e.id)}
												onDragStart={(ev) => {
													ev.dataTransfer.setData("text/event-id", e.id);
													ev.dataTransfer.dropEffect = "move";
												}}
												onKeyDown={(ev) => {
													if (ev.key === "Enter" || ev.key === " ") {
														onEventClick?.(e.id);
														ev.preventDefault();
													}
												}}
												sx={{
													position: "absolute",
													top: 2,
													left: 2,
													right: 2,
													height: Math.max(
														42,
														(e.endHour - e.startHour) * 48 - 4,
													),
													bgcolor: e.changed
														? "warning.main"
														: e.needsReview
															? "error.main"
															: "primary.main",
													color: "primary.contrastText",
													borderRadius: 0.5,
													px: 1,
													display: "flex",
													alignItems: "center",
													overflow: "hidden",
													cursor: "pointer",
												}}
												tabIndex={0}
											>
												<Typography noWrap variant="caption">
													{e.title}
												</Typography>
											</Box>
										))}
								</Box>
							))}
						</Box>
					))}
				</Box>
			</Box>
		</Box>
	);
}

export default DailyCalendar;
