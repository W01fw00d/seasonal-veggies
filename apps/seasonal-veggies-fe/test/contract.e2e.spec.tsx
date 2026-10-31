import { expect, test } from "../playwright/coverage-fixtures";

test("renders crops returned by the real backend", async ({ page }) => {
  const cropResponse = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/api/crops" &&
      response.request().method() === "GET",
  );
  await page.goto("/");

  const response = await cropResponse;
  expect(response.ok()).toBe(true);
  await expect(
    page.getByRole("heading", { name: "Seasonal Veggies" }),
  ).toBeVisible();
  await expect(
    page.getByRole("listitem").filter({ hasText: "Ajo" }),
  ).toBeVisible();
});
