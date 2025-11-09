"use client";
import { Box, Stack, Typography } from "@mui/material";

type LegendItem = {
	color: string;
	label: string;
};

const items: LegendItem[] = [
	{ color: "#2e7d32", label: "空き" },
	{ color: "#ed6c02", label: "混雑" },
	{ color: "#d32f2f", label: "衝突" },
	{ color: "#1976d2", label: "特価" },
];

export function Legend() {
	return (
		<Stack alignItems="center" direction="row" spacing={2} sx={{ my: 1 }}>
			<Typography variant="subtitle2">凡例:</Typography>
			{items.map((it) => (
				<Stack alignItems="center" direction="row" key={it.label} spacing={1}>
					<Box
						sx={{ width: 14, height: 14, borderRadius: 0.5, bgcolor: it.color }}
					/>
					<Typography color="text.secondary" variant="body2">
						{it.label}
					</Typography>
				</Stack>
			))}
		</Stack>
	);
}

export default Legend;
