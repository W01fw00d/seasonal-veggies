import { expect, test } from "../playwright/coverage-fixtures";

async function mockCropService(
  page: import("@playwright/test").Page,
  implementation: string,
) {
  await page.route("**/src/services/cropService.ts*", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: `export async function getAllCrops() { ${implementation} }`,
    }),
  );
}

test("shows a loading state while the crop request is pending", async ({
  page,
}) => {
  await mockCropService(page, "return new Promise(() => {});");
  await page.goto("/");

  await expect(page.getByText("Cargando...")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Seasonal Veggies" }),
  ).toHaveCount(0);
});

test("renders crops after the request succeeds", async ({ page }) => {
  await mockCropService(
    page,
    `return [
      { name: "garlic", category: "vegetable", seasonFrom: 0, seasonTo: 11, yearRound: true },
      { name: "chard", category: "vegetable", seasonFrom: 7, seasonTo: 4, yearRound: false }
    ];`,
  );
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Seasonal Veggies" }),
  ).toBeVisible();
  await expect(page.getByRole("listitem")).toHaveCount(2);
  await expect(page.getByRole("listitem").filter({ hasText: "Ajo" })).toContainText(
    "Todo el año",
  );
  await expect(
    page.getByRole("listitem").filter({ hasText: "Acelga" }),
  ).toContainText("Agosto - Mayo");
  await expect(page.getByText("Cargando...")).toHaveCount(0);
});

test("renders an empty crop list when the request succeeds without results", async ({
  page,
}) => {
  await mockCropService(page, "return [];");
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Seasonal Veggies" }),
  ).toBeVisible();
  await expect(page.getByRole("listitem")).toHaveCount(0);
  await expect(page.getByText("Cargando...")).toHaveCount(0);
});

test("shows an error when the crop request is rejected", async ({ page }) => {
  await mockCropService(page, 'throw new Error("Crop request failed");');
  await page.goto("/");

  await expect(page.getByText("No se pudo cargar la lista.")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Seasonal Veggies" }),
  ).toHaveCount(0);
  await expect(page.getByText("Cargando...")).toHaveCount(0);
});
