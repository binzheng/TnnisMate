"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
} from "@mui/material";
import { useState } from "react";

type NavItem = {
  label: string;
  href: string;
};

const primary: NavItem[] = [
  { label: "ホーム", href: "/" },
  { label: "スケジュール", href: "/schedule" },
  { label: "マッチング検索", href: "/matching/search" },
  { label: "提案一覧", href: "/matching/proposals" },
  { label: "スコア登録", href: "/scores/new" },
];

const admin: NavItem[] = [
  { label: "管理ダッシュボード", href: "/admin/dashboard" },
  { label: "カタログ", href: "/admin/catalog" },
  { label: "レッスンスロット", href: "/admin/lessons/slots" },
  { label: "在庫インポート", href: "/admin/inventory" },
  { label: "プレイヤープロファイル(管理)", href: "/admin/matching/profile" },
];

const secondary: NavItem[] = [
  { label: "スコア履歴", href: "/scores/history" },
  { label: "ランキング", href: "/scores/ranking" },
  { label: "重なり可視化(β)", href: "/matching/overlay" },
];

export function AppHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  const renderButtons = (items: NavItem[]) => (
    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
      {items.map((item) => (
        <Button
          key={item.href}
          component={Link}
          href={item.href}
          color={isActive(item.href) ? "secondary" : "inherit"}
          variant={isActive(item.href) ? "contained" : "text"}
          size="small"
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );

  const renderList = (items: NavItem[]) => (
    <List>
      {items.map((item) => (
        <ListItem key={item.href} disablePadding>
          <ListItemButton component={Link} href={item.href} onClick={() => setOpen(false)} selected={isActive(item.href)}>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <AppBar position="sticky" color="primary" enableColorOnDark>
        <Toolbar sx={{ gap: 2 }}>
          <Button
            color="inherit"
            aria-label="menu"
            onClick={() => setOpen(true)}
            sx={{ display: { xs: "inline-flex", md: "none" }, minWidth: 0 }}
          >
            ≡
          </Button>

          <Typography
            variant="h6"
            component={Link}
            href="/"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            TennisMate
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {renderButtons(primary)}
          {renderButtons(secondary)}
          {renderButtons(admin)}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 280 }} role="presentation" onKeyDown={() => setOpen(false)}>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1">メニュー</Typography>
          </Box>
          {renderList(primary)}
          {renderList(secondary)}
          {renderList(admin)}
        </Box>
      </Drawer>
    </>
  );
}
