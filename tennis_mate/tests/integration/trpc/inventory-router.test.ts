import { describe, expect, it } from "vitest";
import { createCaller } from "@/server/api/root";

function ctx(db: any) {
	return {
		db,
		session: { user: { id: "u1" } },
		requestId: "req",
		headers: new Headers(),
	} as any;
}

describe("tRPC inventory", () => {
	it("startCsvImport updates job and listJobs returns entry", async () => {
		const store: any[] = [];
		const db = {
			importJob: {
				create: async ({ data }: any) => {
					const row = {
						id: `j${store.length + 1}`,
						...data,
						createdAt: new Date(0),
					};
					store.push(row);
					return row;
				},
				update: async ({ where, data }: any) => {
					const i = store.findIndex((j) => j.id === where.id);
					store[i] = { ...store[i], ...data };
					return store[i];
				},
				findMany: async () => store.slice(),
			},
		};
		const caller = createCaller(ctx(db));
		const finished = await caller.inventory.startCsvImport({
			rows: [{ a: "1" }],
		});
		expect(finished.status).toBe("success");
		const jobs = await caller.inventory.listJobs();
		expect(jobs.length).toBe(1);
	});
});
