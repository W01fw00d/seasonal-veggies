import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { setupSwagger } from "../src/docs/swagger";

describe("Crops API (e2e)", () => {
  let app: INestApplication;

  before(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    setupSwagger(app);
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

  it("publishes an OpenAPI schema for the crop endpoint", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/docs-json")
      .expect(200)
      .expect("Content-Type", /json/);

    assert.match(response.body.openapi, /^3\./);
    assert.deepEqual(
      response.body.paths["/api/crops"].get.responses["200"].content[
        "application/json"
      ].schema,
      {
        type: "array",
        items: { $ref: "#/components/schemas/CropDto" },
      },
    );
    const cropSchema = response.body.components.schemas.CropDto;
    assert.deepEqual(cropSchema.properties.category.enum, ["vegetable", "fruit"]);
    assert.deepEqual(
      cropSchema.properties.seasonFrom.enum,
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    );
    assert.deepEqual(
      {
        type: cropSchema.properties.seasonFrom.type,
        minimum: cropSchema.properties.seasonFrom.minimum,
        maximum: cropSchema.properties.seasonFrom.maximum,
      },
      {
        type: "integer",
        minimum: 0,
        maximum: 11,
      },
    );
  });
});
