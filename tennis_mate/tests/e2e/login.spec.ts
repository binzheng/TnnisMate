import { test, expect } from '@playwright/test';

test('login with demo user', async ({ page, baseURL }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('demo@example.com');
  await page.getByLabel('Password').fill('demo1234');
  await page.getByRole('button', { name: 'ログイン' }).click();

  // Wait for navigation to complete after login
  await page.waitForURL((url) => url.pathname !== '/login', { timeout: 10000 });

  // After login, expect header to show logout button
  await expect(page.getByRole('button', { name: 'ログアウト' })).toBeVisible();
});

