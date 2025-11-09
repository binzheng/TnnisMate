"use client";

import { Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function UserMenu() {
	const router = useRouter();
	const { data: session } = useSession();
	if (!session?.user) {
		return (
			<Button color="inherit" component={Link} href="/login" size="small">
				ログイン
			</Button>
		);
	}
	return (
		<Stack alignItems="center" direction="row" spacing={1}>
			<Typography
				sx={{ display: { xs: "none", sm: "inline" } }}
				variant="body2"
			>
				{session.user.name ?? session.user.email ?? "ユーザー"}
			</Typography>
			<Button
				color="inherit"
				onClick={async () => {
					// Sign out without auto-redirect, then navigate explicitly
					await signOut({ redirect: false });
					router.replace("/login");
				}}
				size="small"
			>
				ログアウト
			</Button>
		</Stack>
	);
}
