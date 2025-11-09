"use client";
import {
	Box,
	Button,
	Container,
	Divider,
	MenuItem,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { api } from "@/trpc/react";

export default function CatalogAdminPage() {
	const utils = api.useUtils();
	const facilities = api.catalog.listFacilities.useQuery();
	const courts = api.catalog.listCourts.useQuery();
	const createFacility = api.catalog.createFacility.useMutation({
		onSuccess: () => utils.catalog.listFacilities.invalidate(),
	});
	const createCourt = api.catalog.createCourt.useMutation({
		onSuccess: () => utils.catalog.listCourts.invalidate(),
	});
	const updateFacility = api.catalog.updateFacility.useMutation({
		onSuccess: () => utils.catalog.listFacilities.invalidate(),
	});
	const deleteFacility = api.catalog.deleteFacility.useMutation({
		onSuccess: () => utils.catalog.listFacilities.invalidate(),
	});
	const updateCourt = api.catalog.updateCourt.useMutation({
		onSuccess: () => utils.catalog.listCourts.invalidate(),
	});
	const deleteCourt = api.catalog.deleteCourt.useMutation({
		onSuccess: () => utils.catalog.listCourts.invalidate(),
	});

	const [facilityName, setFacilityName] = useState("");
	const [editingFacilityId, setEditingFacilityId] = useState<string>("");
	const [facilityEditName, setFacilityEditName] = useState("");
	const [courtName, setCourtName] = useState("");
	const [facilityId, setFacilityId] = useState<string>("");
	const [editingCourtId, setEditingCourtId] = useState<string>("");
	const [courtEditName, setCourtEditName] = useState("");

	return (
		<Container sx={{ py: 3 }}>
			<Typography sx={{ mb: 2 }} variant="h5">
				施設・コート 管理
			</Typography>

			<Stack
				alignItems={{ md: "flex-start" }}
				direction={{ xs: "column", md: "row" }}
				spacing={3}
			>
				{/* Facilities */}
				<Box sx={{ flex: 1, minWidth: 300 }}>
					<Typography variant="subtitle1">施設一覧</Typography>
					<Box
						sx={{
							border: 1,
							borderColor: "divider",
							borderRadius: 1,
							p: 2,
							mt: 1,
						}}
					>
						<Stack spacing={1}>
							{(facilities.data || []).map((f) => (
								<Stack
									alignItems="center"
									direction="row"
									key={f.id}
									spacing={1}
								>
									{editingFacilityId === f.id ? (
										<>
											<TextField
												onChange={(e) => setFacilityEditName(e.target.value)}
												size="small"
												value={facilityEditName}
											/>
											<Button
												onClick={async () => {
													await updateFacility.mutateAsync({
														id: f.id,
														name: facilityEditName || f.name,
													});
													setEditingFacilityId("");
												}}
												size="small"
												variant="contained"
											>
												保存
											</Button>
											<Button
												onClick={() => setEditingFacilityId("")}
												size="small"
											>
												取消
											</Button>
										</>
									) : (
										<>
											<Box sx={{ flex: 1 }}>{f.name}</Box>
											<Button
												onClick={() => {
													setEditingFacilityId(f.id);
													setFacilityEditName(f.name);
												}}
												size="small"
												variant="text"
											>
												編集
											</Button>
											<Button
												color="error"
												onClick={async () => {
													if (
														confirm(
															"この施設を削除しますか？コートが残っている場合は削除できません。",
														)
													) {
														try {
															await deleteFacility.mutateAsync({ id: f.id });
														} catch (e: any) {
															alert(e?.message ?? "削除に失敗しました");
														}
													}
												}}
												size="small"
												variant="text"
											>
												削除
											</Button>
										</>
									)}
								</Stack>
							))}
							{facilities.isLoading && (
								<Typography color="text.secondary">読み込み中…</Typography>
							)}
						</Stack>
						<Divider sx={{ my: 2 }} />
						<Stack direction="row" spacing={1}>
							<TextField
								label="施設名"
								onChange={(e) => setFacilityName(e.target.value)}
								size="small"
								value={facilityName}
							/>
							<Button
								disabled={!facilityName}
								onClick={async () => {
									await createFacility.mutateAsync({ name: facilityName });
									setFacilityName("");
								}}
								variant="contained"
							>
								追加
							</Button>
						</Stack>
					</Box>
				</Box>

				{/* Courts */}
				<Box sx={{ flex: 1, minWidth: 300 }}>
					<Typography variant="subtitle1">コート一覧</Typography>
					<Box
						sx={{
							border: 1,
							borderColor: "divider",
							borderRadius: 1,
							p: 2,
							mt: 1,
						}}
					>
						<Stack spacing={1}>
							{(courts.data || []).map((c) => (
								<Stack
									alignItems="center"
									direction="row"
									key={c.id}
									spacing={1}
								>
									{editingCourtId === c.id ? (
										<>
											<TextField
												onChange={(e) => setCourtEditName(e.target.value)}
												size="small"
												value={courtEditName}
											/>
											<Button
												onClick={async () => {
													await updateCourt.mutateAsync({
														id: c.id,
														name: courtEditName || c.name,
													});
													setEditingCourtId("");
												}}
												size="small"
												variant="contained"
											>
												保存
											</Button>
											<Button
												onClick={() => setEditingCourtId("")}
												size="small"
											>
												取消
											</Button>
										</>
									) : (
										<>
											<Box sx={{ flex: 1 }}>
												{c.facilityName} / {c.name}
											</Box>
											<Button
												onClick={() => {
													setEditingCourtId(c.id);
													setCourtEditName(c.name);
												}}
												size="small"
												variant="text"
											>
												編集
											</Button>
											<Button
												color="error"
												onClick={async () => {
													if (
														confirm(
															"このコートを削除しますか？予約が存在する場合は削除できません。",
														)
													) {
														try {
															await deleteCourt.mutateAsync({ id: c.id });
														} catch (e: any) {
															alert(e?.message ?? "削除に失敗しました");
														}
													}
												}}
												size="small"
												variant="text"
											>
												削除
											</Button>
										</>
									)}
								</Stack>
							))}
							{courts.isLoading && (
								<Typography color="text.secondary">読み込み中…</Typography>
							)}
						</Stack>
						<Divider sx={{ my: 2 }} />
						<Stack direction="row" spacing={1}>
							<TextField
								label="コート名"
								onChange={(e) => setCourtName(e.target.value)}
								size="small"
								value={courtName}
							/>
							<TextField
								label="施設"
								onChange={(e) => setFacilityId(e.target.value)}
								select
								size="small"
								sx={{ minWidth: 200 }}
								value={facilityId}
							>
								{(facilities.data || []).map((f) => (
									<MenuItem key={f.id} value={f.id}>
										{f.name}
									</MenuItem>
								))}
							</TextField>
							<Button
								disabled={!courtName || !facilityId}
								onClick={async () => {
									await createCourt.mutateAsync({
										name: courtName,
										facilityId,
									});
									setCourtName("");
								}}
								variant="contained"
							>
								追加
							</Button>
						</Stack>
					</Box>
				</Box>
			</Stack>
		</Container>
	);
}
