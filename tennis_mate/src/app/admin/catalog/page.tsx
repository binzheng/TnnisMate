"use client";
import { Box, Button, Container, Divider, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { api } from "@/trpc/react";
import { useState } from "react";

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
      <Typography variant="h5" sx={{ mb: 2 }}>
        施設・コート 管理
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems={{ md: "flex-start" }}>
        {/* Facilities */}
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Typography variant="subtitle1">施設一覧</Typography>
          <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2, mt: 1 }}>
            <Stack spacing={1}>
              {(facilities.data || []).map((f) => (
                <Stack key={f.id} direction="row" spacing={1} alignItems="center">
                  {editingFacilityId === f.id ? (
                    <>
                      <TextField size="small" value={facilityEditName} onChange={(e) => setFacilityEditName(e.target.value)} />
                      <Button
                        size="small"
                        variant="contained"
                        onClick={async () => {
                          await updateFacility.mutateAsync({ id: f.id, name: facilityEditName || f.name });
                          setEditingFacilityId("");
                        }}
                      >
                        保存
                      </Button>
                      <Button size="small" onClick={() => setEditingFacilityId("")}>取消</Button>
                    </>
                  ) : (
                    <>
                      <Box sx={{ flex: 1 }}>{f.name}</Box>
                      <Button size="small" variant="text" onClick={() => { setEditingFacilityId(f.id); setFacilityEditName(f.name); }}>編集</Button>
                      <Button
                        size="small"
                        variant="text"
                        color="error"
                        onClick={async () => {
                          if (confirm("この施設を削除しますか？コートが残っている場合は削除できません。")) {
                            try {
                              await deleteFacility.mutateAsync({ id: f.id });
                            } catch (e: any) {
                              alert(e?.message ?? "削除に失敗しました");
                            }
                          }
                        }}
                      >削除</Button>
                    </>
                  )}
                </Stack>
              ))}
              {facilities.isLoading && <Typography color="text.secondary">読み込み中…</Typography>}
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                label="施設名"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
              />
              <Button
                variant="contained"
                disabled={!facilityName}
                onClick={async () => {
                  await createFacility.mutateAsync({ name: facilityName });
                  setFacilityName("");
                }}
              >
                追加
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Courts */}
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Typography variant="subtitle1">コート一覧</Typography>
          <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2, mt: 1 }}>
            <Stack spacing={1}>
              {(courts.data || []).map((c) => (
                <Stack key={c.id} direction="row" spacing={1} alignItems="center">
                  {editingCourtId === c.id ? (
                    <>
                      <TextField size="small" value={courtEditName} onChange={(e) => setCourtEditName(e.target.value)} />
                      <Button
                        size="small"
                        variant="contained"
                        onClick={async () => {
                          await updateCourt.mutateAsync({ id: c.id, name: courtEditName || c.name });
                          setEditingCourtId("");
                        }}
                      >
                        保存
                      </Button>
                      <Button size="small" onClick={() => setEditingCourtId("")}>取消</Button>
                    </>
                  ) : (
                    <>
                      <Box sx={{ flex: 1 }}>
                        {c.facilityName} / {c.name}
                      </Box>
                      <Button size="small" variant="text" onClick={() => { setEditingCourtId(c.id); setCourtEditName(c.name); }}>編集</Button>
                      <Button
                        size="small"
                        variant="text"
                        color="error"
                        onClick={async () => {
                          if (confirm("このコートを削除しますか？予約が存在する場合は削除できません。")) {
                            try {
                              await deleteCourt.mutateAsync({ id: c.id });
                            } catch (e: any) {
                              alert(e?.message ?? "削除に失敗しました");
                            }
                          }
                        }}
                      >削除</Button>
                    </>
                  )}
                </Stack>
              ))}
              {courts.isLoading && <Typography color="text.secondary">読み込み中…</Typography>}
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                label="コート名"
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
              />
              <TextField
                size="small"
                select
                label="施設"
                value={facilityId}
                onChange={(e) => setFacilityId(e.target.value)}
                sx={{ minWidth: 200 }}
              >
                {(facilities.data || []).map((f) => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.name}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                disabled={!courtName || !facilityId}
                onClick={async () => {
                  await createCourt.mutateAsync({ name: courtName, facilityId });
                  setCourtName("");
                }}
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
