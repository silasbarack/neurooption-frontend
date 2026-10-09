import { expect, test, type Page, type Route } from "@playwright/test";

const token = "synthetic-session-token";
const phrase = "DELETE";
const reference = "DEL-12345678-1234-1234-1234-123456789ABC";
const check = {
  canDelete: true, blockers: [], confirmationWord: phrase, emailHint: "t***@example.test",
  reasons: [
    { code: "NOT_TRADING", label: "I'm no longer trading" },
    { code: "OTHER", label: "Another reason" },
  ],
};
const success = {
  success: true, message: "Your account has been deleted.", reference,
  emailSent: false, emailDelivery: "queued", emailHint: "t***@example.test",
  deletedAt: "2026-10-09T12:00:00.000Z",
};

async function json(route: Route, body: unknown, status = 200) {
  await route.fulfill({ status, contentType: "application/json", headers: {
    "Access-Control-Allow-Origin": "*",
  }, body: JSON.stringify(body) });
}

async function mockApi(page: Page, onDelete?: (route: Route) => Promise<void>) {
  await page.route("http://127.0.0.1:4199/**", async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: {
        "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "*", "Access-Control-Allow-Headers": "*",
      } });
      return;
    }
    const path = new URL(route.request().url()).pathname;
    if (path === "/account/deletion") return json(route, check);
    if (path === "/account/delete") return onDelete ? onDelete(route) : json(route, success, 201);
    if (path === "/auth/reset-password") return json(route, { success: true, emailDelivery: "queued" });
    return json(route, { message: "Synthetic test endpoint unavailable" }, 503);
  });
}

async function signIn(page: Page, temporary = false) {
  await page.addInitScript(({ token: value, temporary: session }) => {
    const storage = session ? sessionStorage : localStorage;
    storage.setItem("neurooption_token", value);
    storage.setItem("neurooption_user", JSON.stringify({ id: "fixture-user", fullName: "Test Trader", email: "trader@example.test", role: "USER" }));
    // Old token aliases must also be removed on successful closure/reset.
    localStorage.setItem("token", "old-token");
    sessionStorage.setItem("accessToken", "old-access-token");
  }, { token, temporary });
}

async function confirmStep(page: Page) {
  await page.goto("/delete-account");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Skip and continue", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Confirm deletion", exact: true })).toBeVisible();
}

async function fillConfirmation(page: Page) {
  await page.getByLabel("Type DELETE to confirm", { exact: true }).fill(phrase);
  await page.getByLabel("Your password", { exact: true }).fill("synthetic-current-password");
}

async function expectCleared(page: Page) {
  const remaining = await page.evaluate(() => ["neurooption_token", "neurooption_user", "token", "accessToken"]
    .flatMap((key) => [localStorage.getItem(key), sessionStorage.getItem(key)]));
  expect(remaining.every((value) => value === null)).toBe(true);
}

test("requires the exact word and a current password", async ({ page }) => {
  await mockApi(page); await signIn(page); await confirmStep(page);
  const submit = page.getByRole("button", { name: "Permanently delete my account", exact: true });
  await expect(submit).toBeDisabled();
  await page.getByLabel("Your password", { exact: true }).fill("synthetic-current-password");
  await page.getByLabel("Type DELETE to confirm", { exact: true }).fill("delete");
  await expect(submit).toBeDisabled();
  await page.getByLabel("Type DELETE to confirm", { exact: true }).fill(" DELETE ");
  await expect(submit).toBeDisabled();
  await page.getByLabel("Type DELETE to confirm", { exact: true }).fill(phrase);
  await expect(submit).toBeEnabled();
});

test("closes a temporary session with its selected reason and shows a queued receipt", async ({ page }) => {
  const requests: Array<{ headers: Record<string, string>; body: unknown }> = [];
  await mockApi(page, async (route) => {
    requests.push({ headers: route.request().headers(), body: route.request().postDataJSON() });
    await json(route, success, 201);
  });
  await signIn(page, true);
  await page.goto("/delete-account");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Another reason", { exact: true }).check();
  await page.getByLabel("Anything you'd like to add? (optional)", { exact: true }).fill("  I need a break.  ");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await fillConfirmation(page);
  await page.getByRole("button", { name: "Permanently delete my account", exact: true }).click();
  await expect(page).toHaveURL(/\/account-deleted$/);
  await expect(page.getByRole("heading", { name: "Your account has been deleted", exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Your confirmation email is queued");
  await expect(page.getByText(reference, { exact: true })).toBeVisible();
  expect(requests).toHaveLength(1);
  expect(requests[0].headers.authorization).toBe("Bearer " + token);
  expect(requests[0].body).toEqual({
    password: "synthetic-current-password", confirmation: phrase, reason: "OTHER", comment: "I need a break.",
  });
  await expectCleared(page);
});

test("keeps the session and shows fresh blockers when closure is refused", async ({ page }) => {
  await mockApi(page, (route) => json(route, {
    code: "ACCOUNT_DELETION_BLOCKED", message: "This account cannot be deleted yet.",
    blockers: [{ code: "FUNDS", message: "Withdraw your remaining funds.", action: { label: "Withdraw funds", path: "/finance?tab=withdraw" } }],
  }, 409));
  await signIn(page); await confirmStep(page); await fillConfirmation(page);
  await page.getByRole("button", { name: "Permanently delete my account", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Sort these out first", exact: true })).toBeVisible();
  await expect(page.getByText("Withdraw your remaining funds.", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("neurooption_token"))).toBe(token);
});

test("keeping the account does not submit deletion", async ({ page }) => {
  let deletions = 0;
  await mockApi(page, async (route) => { deletions++; await json(route, success); });
  await signIn(page);
  await page.goto("/delete-account");
  await page.getByRole("link", { name: "Keep my account", exact: true }).click();
  await expect(page).toHaveURL(/\/profile$/);
  expect(deletions).toBe(0);
  expect(await page.evaluate(() => localStorage.getItem("neurooption_token"))).toBe(token);
});

test("all steps and the long-reference receipt fit the viewport", async ({ page }) => {
  await mockApi(page); await signIn(page); await page.goto("/delete-account");
  async function fits() {
    const width = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth }));
    expect(width.content).toBeLessThanOrEqual(width.viewport + 1);
  }
  await expect(page.getByRole("heading", { name: "Delete your NeuroOption account", exact: true })).toBeVisible();
  await fits();
  await page.getByRole("button", { name: "Continue", exact: true }).click(); await fits();
  await page.getByRole("button", { name: "Skip and continue", exact: true }).click(); await fits();
  await fillConfirmation(page);
  await page.getByRole("button", { name: "Permanently delete my account", exact: true }).click();
  await expect(page).toHaveURL(/\/account-deleted$/); await fits();
});

test("Support remains public and offers the monitored email after closure", async ({ page }) => {
  await mockApi(page); await page.goto("/help");
  await expect(page.getByRole("heading", { name: "Help Center", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Email Support", exact: true })).toHaveAttribute("href", "mailto:support@example.test");
  await expect(page.getByRole("heading", { name: "Support after account deletion", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign in", exact: true })).toBeVisible();
});

test("a successful password reset clears prior sessions before sign-in", async ({ page }) => {
  await mockApi(page); await signIn(page, true);
  await page.goto("/reset-password?email=trader@example.test");
  await page.getByLabel("Verification code", { exact: true }).fill("123456");
  await page.getByLabel("New password", { exact: true }).fill("synthetic-new-password");
  await page.getByLabel("Confirm new password", { exact: true }).fill("synthetic-new-password");
  await page.getByRole("button", { name: "Reset password", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expectCleared(page);
});
