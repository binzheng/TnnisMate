"use client";

import Link from "next/link";
import { Button, Stack, Typography } from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const router = useRouter();
  const { data: session } = useSession();
  if (!session?.user) {
    return (
      <Button color="inherit" size="small" component={Link} href="/login">
        ログイン
      </Button>
    );
  }
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="body2" sx={{ display: { xs: "none", sm: "inline" } }}>
        {session.user.name ?? session.user.email ?? "ユーザー"}
      </Typography>
      <Button
        color="inherit"
        size="small"
        onClick={async () => {
          // Sign out without auto-redirect, then navigate explicitly
          await signOut({ redirect: false });
          router.replace("/login");
        }}
      >
        ログアウト
      </Button>
    </Stack>
  );
}
