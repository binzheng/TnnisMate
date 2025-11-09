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
import { formatDateTime } from "@/lib/dates";
import { api } from "@/trpc/react";

export default function LessonSlotsAdminPage() {
	const utils = api.useUtils();
	const slots = api.lessons.listSlots.useQuery();
	const createSlot = api.lessons.createSlot.useMutation({
		onSuccess: () => utils.lessons.listSlots.invalidate(),
	});
	const deleteSlot = api.lessons.deleteSlot.useMutation({
		onSuccess: () => utils.lessons.listSlots.invalidate(),
	});
	const [form, setForm] = useState({
		courtId: "",
		start: "",
		end: "",
		capacity: 4,
	});

	return (
		<Container sx={{ py: 3 }}>
			<Typography sx={{ mb: 2 }} variant="h5">
				レッスン枠 管理
			</Typography>

			<Stack direction="row" spacing={1} sx={{ mb: 2 }}>
				<TextField
					label="CourtId"
					onChange={(e) => setForm({ ...form, courtId: e.target.value })}
					size="small"
					value={form.courtId}
				/>
				<TextField
					label="開始(ISO)"
					onChange={(e) => setForm({ ...form, start: e.target.value })}
					size="small"
					value={form.start}
				/>
				<TextField
					label="終了(ISO)"
					onChange={(e) => setForm({ ...form, end: e.target.value })}
					size="small"
					value={form.end}
				/>
				<TextField
					label="定員"
					onChange={(e) =>
						setForm({ ...form, capacity: Number(e.target.value) })
					}
					size="small"
					type="number"
					value={form.capacity}
				/>
				<Button
					disabled={!form.courtId || !form.start || !form.end}
					onClick={async () => {
						await createSlot.mutateAsync({
							courtId: form.courtId,
							start: new Date(form.start),
							end: new Date(form.end),
							capacity: form.capacity,
						});
					}}
					variant="contained"
				>
					追加
				</Button>
			</Stack>

			<Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
				{(slots.data || []).map((s) => (
					<Stack
						alignItems="center"
						direction="row"
						key={s.id}
						spacing={1}
						sx={{ mb: 1 }}
					>
						<Box sx={{ flex: 1 }}>
							{s.court?.name ?? ""} | {formatDateTime(new Date(s.start))} -{" "}
							{formatDateTime(new Date(s.end))} | 定員 {s.capacity}
						</Box>
						<Button
							color="error"
							onClick={async () => {
								if (confirm("削除しますか？"))
									await deleteSlot.mutateAsync({ id: s.id });
							}}
							size="small"
						>
							削除
						</Button>
					</Stack>
				))}
			</Box>
		</Container>
	);
}
