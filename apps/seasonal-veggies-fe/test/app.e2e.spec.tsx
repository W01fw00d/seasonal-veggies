import { expect, test } from "../playwright/coverage-fixtures";

async function mockCropService(
  page: import("@playwright/test").Page,
  response: { status?: number; body?: unknown; delay?: number },
) {
  await page.route("**/api/crops", async (route) => {
    if (response.delay) {
      await new Promise((resolve) => setTimeout(resolve, response.delay));
    }
    await route.fulfill({
      status: response.status ?? 200,
      contentType: "application/json",
      body: JSON.stringify(response.body ?? []),
    });
  });
}

test("shows a loading state while the crop request is pending", async ({
  page,
}) => {
  await mockCropService(page, { delay: 60_000 });
  await page.goto("/");

  await expect(page.getByText("Cargando...")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Seasonal Veggies" }),
  ).toHaveCount(0);
});

test("renders crops after the request succeeds", async ({ page }) => {
  let cropRequestCount = 0;
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/api/crops") {
      cropRequestCount += 1;
    }
  });
  await mockCropService(page, {
    body: [
      { name: "garlic", category: "vegetable", seasonFrom: 0, seasonTo: 11, yearRound: true },
      { name: "chard", category: "vegetable", seasonFrom: 7, seasonTo: 4, yearRound: false },
    ],
  });
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
  expect(cropRequestCount).toBe(1);
});

test("renders an empty crop list when the request succeeds without results", async ({
  page,
}) => {
  await mockCropService(page, { body: [] });
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Seasonal Veggies" }),
  ).toBeVisible();
  await expect(page.getByRole("listitem")).toHaveCount(0);
  await expect(page.getByText("Cargando...")).toHaveCount(0);
});

test("shows an error when the crop request is rejected", async ({ page }) => {
  await mockCropService(page, { status: 500, body: { message: "Internal server error" } });
  await page.goto("/");

  await expect(page.getByText("No se pudo cargar la lista.")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Seasonal Veggies" }),
  ).toHaveCount(0);
  await expect(page.getByText("Cargando...")).toHaveCount(0);
});
