"use client";

import {
	AppBar,
	Box,
	Button,
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Toolbar,
	Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";

const UserMenu = dynamic(() => import("@/components/layout/UserMenu"), {
	ssr: false,
});

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
	const isActive = (href: string) =>
		pathname === href || (href !== "/" && pathname?.startsWith(href));

	const NavList = ({ title, items }: { title: string; items: NavItem[] }) => (
		<Box>
			<Typography
				sx={{ px: 2, pt: 1, display: "block", color: "text.secondary" }}
				variant="overline"
			>
				{title}
			</Typography>
			<List>
				{items.map((item) => (
					<ListItem disablePadding key={item.href}>
						<ListItemButton
							component={Link}
							href={item.href}
							onClick={() => setMobileOpen(false)}
							selected={isActive(item.href)}
						>
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
				<Typography
					component={Link}
					href="/"
					sx={{ textDecoration: "none", color: "inherit" }}
					variant="h6"
				>
					TennisMate
				</Typography>
			</Box>
			<Divider />
			<NavList items={primary} title="メイン" />
			<Divider />
			<NavList items={secondary} title="スコア" />
			<Divider />
			<NavList items={admin} title="管理" />
		</Box>
	);

	return (
		<Box sx={{ display: "flex" }}>
			{/* Top AppBar (always shown). On desktop, offset for permanent drawer. */}
			<AppBar
				color="primary"
				position="fixed"
				sx={(theme) => ({
					zIndex: theme.zIndex.drawer + 1,
					width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
					ml: { xs: 0, md: `${drawerWidth}px` },
				})}
			>
				<Toolbar sx={{ gap: 1 }}>
					{/* Mobile only: hamburger */}
					<Button
						aria-label="menu"
						color="inherit"
						onClick={() => setMobileOpen(true)}
						sx={{ minWidth: 0, display: { xs: "inline-flex", md: "none" } }}
					>
						≡
					</Button>
					<Typography
						component={Link}
						href="/"
						style={{ color: "inherit", textDecoration: "none" }}
						variant="h6"
					>
						TennisMate
					</Typography>
					<Box sx={{ flexGrow: 1 }} />
					<UserMenu />
				</Toolbar>
			</AppBar>

			{/* Temporary drawer for mobile */}
			<Drawer
				ModalProps={{ keepMounted: true }}
				onClose={() => setMobileOpen(false)}
				open={mobileOpen}
				sx={{
					display: { xs: "block", md: "none" },
					"& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
				}}
				variant="temporary"
			>
				{drawer}
			</Drawer>

			{/* Permanent drawer for desktop */}
			<Drawer
				open
				sx={{
					display: { xs: "none", md: "block" },
					"& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
				}}
				variant="permanent"
			>
				{/* offset for AppBar height */}
				<Toolbar />
				{drawer}
			</Drawer>

			{/* Main content */}
			<Box
				component="main"
				sx={{ flexGrow: 1, ml: { md: `${drawerWidth}px` } }}
			>
				{/* offset for AppBar height (all sizes) */}
				<Toolbar />
				{children}
			</Box>
		</Box>
	);
}
