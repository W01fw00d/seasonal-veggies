import { describe, expect, it } from "vitest";

import { capitalize } from "./stringUtils";

describe("capitalize", () => {
  it("capitalizes the first character", () => {
    expect(capitalize("enero")).toBe("Enero");
  });

  it("returns an empty string unchanged", () => {
    expect(capitalize("")).toBe("");
  });
});
