import { test, expect } from "@playwright/test";

test("page loads and the API reports ok", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Quality Gate Demo" })).toBeVisible();
  await expect(page.getByTestId("api-status")).toHaveText("API status: ok");
});

test("check again button keeps the status ok", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("api-status")).toHaveText("API status: ok");
  await page.getByRole("button", { name: "Check again" }).click();
  await expect(page.getByTestId("api-status")).toHaveText("API status: ok");
});

test("backend health endpoint is reachable through nginx", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.ok()).toBeTruthy();
  expect((await res.json()).status).toBe("ok");
});
