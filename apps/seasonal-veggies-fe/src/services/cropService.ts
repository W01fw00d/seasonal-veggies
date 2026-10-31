import type { Crop } from "../types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export async function getAllCrops(): Promise<Crop[]> {
  const response = await fetch(`${apiBaseUrl}/api/crops`);
  if (!response.ok) {
    throw new Error(`Failed to load crops: ${response.status}`);
  }

  return response.json() as Promise<Crop[]>;
}
