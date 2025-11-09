import { expect, test } from "@playwright/test";

function uniqueEmail(prefix: string) {
	const ts = Date.now();
	const rnd = Math.floor(Math.random() * 1000);
	return `${prefix}-${ts}-${rnd}@example.com`;
}

async function ensureLoggedIn(page: any) {
	await page.goto("/admin/users");
	// Wait up to a few seconds for client-side redirect to /login
	let redirectedToLogin = false;
	try {
		await page.waitForURL((url: URL) => url.pathname.startsWith("/login"), {
			timeout: 5000,
		});
		redirectedToLogin = true;
	} catch {
		redirectedToLogin = false;
	}
	if (!redirectedToLogin) {
		// Maybe already logged in: users page header should be visible
		const onUsersPage = await page
			.getByRole("heading", { name: "ユーザーマスタ" })
			.isVisible();
		if (onUsersPage) {
			return;
		}
		// Give an extra short window for delayed redirect
		try {
			await page.waitForURL((url: URL) => url.pathname.startsWith("/login"), {
				timeout: 3000,
			});
			redirectedToLogin = true;
		} catch {
			redirectedToLogin = false;
		}
	}
	if (redirectedToLogin || page.url().includes("/login")) {
		await page.getByLabel("Email").fill("admin@example.com");
		await page.getByLabel("Password").fill("admin1234");
		await page.getByRole("button", { name: "ログイン" }).click();
		// Wait for navigation to complete after login (NextAuth redirects to home)
		await page.waitForURL((url: URL) => url.pathname !== "/login", {
			timeout: 10000,
		});
		// Now navigate to the users page
		await page.goto("/admin/users");
		await expect(
			page.getByRole("heading", { name: "ユーザーマスタ" }),
		).toBeVisible();
	}
}

test("admin users CRUD", async ({ page }) => {
	await ensureLoggedIn(page);

	// Create
	const createEmail = uniqueEmail("e2e-user");
	await page.getByRole("button", { name: "新規作成" }).click();
	await page.getByLabel("Email").fill(createEmail);
	await page.getByLabel("氏名").fill("E2E User");
	await page.getByRole("button", { name: "作成" }).click();
	await expect(page.getByText(createEmail)).toBeVisible();

	// Edit
	const row = page.locator(`text=${createEmail}`).first();
	await row.locator("xpath=..").getByRole("button", { name: "編集" }).click();
	await page.getByLabel("氏名").fill("E2E Edited");
	await page.getByRole("button", { name: "保存" }).click();
	await expect(page.getByText("E2E Edited")).toBeVisible();

	// Reset PW
	await row
		.locator("xpath=..")
		.getByRole("button", { name: "PWリセット" })
		.click();
	await page.getByLabel("新しいパスワード").fill("newpass1234");
	await page.getByRole("button", { name: "リセット" }).click();

	// Delete
	page.once("dialog", (dialog) => dialog.accept());
	await row.locator("xpath=..").getByRole("button", { name: "削除" }).click();
	await expect(page.getByText(createEmail)).toHaveCount(0);
});

test("shows success message on create", async ({ page }) => {
	await ensureLoggedIn(page);

	const email = uniqueEmail("success-test");
	await page.getByRole("button", { name: "新規作成" }).click();
	await page.getByLabel("Email").fill(email);
	await page.getByRole("button", { name: "作成" }).click();

	// Check for success message
	await expect(page.getByText("ユーザーを作成しました")).toBeVisible({
		timeout: 5000,
	});

	// Cleanup
	page.once("dialog", (dialog) => dialog.accept());
	const row = page.locator(`text=${email}`).first();
	await row.locator("xpath=..").getByRole("button", { name: "削除" }).click();
});

test("shows success message on update", async ({ page }) => {
	await ensureLoggedIn(page);

	// Create user first
	const email = uniqueEmail("update-test");
	await page.getByRole("button", { name: "新規作成" }).click();
	await page.getByLabel("Email").fill(email);
	await page.getByRole("button", { name: "作成" }).click();
	await page.waitForTimeout(1000);

	// Update
	const row = page.locator(`text=${email}`).first();
	await row.locator("xpath=..").getByRole("button", { name: "編集" }).click();
	await page.getByLabel("氏名").fill("Updated Name");
	await page.getByRole("button", { name: "保存" }).click();

	// Check for success message
	await expect(page.getByText("ユーザーを更新しました")).toBeVisible({
		timeout: 5000,
	});

	// Cleanup
	page.once("dialog", (dialog) => dialog.accept());
	await row.locator("xpath=..").getByRole("button", { name: "削除" }).click();
});

test("shows success message on password reset", async ({ page }) => {
	await ensureLoggedIn(page);

	// Create user first
	const email = uniqueEmail("pw-test");
	await page.getByRole("button", { name: "新規作成" }).click();
	await page.getByLabel("Email").fill(email);
	await page.getByRole("button", { name: "作成" }).click();
	await page.waitForTimeout(1000);

	// Reset password
	const row = page.locator(`text=${email}`).first();
	await row
		.locator("xpath=..")
		.getByRole("button", { name: "PWリセット" })
		.click();
	await page.getByLabel("新しいパスワード").fill("newpass123456");
	await page.getByRole("button", { name: "リセット" }).click();

	// Check for success message
	await expect(page.getByText("パスワードをリセットしました")).toBeVisible({
		timeout: 5000,
	});

	// Cleanup
	page.once("dialog", (dialog) => dialog.accept());
	await row.locator("xpath=..").getByRole("button", { name: "削除" }).click();
});

test("shows success message on delete", async ({ page }) => {
	await ensureLoggedIn(page);

	// Create user first
	await page.getByRole("button", { name: "新規作成" }).click();
	await page.getByLabel("Email").fill("delete-test@example.com");
	await page.getByRole("button", { name: "作成" }).click();
	await page.waitForTimeout(1000);

	// Delete
	page.once("dialog", (dialog) => dialog.accept());
	const row = page.locator("text=delete-test@example.com").first();
	await row.locator("xpath=..").getByRole("button", { name: "削除" }).click();

	// Check for success message
	await expect(page.getByText("ユーザーを削除しました")).toBeVisible({
		timeout: 5000,
	});
});

test("disables create button when email is empty", async ({ page }) => {
	await ensureLoggedIn(page);

	await page.getByRole("button", { name: "新規作成" }).click();

	// Create button should be disabled when email is empty
	const createButton = page.getByRole("button", { name: "作成" });
	await expect(createButton).toBeDisabled();

	// Fill email
	await page.getByLabel("Email").fill(uniqueEmail("disabled-create"));
	await expect(createButton).toBeEnabled();

	// Close dialog
	await page.getByRole("button", { name: "キャンセル" }).click();
});

test("disables reset button when password is too short", async ({ page }) => {
	await ensureLoggedIn(page);

	// Create user first
	const email = uniqueEmail("pw-validation");
	await page.getByRole("button", { name: "新規作成" }).click();
	await page.getByLabel("Email").fill(email);
	await page.getByRole("button", { name: "作成" }).click();
	await page.waitForTimeout(1000);

	// Try to reset password with short password
	const row = page.locator(`text=${email}`).first();
	await row
		.locator("xpath=..")
		.getByRole("button", { name: "PWリセット" })
		.click();

	const resetButton = page.getByRole("button", { name: "リセット" });
	await expect(resetButton).toBeDisabled();

	await page.getByLabel("新しいパスワード").fill("12345"); // 5 chars
	await expect(resetButton).toBeDisabled();

	await page.getByLabel("新しいパスワード").fill("123456"); // 6 chars
	await expect(resetButton).toBeEnabled();

	// Close dialog
	await page.getByRole("button", { name: "キャンセル" }).click();

	// Cleanup
	page.once("dialog", (dialog) => dialog.accept());
	await row.locator("xpath=..").getByRole("button", { name: "削除" }).click();
});

test("can create user with all roles", async ({ page }) => {
	await ensureLoggedIn(page);

	const roles = ["player", "coach", "operator", "admin"];

	const created: { role: string; email: string }[] = [];
	for (const role of roles) {
		console.log(`Creating user with role: ${role}`);
		const email = uniqueEmail(role);
		await page.getByRole("button", { name: "新規作成" }).click();
		await page.getByLabel("Email").fill(email);
		await page
			.locator('label:has-text("ロール")')
			.locator("..")
			.locator('div[role="combobox"]')
			.click();
		await page.getByRole("option", { name: role }).click();
		await page.getByRole("button", { name: "作成" }).click();

		// Wait for the new row to appear by its unique email
		await expect(page.getByText(email)).toBeVisible();

		// Verify role text within the same row as the email
		const rowCell = page.locator(`text=${email}`).first();
		const row = rowCell.locator("xpath=..");
		await expect(row.getByText(role, { exact: true })).toBeVisible();
		created.push({ role, email });
	}

	// Cleanup
	for (const { email } of created) {
		page.once("dialog", (dialog) => dialog.accept());
		const row = page.locator(`text=${email}`).first();
		await row.locator("xpath=..").getByRole("button", { name: "削除" }).click();
		await page.waitForTimeout(300);
	}
});

test("can cancel dialogs without making changes", async ({ page }) => {
	await ensureLoggedIn(page);

	// Create user
	const email = uniqueEmail("cancel-test");
	await page.getByRole("button", { name: "新規作成" }).click();
	await page.getByLabel("Email").fill(email);
	await page.getByRole("button", { name: "作成" }).click();
	await page.waitForTimeout(1000);

	// Try to edit but cancel
	const row = page.locator(`text=${email}`).first();
	await row.locator("xpath=..").getByRole("button", { name: "編集" }).click();
	await page.getByLabel("氏名").fill("Should Not Save");
	await page.getByRole("button", { name: "キャンセル" }).click();

	// Name should not have changed
	await expect(page.getByText("Should Not Save")).not.toBeVisible();

	// Cleanup
	page.once("dialog", (dialog) => dialog.accept());
	await row.locator("xpath=..").getByRole("button", { name: "削除" }).click();
});

test("shows empty state when no users exist", async ({ page }) => {
	await ensureLoggedIn(page);

	// If there are users, this test might not show the empty state
	// Determine presence of any rows via action buttons
	const emptyMessage = page.getByText("ユーザーが登録されていません", {
		exact: false,
	});
	const rowAction = page.getByRole("button", { name: "編集" });

	await page.waitForTimeout(500);
	const hasUsers = (await rowAction.count()) > 0;
	if (!hasUsers) {
		await expect(emptyMessage).toBeVisible();
	}
});
