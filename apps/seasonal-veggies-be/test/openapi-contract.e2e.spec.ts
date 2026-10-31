import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { after, before, describe, it } from "node:test";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import Ajv from "ajv";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { createOpenApiDocument, setupSwagger } from "../src/docs/swagger";

type CropResponse = {
  name: string;
  category: "vegetable" | "fruit";
  seasonFrom: number;
  seasonTo: number;
  yearRound?: boolean;
};

describe("OpenAPI contract (e2e)", () => {
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

  it("validates crop responses against the published OpenAPI schema", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/crops")
      .expect(200)
      .expect("Content-Type", /json/);

    const document = createOpenApiDocument(app);
    const cropsPath = document.paths["/api/crops"];
    assert.ok(cropsPath);
    const getCrops = cropsPath.get;
    assert.ok(getCrops);
    const successResponse = getCrops.responses["200"];
    assert.ok(successResponse && "content" in successResponse);
    const jsonContent = successResponse.content?.["application/json"];
    assert.ok(jsonContent);
    const responseSchema = jsonContent.schema;
    assert.ok(responseSchema && "items" in responseSchema);
    const itemSchema = responseSchema.items;
    assert.ok(itemSchema && "$ref" in itemSchema);
    const schemaName = itemSchema.$ref.split("/").at(-1);
    assert.ok(schemaName);
    const schemas = document.components?.schemas;
    assert.ok(schemas);
    const cropSchema = schemas[schemaName];
    assert.ok(cropSchema && !("$ref" in cropSchema));
    const validate = new Ajv({ strict: false }).compile<CropResponse[]>({
      ...responseSchema,
      items: cropSchema,
    });

    const body: unknown = response.body;
    if (!validate(body)) {
      assert.fail(
        `Response does not conform to OpenAPI: ${JSON.stringify(validate.errors)}`,
      );
    }
    assert.ok(body.length > 0);
    const cropWithoutYearRound = { ...body[0] };
    delete cropWithoutYearRound.yearRound;
    assert.ok(
      validate([cropWithoutYearRound]),
      `The optional yearRound field must be omittable: ${JSON.stringify(validate.errors)}`,
    );
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
    assert.deepEqual(cropSchema.properties.category.enum, [
      "vegetable",
      "fruit",
    ]);
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
    assert.ok(!cropSchema.required.includes("yearRound"));
    assert.equal(cropSchema.properties.yearRound.default, undefined);
  });

  it("keeps the checked-in OpenAPI document in sync with the live API", async () => {
    const checkedInDocument = JSON.parse(
      await readFile(resolve(__dirname, "../openapi.json"), "utf8"),
    );

    assert.deepEqual(checkedInDocument, createOpenApiDocument(app));
  });
});
