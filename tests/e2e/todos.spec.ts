import { expect, test } from "@playwright/test";

test("can create, complete, and delete a todo", async ({ page }) => {
  await page.goto("/");

  const title = `Once task ${Date.now()}`;
  await page.getByPlaceholder("What needs to be done?").fill(title);
  await page.getByRole("button", { name: "Add" }).click();

  await expect(page.getByText(title)).toBeVisible();

  const updatedTitle = `${title} updated`;
  const item = page.locator(".todo-item", { hasText: title });
  await item.getByRole("link", { name: "Edit" }).click();
  const editForm = page.locator(".todo-item .edit-form");
  await editForm.getByRole("textbox").fill(updatedTitle);
  await editForm.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText(updatedTitle)).toBeVisible();
  await expect(page.getByText(title, { exact: true })).toHaveCount(0);

  const updatedItem = page.locator(".todo-item", { hasText: updatedTitle });
  await updatedItem.locator('input[type="checkbox"]').check();
  await expect(updatedItem).toHaveClass(/done/);

  await updatedItem.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText(updatedTitle)).toHaveCount(0);
});

test("health endpoint returns success", async ({ request }) => {
  const response = await request.get("/up");
  expect(response.ok()).toBeTruthy();
});
