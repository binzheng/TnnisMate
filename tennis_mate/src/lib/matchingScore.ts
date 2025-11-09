export type PlayerProfileLite = {
	userId: string;
	level?: number;
	area?: string | null;
};

export function compatibilityScore(
	self: PlayerProfileLite,
	other: PlayerProfileLite,
): number {
	const levelDiff = Math.abs((self.level ?? 0) - (other.level ?? 0));
	const base = Math.max(0, 100 - levelDiff * 15);
	const areaBonus =
		self.area && other.area && self.area === other.area ? 10 : 0;
	return Math.min(100, base + areaBonus);
}

export function scoreBadgeColor(
	score: number,
): "success" | "warning" | "error" | "default" {
	if (score >= 80) return "success";
	if (score >= 60) return "warning";
	if (score > 0) return "error";
	return "default";
}
