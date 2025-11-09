"use client";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Badge, Box, IconButton, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import type { CalendarEvent } from "./WeeklyCalendar";

const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

export function MonthlyCalendar({
	events = [],
	currentDate,
	onDateChange,
	onDateClick,
	onEventClick,
}: {
	events?: CalendarEvent[];
	currentDate?: Date;
	onDateChange?: (date: Date) => void;
	onDateClick?: (date: Date) => void;
	onEventClick?: (eventId: string) => void;
}) {
	const date = currentDate || new Date();

	const handlePrevMonth = () => {
		const newDate = new Date(date);
		newDate.setMonth(newDate.getMonth() - 1);
		onDateChange?.(newDate);
	};

	const handleNextMonth = () => {
		const newDate = new Date(date);
		newDate.setMonth(newDate.getMonth() + 1);
		onDateChange?.(newDate);
	};

	const formatMonth = (d: Date) => {
		return `${d.getFullYear()}年${d.getMonth() + 1}月`;
	};

	// Generate calendar grid
	const calendarDays = useMemo(() => {
		const year = date.getFullYear();
		const month = date.getMonth();

		// First day of the month
		const firstDay = new Date(year, month, 1);
		const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday

		// Last day of the month
		const lastDay = new Date(year, month + 1, 0);
		const totalDays = lastDay.getDate();

		// Days to show from previous month
		const prevMonthDays = firstDayOfWeek;
		const prevMonthLastDay = new Date(year, month, 0).getDate();

		// Total cells needed (always show 6 weeks for consistency)
		const totalCells = 42;

		const days: Array<{
			date: Date;
			day: number;
			isCurrentMonth: boolean;
			isToday: boolean;
		}> = [];

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// Previous month days
		for (let i = prevMonthDays - 1; i >= 0; i--) {
			const d = new Date(year, month - 1, prevMonthLastDay - i);
			days.push({
				date: d,
				day: prevMonthLastDay - i,
				isCurrentMonth: false,
				isToday: d.getTime() === today.getTime(),
			});
		}

		// Current month days
		for (let i = 1; i <= totalDays; i++) {
			const d = new Date(year, month, i);
			days.push({
				date: d,
				day: i,
				isCurrentMonth: true,
				isToday: d.getTime() === today.getTime(),
			});
		}

		// Next month days
		const remainingCells = totalCells - days.length;
		for (let i = 1; i <= remainingCells; i++) {
			const d = new Date(year, month + 1, i);
			days.push({
				date: d,
				day: i,
				isCurrentMonth: false,
				isToday: d.getTime() === today.getTime(),
			});
		}

		return days;
	}, [date]);

	// Map events to dates
	const eventsByDate = useMemo(() => {
		const map = new Map<string, CalendarEvent[]>();

		// For monthly view, we need to map events based on the week base date
		// Since events use dayIndex (0-6), we need to calculate the actual dates
		const weekBase = (() => {
			const now = new Date();
			const day = now.getDay();
			const monday = new Date(now);
			const diffToMon = (day + 6) % 7;
			monday.setDate(now.getDate() - diffToMon);
			monday.setHours(0, 0, 0, 0);
			return monday;
		})();

		events.forEach((e) => {
			const eventDate = new Date(weekBase);
			eventDate.setDate(weekBase.getDate() + e.dayIndex);
			const key = `${eventDate.getFullYear()}-${eventDate.getMonth()}-${eventDate.getDate()}`;

			if (!map.has(key)) map.set(key, []);
			map.get(key)?.push(e);
		});

		return map;
	}, [events]);

	const getDateKey = (d: Date) => {
		return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
	};

	const getDayEvents = (d: Date) => {
		return eventsByDate.get(getDateKey(d)) || [];
	};

	return (
		<Box>
			{/* Month Navigation */}
			<Stack
				alignItems="center"
				direction="row"
				justifyContent="space-between"
				sx={{ mb: 2 }}
			>
				<IconButton aria-label="前の月" onClick={handlePrevMonth}>
					<ChevronLeft />
				</IconButton>
				<Typography variant="h6">{formatMonth(date)}</Typography>
				<IconButton aria-label="次の月" onClick={handleNextMonth}>
					<ChevronRight />
				</IconButton>
			</Stack>

			<Box
				sx={{
					border: 1,
					borderColor: "divider",
					borderRadius: 1,
					overflow: "hidden",
				}}
			>
				{/* Weekday Headers */}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "repeat(7, 1fr)",
						bgcolor: "background.default",
						borderBottom: 1,
						borderColor: "divider",
					}}
				>
					{WEEKDAY_LABELS.map((label, i) => (
						<Box
							key={label}
							sx={{
								p: 1,
								textAlign: "center",
								fontWeight: 600,
								color:
									i === 0
										? "error.main"
										: i === 6
											? "info.main"
											: "text.primary",
							}}
						>
							{label}
						</Box>
					))}
				</Box>

				{/* Calendar Grid */}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "repeat(7, 1fr)",
					}}
				>
					{calendarDays.map((day, idx) => {
						const dayEvents = getDayEvents(day.date);
						const hasEvents = dayEvents.length > 0;
						const visibleEvents = dayEvents.slice(0, 2);
						const moreCount = Math.max(0, dayEvents.length - 2);

						return (
							<Box
								key={idx}
								onClick={() => onDateClick?.(day.date)}
								sx={{
									position: "relative",
									minHeight: 80,
									p: 0.5,
									border: 1,
									borderColor: "divider",
									bgcolor: day.isCurrentMonth
										? "background.paper"
										: "action.hover",
									cursor: "pointer",
									"&:hover": {
										bgcolor: day.isCurrentMonth
											? "action.hover"
											: "action.selected",
									},
								}}
							>
								<Badge
									badgeContent={hasEvents ? dayEvents.length : 0}
									color="primary"
									sx={{
										"& .MuiBadge-badge": {
											right: 4,
											top: 4,
										},
									}}
								>
									<Typography
										sx={{
											fontWeight: day.isToday
												? 700
												: day.isCurrentMonth
													? 500
													: 400,
											color: day.isToday
												? "primary.main"
												: day.isCurrentMonth
													? "text.primary"
													: "text.secondary",
											mb: 0.5,
										}}
										variant="body2"
									>
										{day.day}
									</Typography>
								</Badge>

								{/* Event indicators */}
								<Stack spacing={0.5} sx={{ mt: 0.5 }}>
									{visibleEvents.map((e) => (
										<Box
											key={e.id}
											onClick={(ev) => {
												ev.stopPropagation();
												onEventClick?.(e.id);
											}}
											sx={{
												px: 0.5,
												py: 0.25,
												bgcolor: e.changed
													? "warning.main"
													: e.needsReview
														? "error.main"
														: "primary.main",
												color: "primary.contrastText",
												borderRadius: 0.5,
												fontSize: "0.65rem",
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
												cursor: "pointer",
												"&:hover": {
													opacity: 0.8,
												},
											}}
										>
											{e.startHour}:00 {e.title}
										</Box>
									))}
									{moreCount > 0 && (
										<Typography
											sx={{
												color: "text.secondary",
												fontSize: "0.65rem",
												pl: 0.5,
											}}
											variant="caption"
										>
											+{moreCount}件
										</Typography>
									)}
								</Stack>
							</Box>
						);
					})}
				</Box>
			</Box>
		</Box>
	);
}

export default MonthlyCalendar;
