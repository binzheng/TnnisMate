"use client";
import {
	Alert,
	Button,
	Card,
	CardContent,
	Stack,
	Typography,
} from "@mui/material";

export function ThemeSamples() {
	return (
		<Stack gap={2}>
			<Stack direction="row" gap={1}>
				<Button color="primary" variant="contained">
					Primary
				</Button>
				<Button color="secondary" variant="contained">
					Secondary
				</Button>
				<Button color="primary" variant="outlined">
					Outlined
				</Button>
			</Stack>
			<Stack gap={1}>
				<Alert severity="success">空き（Available）</Alert>
				<Alert severity="warning">混雑（Busy）</Alert>
				<Alert severity="error">衝突（Conflict）</Alert>
				<Alert severity="info">お知らせ/特価（Info）</Alert>
			</Stack>
			<Card>
				<CardContent>
					<Typography variant="h1">H1 見出し</Typography>
					<Typography variant="h2">H2 見出し</Typography>
					<Typography variant="h3">H3 見出し</Typography>
					<Typography variant="body1">本文 body1 16/24</Typography>
					<Typography variant="body2">本文 body2 14/20</Typography>
				</CardContent>
			</Card>
		</Stack>
	);
}
