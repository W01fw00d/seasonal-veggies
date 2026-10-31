import { Module } from "@nestjs/common";
import { CropsModule } from "./crops/crops.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [CropsModule, HealthModule],
})
export class AppModule {}
