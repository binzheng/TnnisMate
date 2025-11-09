import { describe, expect, it, vi } from "vitest";
import { audit } from "@/lib/logger";

describe("audit logger", () => {
	it("prints structured JSON without throwing", () => {
		const spy = vi.spyOn(console, "log").mockImplementation(() => {});
		audit({
			level: "info",
			msg: "test",
			userId: "u1",
			role: "player",
			resource: "x",
			requestId: "req1",
			meta: { a: 1 },
		});
		expect(spy).toHaveBeenCalledTimes(1);
		const arg = spy.mock.calls[0]?.[0] as string;
		const parsed = JSON.parse(arg);
		expect(parsed.level).toBe("info");
		expect(parsed.msg).toBe("test");
		expect(parsed.userId).toBe("u1");
		expect(parsed.requestId).toBe("req1");
		spy.mockRestore();
	});
});
