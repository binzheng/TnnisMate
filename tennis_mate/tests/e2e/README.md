E2E tests (Playwright)

Prerequisites
- Node.js installed
- App running locally at http://localhost:3000
- A working database with schema applied and seed executed (demo user: demo@example.com / demo1234)

Install Playwright (one-time)
- npm i -D @playwright/test
- npx playwright install

Run E2E
- npm run test:e2e

Environment
- BASE_URL (optional): override base URL (default http://localhost:3000)

Notes
- Tests assume first run creates/edits/deletes an admin-created user in /admin/users.
- If middleware protects routes, the tests will log in first via the /login form.

