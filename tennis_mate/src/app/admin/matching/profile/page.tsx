"use client";
import {
	Box,
	Button,
	Container,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { api } from "@/trpc/react";

export default function MatchingProfilePage() {
	const utils = api.useUtils();
	const search = api.matching.searchPlayers.useQuery({});
	const upsert = api.matching.upsertProfile.useMutation({
		onSuccess: () => utils.matching.searchPlayers.invalidate(),
	});
	const [level, setLevel] = useState(3);
	const [area, setArea] = useState("");

	return (
		<Container sx={{ py: 3 }}>
			<Typography sx={{ mb: 2 }} variant="h5">
				マッチングプロフィール
			</Typography>
			<Stack direction="row" spacing={1} sx={{ mb: 2 }}>
				<TextField
					label="レベル"
					onChange={(e) => setLevel(Number(e.target.value))}
					size="small"
					type="number"
					value={level}
				/>
				<TextField
					label="エリア"
					onChange={(e) => setArea(e.target.value)}
					size="small"
					value={area}
				/>
				<Button
					onClick={async () => upsert.mutateAsync({ level, area })}
					variant="contained"
				>
					保存
				</Button>
			</Stack>
			<Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
				{(search.data || []).map((p) => (
					<Box key={p.userId}>
						{p.userId} — Lv.{p.level} — {p.area ?? ""}
					</Box>
				))}
			</Box>
		</Container>
	);
}
