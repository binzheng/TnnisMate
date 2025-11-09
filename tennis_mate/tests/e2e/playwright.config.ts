import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export default defineConfig({
	testDir: "./tests/e2e",
	testMatch: /.*\.spec\.(ts|js)/,
	timeout: 30_000,
	globalTeardown: "./tests/e2e/global.teardown.ts",
	use: {
		baseURL: BASE_URL,
		trace: "retain-on-failure",
		screenshot: "on",
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
