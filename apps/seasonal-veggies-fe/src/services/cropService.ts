import { crops } from "./cropsData";

import type { Crop } from "../types";

export async function getAllCrops(): Promise<Crop[]> {
  return crops; // when DB is ready: return fetch("/api/crops").then((r) => r.json());
}
