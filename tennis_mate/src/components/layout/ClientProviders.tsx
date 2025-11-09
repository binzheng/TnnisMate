"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { appTheme } from "@/lib/theme";
import { TRPCReactProvider } from "@/trpc/react";
import AppFrame from "@/components/layout/AppFrame";

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
