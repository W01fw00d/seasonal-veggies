import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { createOpenApiDocument } from "../src/docs/swagger";

async function generateOpenApi(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false });
  try {
    const document = createOpenApiDocument(app);
    const outputPath = resolve(__dirname, "../openapi.json");
    const generated = `${JSON.stringify(document, null, 2)}\n`;
    if (process.argv.includes("--check")) {
      const checkedIn = await readFile(outputPath, "utf8");
      if (checkedIn !== generated) {
        throw new Error(
          "openapi.json is out of date. Run npm run generate:api and commit the updated contract.",
        );
      }
      console.log("OpenAPI document is up to date.");
    } else {
      await writeFile(outputPath, generated);
      console.log(`Generated ${outputPath}`);
    }
  } finally {
    await app.close();
  }
}

void generateOpenApi();
