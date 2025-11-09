"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/trpc/react";
import { Box, Button, Chip, Container, Snackbar, Alert, Stack, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import PlayerCard from "@/components/matching/PlayerCard";
import ConfirmDialog from "@/components/common/ConfirmDialog";

type SelfProfile = { level?: number; area?: string | null };

export default function PlayerSearchPage() {
  const [levelMin, setLevelMin] = useState<number | "">(1);
  const [levelMax, setLevelMax] = useState<number | "">(7);
  const [area, setArea] = useState("");
  const [blocked, setBlocked] = useState<Record<string, boolean>>({});
  const [proposalTo, setProposalTo] = useState<string | null>(null);
  const [pStart, setPStart] = useState("");
  const [pEnd, setPEnd] = useState("");
  const [pMsg, setPMsg] = useState("");

  // debounce inputs
  const [debLevelMin, setDebLevelMin] = useState<number | "">(levelMin);
  const [debLevelMax, setDebLevelMax] = useState<number | "">(levelMax);
  const [debArea, setDebArea] = useState<string>(area);
  useEffect(() => {
    const h = setTimeout(() => { setDebLevelMin(levelMin); setDebLevelMax(levelMax); setDebArea(area); }, 300);
    return () => clearTimeout(h);
  }, [levelMin, levelMax, area]);

  const query = api.matching.searchPlayers.useQuery({
    levelMin: typeof debLevelMin === "number" ? debLevelMin : undefined,
    levelMax: typeof debLevelMax === "number" ? debLevelMax : undefined,
    area: debArea || undefined,
  });
  const sendProposal = api.matching.sendProposal.useMutation();

  const self: SelfProfile = { level: 4, area: area || undefined };

  const [page, setPage] = useState(1);
  const pageSize = 50;
  useEffect(() => setPage(1), [debLevelMin, debLevelMax, debArea]);
  const playersAll = useMemo(() => (query.data || []).filter((p) => !blocked[p.userId]), [query.data, blocked]);
  const players = useMemo(() => playersAll.slice(0, page * pageSize), [playersAll, page]);
  const canLoadMore = players.length < playersAll.length;

  const [confirm, setConfirm] = useState<{ open: boolean; userId?: string; type?: 'block' | 'report' }>({ open: false });
  const [toast, setToast] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' | 'info' }>({ open: false, msg: '', severity: 'success' });

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>プレイヤー検索</Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
        <TextField size="small" label="Lv Min" type="number" value={levelMin} onChange={(e) => setLevelMin(e.target.value === "" ? "" : Number(e.target.value))} sx={{ width: 120 }} />
        <TextField size="small" label="Lv Max" type="number" value={levelMax} onChange={(e) => setLevelMax(e.target.value === "" ? "" : Number(e.target.value))} sx={{ width: 120 }} />
        <TextField size="small" label="エリア" value={area} onChange={(e) => setArea(e.target.value)} sx={{ minWidth: 160 }} />
        <Button variant="outlined" onClick={() => query.refetch()}>検索</Button>
        <Button variant="text" onClick={() => { setLevelMin(1); setLevelMax(7); setArea(""); }}>条件リセット</Button>
      </Stack>

      {query.isLoading && <Typography color="text.secondary">検索中…</Typography>}
      {!query.isLoading && players.length === 0 && <Typography color="text.secondary">該当するプレイヤーがいません</Typography>}

      <Stack spacing={1}>
        {players.map((p) => (
          <PlayerCard
            key={p.userId}
            self={{ userId: 'me', ...self }}
            player={{ userId: p.userId, level: p.level, area: p.area }}
            onPropose={(id) => setProposalTo(id)}
            onReport={(id) => setConfirm({ open: true, userId: id, type: 'report' })}
            onBlock={(id) => setConfirm({ open: true, userId: id, type: 'block' })}
          />
        ))}
        {canLoadMore && (
          <Button variant="outlined" onClick={() => setPage((p) => p + 1)}>もっと見る</Button>
        )}
      </Stack>

      <Dialog open={!!proposalTo} onClose={() => setProposalTo(null)}>
        <DialogTitle>マッチ提案を送信</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ mt: 1 }}>
            <TextField size="small" label="開始(ISO)" value={pStart} onChange={(e) => setPStart(e.target.value)} />
            <TextField size="small" label="終了(ISO)" value={pEnd} onChange={(e) => setPEnd(e.target.value)} />
            <TextField size="small" label="メッセージ" value={pMsg} onChange={(e) => setPMsg(e.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProposalTo(null)} autoFocus>キャンセル</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (!proposalTo) return;
              try {
                if (!pStart || !pEnd) { setToast({ open: true, msg: '開始・終了は必須です', severity: 'error' }); return; }
                const sd = new Date(pStart), ed = new Date(pEnd);
                if (!(sd < ed)) { setToast({ open: true, msg: '開始は終了より前にしてください', severity: 'error' }); return; }
                await sendProposal.mutateAsync({ toUser: proposalTo, start: sd, end: ed, message: pMsg || undefined });
                setToast({ open: true, msg: '送信しました', severity: 'success' });
                setProposalTo(null); setPStart(""); setPEnd(""); setPMsg("");
              } catch (e: any) {
                setToast({ open: true, msg: e?.message ?? '送信に失敗しました', severity: 'error' });
              }
            }}
            disabled={!pStart || !pEnd}
          >送信</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirm.open}
        title={confirm.type === 'block' ? 'ブロックしますか？' : '報告しますか？'}
        onClose={() => setConfirm({ open: false })}
        onConfirm={() => {
          if (confirm.userId && confirm.type === 'block') {
            setBlocked((b) => ({ ...b, [confirm.userId!]: true }));
            setToast({ open: true, msg: 'ブロックしました', severity: 'success' });
          }
          if (confirm.type === 'report') setToast({ open: true, msg: '報告を受け付けました', severity: 'info' });
          setConfirm({ open: false });
        }}
      />

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        <Alert severity={toast.severity} sx={{ width: '100%' }}>{toast.msg}</Alert>
      </Snackbar>
    </Container>
  );
}
