"use client";
import {
	Button,
	Card,
	CardActions,
	CardContent,
	Chip,
	Stack,
	Typography,
} from "@mui/material";
import { compatibilityScore, scoreBadgeColor } from "@/lib/matchingScore";

export type Player = { userId: string; level?: number; area?: string | null };

export function PlayerCard({
	self,
	player,
	onPropose,
	onReport,
	onBlock,
}: {
	self: Player;
	player: Player;
	onPropose: (userId: string) => void;
	onReport: (userId: string) => void;
	onBlock: (userId: string) => void;
}) {
	const score = compatibilityScore(self, player);
	const color = scoreBadgeColor(score);
	return (
		<Card aria-label={`User ${player.userId}`} role="group" variant="outlined">
			<CardContent>
				<Stack
					alignItems="center"
					direction="row"
					justifyContent="space-between"
					spacing={1}
				>
					<div>
						<Typography variant="subtitle1">User: {player.userId}</Typography>
						<Typography variant="body2">
							Lv.{player.level ?? "-"} / {player.area ?? ""}
						</Typography>
					</div>
					<Chip
						color={color}
						label={`合致度 ${score}`}
						variant={color === "default" ? "outlined" : "filled"}
					/>
				</Stack>
			</CardContent>
			<CardActions>
				<Button
					aria-label="提案"
					onClick={() => onPropose(player.userId)}
					size="small"
					variant="contained"
				>
					提案
				</Button>
				<Button
					aria-label="報告"
					color="warning"
					onClick={() => onReport(player.userId)}
					size="small"
				>
					報告
				</Button>
				<Button
					aria-label="ブロック"
					color="error"
					onClick={() => onBlock(player.userId)}
					size="small"
				>
					ブロック
				</Button>
			</CardActions>
		</Card>
	);
}

export default PlayerCard;
