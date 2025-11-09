"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import AppFrame from "@/components/layout/AppFrame";
import { appTheme } from "@/lib/theme";
import { TRPCReactProvider } from "@/trpc/react";

export default function ClientProviders({ children }: { children: ReactNode }) {
	// Always render consistent providers to avoid hydration mismatches
	return (
		<SessionProvider>
			<TRPCReactProvider>
				<ThemeProvider theme={appTheme}>
					<CssBaseline />
					<AppFrame>{children}</AppFrame>
				</ThemeProvider>
			</TRPCReactProvider>
		</SessionProvider>
	);
}
