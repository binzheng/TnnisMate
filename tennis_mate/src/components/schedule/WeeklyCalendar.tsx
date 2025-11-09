"use client";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useMemo, useRef, useState } from "react";

export const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6:00 - 21:00
export const WEEK_DAYS = ["月", "火", "水", "木", "金", "土", "日"];

export type CalendarEvent = {
	id: string;
	dayIndex: number; // 0..6
	startHour: number; // 6..21
	endHour: number; // > start
	title: string;
	court: string;
	userId?: string;
	changed?: boolean;
	needsReview?: boolean;
};

export function WeeklyCalendar({
	events = [],
	onDragSelect,
	onDropEvent,
	onEventClick,
}: {
	events?: CalendarEvent[];
	onDragSelect?: (sel: {
		dayIndex: number;
		startHour: number;
		endHour: number;
	}) => void;
	onDropEvent?: (
		eventId: string,
		target: { dayIndex: number; startHour: number; endHour: number },
	) => void;
	onEventClick?: (eventId: string) => void;
}) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const days = isMobile ? WEEK_DAYS.slice(0, 3) : WEEK_DAYS;

	const [dragging, setDragging] = useState<{
		dayIndex: number;
		startHour: number;
	} | null>(null);
	const overRef = useRef<{ endHour: number } | null>(null);

	const handleDown = (dayIndex: number, hour: number) => () => {
		setDragging({ dayIndex, startHour: hour });
		overRef.current = { endHour: hour + 1 };
	};
	const handleEnter = (dayIndex: number, hour: number) => () => {
		if (dragging && dragging.dayIndex === dayIndex) {
			overRef.current = { endHour: Math.max(hour + 1, dragging.startHour + 1) };
		}
	};
	const handleUp = () => {
		if (dragging && overRef.current && onDragSelect) {
			onDragSelect({
				dayIndex: dragging.dayIndex,
				startHour: dragging.startHour,
				endHour: overRef.current.endHour,
			});
		}
		setDragging(null);
		overRef.current = null;
	};

	const cellBg = (dayIdx: number, hour: number) => {
		if (!dragging || dragging.dayIndex !== dayIdx || !overRef.current)
			return "background.default";
		return hour >= dragging.startHour && hour < overRef.current.endHour
			? "action.selected"
			: "background.default";
	};

	const byDay = useMemo(() => {
		const map = new Map<number, CalendarEvent[]>();
		events.forEach((e) => {
			if (!map.has(e.dayIndex)) map.set(e.dayIndex, []);
			map.get(e.dayIndex)?.push(e);
		});
		return map;
	}, [events]);

	return (
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
					gridTemplateColumns: `80px repeat(${days.length}, 1fr)`,
					bgcolor: "background.default",
					borderBottom: 1,
					borderColor: "divider",
				}}
			>
				<Box sx={{ p: 1, bgcolor: "action.hover" }} />
				{days.map((d) => (
					<Box key={d} sx={{ p: 1, textAlign: "center", fontWeight: 600 }}>
						{d}
					</Box>
				))}
			</Box>

			{/* Time Grid */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: `80px repeat(${days.length}, 1fr)`,
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
						{/* Day cells */}
						{days.map((d, di) => (
							<Box
								key={`${d}-${h}`}
								onDragOver={(e) => {
									if (onDropEvent) e.preventDefault();
								}}
								onDrop={(e) => {
									if (!onDropEvent) return;
									try {
										const id = e.dataTransfer.getData("text/event-id");
										if (id)
											onDropEvent(id, {
												dayIndex: di,
												startHour: h,
												endHour: h + 1,
											});
									} catch {}
								}}
								onMouseDown={handleDown(di, h)}
								onMouseEnter={handleEnter(di, h)}
								sx={{
									position: "relative",
									borderLeft: 1,
									borderBottom: 1,
									borderColor: "divider",
									height: 36,
									bgcolor: cellBg(di, h),
									cursor: "crosshair",
								}}
							>
								{/* render events starting at this hour */}
								{(byDay.get(di) || [])
									.filter((e) => e.startHour === h)
									.map((e) => (
										<Box
											aria-label={`${e.title}（${e.court}） ${e.startHour}:00 から ${e.endHour}:00`}
											draggable
											key={e.id}
											onClick={() => onEventClick?.(e.id)}
											onDragStart={(ev) => {
												ev.dataTransfer.setData("text/event-id", e.id);
												// indicate move
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
													30,
													(e.endHour - e.startHour) * 36 - 4,
												),
												bgcolor: "primary.main",
												color: "primary.contrastText",
												borderRadius: 0.5,
												px: 1,
												display: "flex",
												alignItems: "center",
												overflow: "hidden",
											}}
											tabIndex={0}
										>
											<Typography noWrap variant="caption">
												{e.title}（{e.court}）
											</Typography>
										</Box>
									))}
							</Box>
						))}
					</Box>
				))}
			</Box>
		</Box>
	);
}

export default WeeklyCalendar;
