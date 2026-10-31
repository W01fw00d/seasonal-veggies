import { ApiProperty } from "@nestjs/swagger";

export const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const; // 0-indexed as Js Date#getMonth()
export type Month = (typeof MONTHS)[number];

export class CropDto {
  @ApiProperty({ type: String, example: "chard" })
  name!: string;

  @ApiProperty({
    type: String,
    enum: ["vegetable", "fruit"],
    example: "vegetable",
  })
  category!: "vegetable" | "fruit";

  @ApiProperty({
    type: "integer",
    enum: MONTHS,
    minimum: 0,
    maximum: 11,
    example: 7,
  })
  seasonFrom!: Month;

  @ApiProperty({
    type: "integer",
    enum: MONTHS,
    minimum: 0,
    maximum: 11,
    example: 4,
  })
  seasonTo!: Month;

  @ApiProperty({ type: Boolean, example: false })
  yearRound!: boolean;
}
