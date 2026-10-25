import { Controller, Get, Module } from "@nestjs/common";

@Controller("api/health")
class HealthController {
  @Get()
  getHealth() {
    return { status: "ok" };
  }
}

@Module({
  controllers: [HealthController],
})
export class AppModule {}
