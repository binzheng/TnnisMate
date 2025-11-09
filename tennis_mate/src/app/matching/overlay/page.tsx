"use client";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";

type Slot = { day: number; start: number; end: number };

export default function OverlayPage() {
	const [a, _setA] = useState<Slot[]>([
		{ day: 1, start: 9, end: 11 },
		{ day: 2, start: 14, end: 16 },
	]);
	const [b, _setB] = useState<Slot[]>([
		{ day: 1, start: 10, end: 12 },
		{ day: 3, start: 9, end: 11 },
	]);

	const overlaps = useMemo(() => {
		const out: Slot[] = [];
		for (const s of a) {
			for (const t of b) {
				if (s.day !== t.day) continue;
				const start = Math.max(s.start, t.start);
				const end = Math.min(s.end, t.end);
				if (start < end) out.push({ day: s.day, start, end });
			}
		}
		return out;
	}, [a, b]);

	return (
		<Container sx={{ py: 3 }}>
			<Typography sx={{ mb: 2 }} variant="h5">
				カレンダー重ね表示（簡易）
			</Typography>
			<Typography variant="subtitle1">重なり候補</Typography>
			{overlaps.length === 0 && (
				<Typography color="text.secondary">重なる時間帯はありません</Typography>
			)}
			<Stack spacing={1} sx={{ mb: 2 }}>
				{overlaps.map((o, i) => (
					<Stack
						alignItems="center"
						direction="row"
						key={`${o.day}-${i}`}
						spacing={1}
					>
						<Box>
							Day {o.day} {o.start}:00〜{o.end}:00
						</Box>
						<Button
							onClick={() =>
								alert("/schedule で対象時間へジャンプ（将来実装）")
							}
							size="small"
							variant="outlined"
						>
							候補へジャンプ
						</Button>
					</Stack>
				))}
			</Stack>

			<Typography variant="subtitle1">Aの空き</Typography>
			<pre>{JSON.stringify(a, null, 2)}</pre>
			<Typography variant="subtitle1">Bの空き</Typography>
			<pre>{JSON.stringify(b, null, 2)}</pre>
		</Container>
	);
}
