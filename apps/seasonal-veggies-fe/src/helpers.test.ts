import { describe, expect, it } from "vitest";

import { capitalize, getMonthLabel } from "./helpers.ts";

describe("getMonthLabel", () => {
  it("returns the Spanish month name by default", () => {
    expect(getMonthLabel(0)).toBe("enero");
  });

  it("uses the requested locale", () => {
    expect(getMonthLabel(0, "en-US")).toBe("January");
  });
});

describe("capitalize", () => {
  it("capitalizes the first character", () => {
    expect(capitalize("enero")).toBe("Enero");
  });

  it("returns an empty string unchanged", () => {
    expect(capitalize("")).toBe("");
  });
});
