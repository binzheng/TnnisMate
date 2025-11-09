"use client";
import { Box, Container, Snackbar, Tab, Tabs, Typography, Alert, Drawer, Stack, Divider, Button, TextField, Chip } from "@mui/material";
import { useMemo, useState } from "react";
import Legend from "@/components/schedule/Legend";
import WeeklyCalendar, { type CalendarEvent } from "@/components/schedule/WeeklyCalendar";
import DailyCalendar from "@/components/schedule/DailyCalendar";
import MonthlyCalendar from "@/components/schedule/MonthlyCalendar";
import QuickCreateDialog, { type QuickCreateInput, type ReservationDraft, type CourtOption } from "@/components/schedule/QuickCreateDialog";
import ReschedulePreviewDialog, { type TargetSlot } from "@/components/schedule/ReschedulePreviewDialog";
import EventDetailDialog from "@/components/schedule/EventDetailDialog";
import { api } from "@/trpc/react";

export default function HomePage() {
  const [tab, setTab] = useState<"day" | "week" | "month">("week");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [draft, setDraft] = useState<QuickCreateInput | null>(null);
  const [snack, setSnack] = useState<{ open: boolean; lastId?: string; lastAction?: 'create'|'cancel'; backupEvent?: CalendarEvent }>({ open: false });
  const [reschedule, setReschedule] = useState<{
    event: CalendarEvent | null;
    target: TargetSlot | null;
    prev?: { startHour: number; endHour: number; dayIndex: number };
  }>({ event: null, target: null });
  const [detail, setDetail] = useState<CalendarEvent | null>(null); // dialog-based detail (2-5)
  const [drawerEv, setDrawerEv] = useState<CalendarEvent | null>(null); // 2-7 drawer
  const [query, setQuery] = useState("");
  const [chips, setChips] = useState<{ soon: boolean; changed: boolean; needsReview: boolean }>({ soon: false, changed: false, needsReview: false });
  const [currentDate, setCurrentDate] = useState(new Date());
  const courtsQuery = api.catalog.listCourts.useQuery();

  // tRPC mutations (best-effort; backend/env が整えば持続化)
  const createReservation = api.reservations.createReservation.useMutation();
  const updateReservation = api.reservations.updateReservation.useMutation();
  const cancelReservation = api.reservations.cancelReservation.useMutation();

  const weekBase = (() => {
    const now = new Date();
    const day = now.getDay(); // 0..6, Sun=0
    const monday = new Date(now);
    const diffToMon = (day + 6) % 7; // Mon=0
    monday.setDate(now.getDate() - diffToMon);
    monday.setHours(0, 0, 0, 0);
    return monday;
  })();

  const toDate = (dayIndex: number, hour: number) => {
    const d = new Date(weekBase);
    d.setDate(weekBase.getDate() + dayIndex);
    d.setHours(hour, 0, 0, 0);
    return d;
  };

  const handleSelect = (sel: QuickCreateInput) => {
    setDraft(sel);
  };

  const handleCreate = async (d: ReservationDraft) => {
    const id = `${Date.now()}`;
    const e: CalendarEvent = {
      id,
      dayIndex: d.dayIndex,
      startHour: d.startHour,
      endHour: d.endHour,
      title: d.title,
      court:
        (courtsQuery.data || [])
          .find((c) => c.id === d.courtId)?.name ?? "—",
      userId: "u1",
    };
    setEvents((prev) => [...prev, e]);
    setDraft(null);
    setSnack({ open: true, lastId: id, lastAction: 'create', backupEvent: undefined });

    // Persist (best-effort)
    try {
      const res = await createReservation.mutateAsync({
        courtId: d.courtId,
        start: toDate(d.dayIndex, d.startHour),
        end: toDate(d.dayIndex, d.endHour),
      });
      // Replace temp id with DB id
      setEvents((prev) => prev.map((x) => (x.id === id ? { ...x, id: res.id } : x)));
      setSnack((s) => ({ ...s, lastId: res.id }));
    } catch {
      // ignore in non-configured environments
    }
  };

  const undo = () => {
    if (snack.lastAction === 'create') {
      if (!snack.lastId) return;
      setEvents((prev) => prev.filter((x) => x.id !== snack.lastId));
      setSnack({ open: false, lastId: undefined, lastAction: undefined, backupEvent: undefined });
    } else if (snack.lastAction === 'cancel') {
      if (!snack.backupEvent) return;
      const ev = snack.backupEvent;
      setEvents((prev) => [...prev, ev]);
      setSnack({ open: false, lastId: undefined, lastAction: undefined, backupEvent: undefined });
    }
  };

  const handleDropEvent = (eventId: string, target: TargetSlot) => {
    const ev = events.find((e) => e.id === eventId) || null;
    if (!ev) return;
    setReschedule({ event: ev, target, prev: { dayIndex: ev.dayIndex, startHour: ev.startHour, endHour: ev.endHour } });
  };

  const confirmReschedule = async () => {
    if (!reschedule.event || !reschedule.target) return;
    setEvents((prev) =>
      prev.map((e) =>
        e.id === reschedule.event!.id
          ? { ...e, dayIndex: reschedule.target!.dayIndex, startHour: reschedule.target!.startHour, endHour: reschedule.target!.endHour, changed: true }
          : e,
      ),
    );
    setSnack({ open: true, lastId: reschedule.event.id });
    setReschedule({ event: null, target: null, prev: undefined });

    // Persist (best-effort)
    try {
      await updateReservation.mutateAsync({
        id: reschedule.event.id,
        start: toDate(reschedule.target.dayIndex, reschedule.target.startHour),
        end: toDate(reschedule.target.dayIndex, reschedule.target.endHour),
      });
    } catch {}
  };

  const visibleEvents = useMemo(() => {
    let list = events;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(q) || e.court.toLowerCase().includes(q));
    }
    if (chips.soon) {
      list = list.filter((e) => e.dayIndex <= 1);
    }
    if (chips.changed) {
      list = list.filter((e) => e.changed);
    }
    if (chips.needsReview) {
      list = list.filter((e) => e.needsReview);
    }
    return list;
  }, [events, query, chips]);

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        スケジュール
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        aria-label="calendar view tabs"
        sx={{ mb: 1 }}
      >
        <Tab value="day" label="Day" />
        <Tab value="week" label="Week" />
        <Tab value="month" label="Month" />
      </Tabs>

      <Legend />

      {/* Filters */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, flexWrap: "wrap" }}>
        <TextField
          aria-label="検索"
          placeholder="検索（タイトル/コート）"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          sx={{ minWidth: 220, flex: 1 }}
        />
        <Chip
          label="近日"
          color={chips.soon ? "primary" : "default"}
          variant={chips.soon ? "filled" : "outlined"}
          onClick={() => setChips((c) => ({ ...c, soon: !c.soon }))}
          aria-pressed={chips.soon}
        />
        <Chip
          label="変更あり"
          color={chips.changed ? "primary" : "default"}
          variant={chips.changed ? "filled" : "outlined"}
          onClick={() => setChips((c) => ({ ...c, changed: !c.changed }))}
          aria-pressed={chips.changed}
        />
        <Chip
          label="要確認"
          color={chips.needsReview ? "primary" : "default"}
          variant={chips.needsReview ? "filled" : "outlined"}
          onClick={() => setChips((c) => ({ ...c, needsReview: !c.needsReview }))}
          aria-pressed={chips.needsReview}
        />
        <Button
          onClick={() => {
            setQuery("");
            setChips({ soon: false, changed: false, needsReview: false });
          }}
          variant="outlined"
          size="small"
        >
          全解除
        </Button>
      </Stack>

      {tab === "week" && (
        <WeeklyCalendar
          events={visibleEvents}
          onDragSelect={handleSelect}
          onDropEvent={handleDropEvent}
          onEventClick={(id) => setDrawerEv(events.find((e) => e.id === id) ?? null)}
        />
      )}
      {tab === "day" && (
        <DailyCalendar
          events={visibleEvents}
          courts={(courtsQuery.data as CourtOption[] | undefined) ?? []}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onDragSelect={(sel) => {
            // Convert court-based selection to day-based for compatibility
            const court = (courtsQuery.data || []).find((c) => c.id === sel.courtId);
            if (court) {
              setDraft({
                dayIndex: currentDate.getDay(),
                startHour: sel.startHour,
                endHour: sel.endHour,
              });
            }
          }}
          onDropEvent={(eventId, target) => {
            // Handle drop event for daily view
            const ev = events.find((e) => e.id === eventId);
            if (!ev) return;
            setReschedule({
              event: ev,
              target: {
                dayIndex: currentDate.getDay(),
                startHour: target.startHour,
                endHour: target.endHour,
              },
              prev: { dayIndex: ev.dayIndex, startHour: ev.startHour, endHour: ev.endHour },
            });
          }}
          onEventClick={(id) => setDrawerEv(events.find((e) => e.id === id) ?? null)}
        />
      )}
      {tab === "month" && (
        <MonthlyCalendar
          events={visibleEvents}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onDateClick={(date) => {
            // Switch to day view for the selected date
            setCurrentDate(date);
            setTab("day");
          }}
          onEventClick={(id) => setDrawerEv(events.find((e) => e.id === id) ?? null)}
        />
      )}

      <QuickCreateDialog
        open={!!draft}
        initial={draft}
        courts={(courtsQuery.data as CourtOption[] | undefined) ?? []}
        onClose={() => setDraft(null)}
        onSubmit={handleCreate}
      />

      <ReschedulePreviewDialog
        open={!!reschedule.event && !!reschedule.target}
        event={reschedule.event}
        target={reschedule.target}
        allEvents={events}
        serverTarget={reschedule.target ? { start: toDate(reschedule.target.dayIndex, reschedule.target.startHour), end: toDate(reschedule.target.dayIndex, reschedule.target.endHour) } : undefined}
        onClose={() => setReschedule({ event: null, target: null, prev: undefined })}
        onConfirm={confirmReschedule}
      />

      <EventDetailDialog
        open={!!detail}
        event={detail}
        onClose={() => setDetail(null)}
        onCancel={async (id) => {
          const removed = events.find((e) => e.id === id) || null;
          setEvents((prev) => prev.filter((e) => e.id !== id));
          setDetail(null);
          if (removed) {
            setSnack({ open: true, lastId: removed.id, lastAction: 'cancel', backupEvent: removed });
          } else {
            setSnack({ open: true, lastAction: 'cancel' });
          }

          try {
            await cancelReservation.mutateAsync({ id });
          } catch {}
        }}
      />

      {/* Reservation Detail Drawer (right) */}
      <Drawer anchor="right" open={!!drawerEv} onClose={() => setDrawerEv(null)}>
        <Box sx={{ width: 360, p: 2 }} role="dialog" aria-label="予約詳細">
          <Typography variant="h6" sx={{ mb: 1 }}>
            予約詳細
          </Typography>
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Typography variant="subtitle2">概要</Typography>
            <Typography variant="body2">タイトル: {drawerEv?.title}</Typography>
            <Typography variant="body2">コート: {drawerEv?.court}</Typography>
            <Typography variant="body2">
              期間: {drawerEv?.startHour}:00 ~ {drawerEv?.endHour}:00
            </Typography>
            <Typography variant="body2">状態: {drawerEv?.changed ? "変更あり" : "通常"}</Typography>
            <Typography variant="body2">料金: ¥—（後続実装）</Typography>
            <Typography variant="body2">参加者: —（後続実装）</Typography>
          </Stack>
          <Divider />
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            履歴（簡易）
          </Typography>
          <Stack spacing={0.5} sx={{ mb: 2 }}>
            <Typography variant="caption">作成: 今回セッション</Typography>
            {drawerEv?.changed && <Typography variant="caption">変更: 時間帯を更新</Typography>}
          </Stack>
          <Divider />
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            主要アクション
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              onClick={() => {
                // mark for review (簡易)。将来はプレビュー起動や編集画面へ遷移
                if (!drawerEv) return;
                setEvents((prev) => prev.map((e) => (e.id === drawerEv.id ? { ...e, needsReview: true } : e)));
              }}
            >
              変更
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                if (!drawerEv) return;
                const removed = drawerEv;
                setEvents((prev) => prev.filter((e) => e.id !== removed.id));
                setSnack({ open: true, lastId: removed.id, lastAction: 'cancel', backupEvent: removed });
                setDrawerEv(null);
              }}
            >
              キャンセル
            </Button>
          </Stack>
        </Box>
      </Drawer>

      <Snackbar
        open={snack.open}
        autoHideDuration={7000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert onClose={() => setSnack((s) => ({ ...s, open: false }))} severity={snack.lastAction === 'cancel' ? 'info' : 'success'} sx={{ width: "100%" }}>
          {snack.lastAction === 'cancel' ? '予約をキャンセルしました' : '予約を作成しました'} —
          <Box component="button" onClick={undo} sx={{ color: "inherit", textDecoration: "underline", ml: 1 }}>Undo</Box>
        </Alert>
      </Snackbar>
    </Container>
  );
}
