export type Month = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11; // 0-indexed as Js Date#getMonth()

type CropCategory = "vegetable" | "fruit";

export type Crop = {
  name: string;
  category: CropCategory;
  seasonFrom: Month;
  seasonTo: Month;
  yearRound: boolean;
};
