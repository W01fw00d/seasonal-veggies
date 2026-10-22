import { expect, test } from "@playwright/test";

import type { Crop } from "../../src/types";
import type { Default } from "../../src/components/shared/crop-list.story";

test("renders crop labels and their seasons", async ({ mount }) => {
  const crops: Crop[] = [
    {
      name: "garlic",
      category: "vegetable",
      seasonFrom: 0,
      seasonTo: 11,
      yearRound: true,
    },
    {
      name: "chard",
      category: "vegetable",
      seasonFrom: 7,
      seasonTo: 4,
      yearRound: false,
    },
    {
      name: "unknown",
      category: "vegetable",
      seasonFrom: 0,
      seasonTo: 0,
      yearRound: false,
    },
  ];

  const component = await mount<typeof Default>(
    "components/shared/crop-list/Default",
    { crops },
  );
  const items = component.getByRole("listitem");

  await expect(items).toHaveCount(3);
  await expect(items.filter({ hasText: "Ajo" })).toContainText("Todo el año");
  await expect(items.filter({ hasText: "Acelga" })).toContainText(
    "Agosto - Mayo",
  );
  await expect(items.filter({ hasText: "Cultivo desconocido" })).toHaveCount(1);
});

test("renders an empty list when there are no crops", async ({ mount }) => {
  const component = await mount<typeof Default>(
    "components/shared/crop-list/Default",
    { crops: [] },
  );

  await expect(component.getByRole("listitem")).toHaveCount(0);
});
