"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AppSideNav } from "@/components/layout/AppSideNav";

export default function AppFrame({ children }: { children: ReactNode }) {
	const pathname = usePathname() || "/";
	const withoutChrome =
		pathname === "/login" || pathname.startsWith("/_not-found");
	if (withoutChrome) return <>{children}</>;
	return <AppSideNav>{children}</AppSideNav>;
}
