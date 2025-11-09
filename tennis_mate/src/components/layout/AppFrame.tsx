"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppSideNav } from "@/components/layout/AppSideNav";

export default function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const withoutChrome = pathname === "/login" || pathname.startsWith("/_not-found");
  if (withoutChrome) return <>{children}</>;
  return <AppSideNav>{children}</AppSideNav>;
}
