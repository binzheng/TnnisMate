"use client";
import { Card, CardActions, CardContent, Chip, Stack, Typography, Button } from "@mui/material";
import { compatibilityScore, scoreBadgeColor } from "@/lib/matchingScore";

export type Player = { userId: string; level?: number; area?: string | null };

export function PlayerCard({ self, player, onPropose, onReport, onBlock }: {
  self: Player;
  player: Player;
  onPropose: (userId: string) => void;
  onReport: (userId: string) => void;
  onBlock: (userId: string) => void;
}) {
  const score = compatibilityScore(self, player);
  const color = scoreBadgeColor(score);
  return (
    <Card role="group" aria-label={`User ${player.userId}`} variant="outlined">
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <div>
            <Typography variant="subtitle1">User: {player.userId}</Typography>
            <Typography variant="body2">Lv.{player.level ?? "-"} / {player.area ?? ""}</Typography>
          </div>
          <Chip label={`合致度 ${score}`} color={color} variant={color === 'default' ? 'outlined' : 'filled'} />
        </Stack>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained" aria-label="提案" onClick={() => onPropose(player.userId)}>提案</Button>
        <Button size="small" color="warning" aria-label="報告" onClick={() => onReport(player.userId)}>報告</Button>
        <Button size="small" color="error" aria-label="ブロック" onClick={() => onBlock(player.userId)}>ブロック</Button>
      </CardActions>
    </Card>
  );
}

export default PlayerCard;

