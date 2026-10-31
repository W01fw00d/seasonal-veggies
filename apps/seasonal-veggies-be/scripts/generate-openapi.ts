import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { createOpenApiDocument } from "../src/docs/swagger";

async function generateOpenApi(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false });
  try {
    const document = createOpenApiDocument(app);
    const outputPath = resolve(__dirname, "../openapi.json");
    await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`);
    console.log(`Generated ${outputPath}`);
  } finally {
    await app.close();
  }
}

void generateOpenApi();
