import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/app.module";

describe("Crops API (e2e)", () => {
  let app: INestApplication;

  before(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  after(async () => {
    await app.close();
  });

  it("returns all crops with the expected response shape", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/crops")
      .expect(200)
      .expect("Content-Type", /json/);

    assert.ok(Array.isArray(response.body));
    assert.ok(response.body.length > 0);
    assert.deepEqual(
      response.body.find((crop: { name: string }) => crop.name === "garlic"),
      {
        name: "garlic",
        category: "vegetable",
        seasonFrom: 0,
        seasonTo: 11,
        yearRound: true,
      },
    );
    for (const crop of response.body) {
      assert.deepEqual(Object.keys(crop).sort(), [
        "category",
        "name",
        "seasonFrom",
        "seasonTo",
        "yearRound",
      ]);
      assert.equal(typeof crop.name, "string");
      assert.ok(["vegetable", "fruit"].includes(crop.category));
      assert.ok(
        Number.isInteger(crop.seasonFrom) &&
          crop.seasonFrom >= 0 &&
          crop.seasonFrom <= 11,
      );
      assert.ok(
        Number.isInteger(crop.seasonTo) &&
          crop.seasonTo >= 0 &&
          crop.seasonTo <= 11,
      );
      assert.equal(typeof crop.yearRound, "boolean");
    }
  });
});
