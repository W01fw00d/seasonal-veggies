import { Injectable } from "@nestjs/common";
import { crops } from "./crops.data";
import type { CropDto } from "./crop.dto";

@Injectable()
export class CropsService {
  getAll(): CropDto[] {
    return crops.map((crop) => ({
      ...crop,
      yearRound: crop.yearRound ?? false,
    }));
  }
}
