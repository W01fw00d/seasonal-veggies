import { describe, expect, it } from "vitest";

import { getMonthLabel } from "./dateUtils";

describe("getMonthLabel", () => {
  it("returns the Spanish month name by default", () => {
    expect(getMonthLabel(0)).toBe("enero");
  });

  it("uses the requested locale", () => {
    expect(getMonthLabel(0, "en-US")).toBe("January");
  });
});
