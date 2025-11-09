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
    <Stack direction="row" spacing={2} alignItems="center" sx={{ my: 1 }}>
      <Typography variant="subtitle2">凡例:</Typography>
      {items.map((it) => (
        <Stack key={it.label} direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 14, height: 14, borderRadius: 0.5, bgcolor: it.color }} />
          <Typography variant="body2" color="text.secondary">
            {it.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default Legend;

