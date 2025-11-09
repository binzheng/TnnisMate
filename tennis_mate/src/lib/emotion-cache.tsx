"use client";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import * as React from "react";

/**
 * Emotion Cache provider compatible with Next.js App Router.
 * Ensures SSR-inserted Emotion styles match the client to avoid hydration mismatches.
 */
export default function EmotionCacheProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [cache] = React.useState(() => {
		const cache = createCache({ key: "mui", prepend: true });
		cache.compat = true;

		const prevInsert = cache.insert;
		let inserted: string[] = [];
		cache.insert = (...args: any[]) => {
			const serialized = args[1];
			if (!cache.inserted[serialized.name]) {
				inserted.push(serialized.name);
			}
			return prevInsert(...(args as any));
		};
		(cache as any).flush = () => {
			const prev = inserted;
			inserted = [];
			return prev;
		};
		return cache;
	});

	useServerInsertedHTML(() => {
		const names = (cache as any).flush();
		if (!names || names.length === 0) return null;
		let styles = "";
		for (const name of names) {
			styles += (cache.inserted as any)[name];
		}
		return (
			<style
				dangerouslySetInnerHTML={{ __html: styles }}
				data-emotion={`${cache.key} ${names.join(" ")}`}
			/>
		);
	});

	return <CacheProvider value={cache}>{children}</CacheProvider>;
}
