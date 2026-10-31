import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { setupSwagger } from "./docs/swagger";

async function bootstrap() {
  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT value: ${process.env.PORT}`);
  }

  const app = await NestFactory.create(AppModule);
  const allowedOrigins = process.env.CORS_ORIGIN?.split(",").map((origin) =>
    origin.trim(),
  );
  if (allowedOrigins) {
    app.enableCors({ origin: allowedOrigins });
  }
  setupSwagger(app);
  await app.listen(port, "0.0.0.0");
}

void bootstrap();
