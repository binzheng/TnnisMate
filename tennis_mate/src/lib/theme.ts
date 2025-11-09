"use client";
import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
	palette: {
		primary: { main: "#2E7D32" },
		secondary: { main: "#1565C0" },
		success: { main: "#2E7D32" },
		warning: { main: "#ED6C02" },
		error: { main: "#D32F2F" },
		info: { main: "#0288D1" },
		background: { default: "#FAFAFA", paper: "#FFFFFF" },
		text: { primary: "#1A1A1A", secondary: "#5F6368" },
	},
	typography: {
		fontFamily: ["Roboto", "Noto Sans JP", "system-ui", "sans-serif"].join(","),
		h1: { fontSize: "2rem", lineHeight: 1.25 }, // 32/40
		h2: { fontSize: "1.5rem", lineHeight: 1.333 }, // 24/32
		h3: { fontSize: "1.25rem", lineHeight: 1.4 }, // 20/28
		body1: { fontSize: "1rem", lineHeight: 1.5 }, // 16/24
		body2: { fontSize: "0.875rem", lineHeight: 1.428 }, // 14/20
	},
	components: {
		MuiButtonBase: {
			styleOverrides: {
				root: {
					// focus-visible outline (簡易)
					outlineOffset: 2,
				},
			},
		},
	},
});
