import type { CropDto } from "./api";

export type Crop = CropDto;
export type Month = Crop["seasonFrom"]; // 0-indexed as Js Date#getMonth()
export type CropCategory = Crop["category"];
