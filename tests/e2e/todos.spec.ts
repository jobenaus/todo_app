import { expect, test } from "@playwright/test";

test("can create, complete, and delete a todo", async ({ page }) => {
  await page.goto("/");

  const title = `Once task ${Date.now()}`;
  await page.getByPlaceholder("What needs to be done?").fill(title);
  await page.getByRole("button", { name: "Add" }).click();

  await expect(page.getByText(title)).toBeVisible();

  const item = page.locator(".todo-item", { hasText: title });
  await item.locator('input[type="checkbox"]').check();
  await expect(item).toHaveClass(/done/);

  await item.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText(title)).toHaveCount(0);
});

test("health endpoint returns success", async ({ request }) => {
  const response = await request.get("/up");
  expect(response.ok()).toBeTruthy();
});
