import { Controller, Get, Inject } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CropDto } from "./crop.dto";
import { CropsService } from "./crops.service";

@ApiTags("crops")
@Controller("api/crops")
export class CropsController {
  constructor(
    @Inject(CropsService) private readonly cropsService: CropsService,
  ) {}

  @Get()
  @ApiOperation({ summary: "List all crops and their seasons" })
  @ApiOkResponse({ description: "The crop list", type: CropDto, isArray: true })
  getAll(): CropDto[] {
    return this.cropsService.getAll();
  }
}
