import { expect, test } from "@playwright/test";

import type { Default } from "./page-container.story";

test("renders children", async ({ mount }) => {
  const component = await mount<typeof Default>(
    "components/shared/page-container/Default",
  );
  const container = component.getByTestId("page-container");

  await expect(container).toHaveText("Page content");
});
