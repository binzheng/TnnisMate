"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { AppBar, Box, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from "@mui/material";
import dynamic from "next/dynamic";
const UserMenu = dynamic(() => import("@/components/layout/UserMenu"), { ssr: false });

type NavItem = { label: string; href: string };

const primary: NavItem[] = [
  { label: "スケジュール", href: "/schedule" },
  { label: "マッチング検索", href: "/matching/search" },
  { label: "提案一覧", href: "/matching/proposals" },
  { label: "スコア登録", href: "/scores/new" },
];

const secondary: NavItem[] = [
  { label: "スコア履歴", href: "/scores/history" },
  { label: "ランキング", href: "/scores/ranking" },
  { label: "重なり可視化(β)", href: "/matching/overlay" },
];

const admin: NavItem[] = [
  { label: "管理ダッシュボード", href: "/admin/dashboard" },
  { label: "カタログ", href: "/admin/catalog" },
  { label: "レッスンスロット", href: "/admin/lessons/slots" },
  { label: "在庫インポート", href: "/admin/inventory" },
  { label: "プレイヤープロファイル(管理)", href: "/admin/matching/profile" },
  { label: "ユーザーマスタ", href: "/admin/users" },
];

const drawerWidth = 260;

export function AppSideNav({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (href: string) => pathname === href || (href !== "/" && pathname?.startsWith(href));

  const NavList = ({ title, items }: { title: string; items: NavItem[] }) => (
    <Box>
      <Typography variant="overline" sx={{ px: 2, pt: 1, display: "block", color: "text.secondary" }}>
        {title}
      </Typography>
      <List>
        {items.map((item) => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton component={Link} href={item.href} selected={isActive(item.href)} onClick={() => setMobileOpen(false)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const drawer = (
    <Box role="presentation" sx={{ width: drawerWidth }}>
      <Box sx={{ px: 2, py: 2 }}>
        <Typography component={Link} href="/" variant="h6" sx={{ textDecoration: "none", color: "inherit" }}>
          TennisMate
        </Typography>
      </Box>
      <Divider />
      <NavList title="メイン" items={primary} />
      <Divider />
      <NavList title="スコア" items={secondary} />
      <Divider />
      <NavList title="管理" items={admin} />
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top AppBar (always shown). On desktop, offset for permanent drawer. */}
      <AppBar
        position="fixed"
        color="primary"
        sx={(theme) => ({
          zIndex: theme.zIndex.drawer + 1,
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, md: `${drawerWidth}px` },
        })}
      >
        <Toolbar sx={{ gap: 1 }}>
          {/* Mobile only: hamburger */}
          <Button color="inherit" aria-label="menu" onClick={() => setMobileOpen(true)} sx={{ minWidth: 0, display: { xs: "inline-flex", md: "none" } }}>
            ≡
          </Button>
          <Typography variant="h6" component={Link} href="/" style={{ color: "inherit", textDecoration: "none" }}>
            TennisMate
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <UserMenu />
        </Toolbar>
      </AppBar>

      {/* Temporary drawer for mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}
      >
        {drawer}
      </Drawer>

      {/* Permanent drawer for desktop */}
      <Drawer variant="permanent" open sx={{ display: { xs: "none", md: "block" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}>
        {/* offset for AppBar height */}
        <Toolbar />
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, ml: { md: `${drawerWidth}px` } }}>
        {/* offset for AppBar height (all sizes) */}
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
