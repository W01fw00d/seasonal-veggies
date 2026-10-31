import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/app.module";

describe("Health API (e2e)", () => {
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

  it("returns an ok status", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/health")
      .expect(200)
      .expect("Content-Type", /json/);

    assert.deepEqual(response.body, { status: "ok" });
  });
});
