import type { Crop } from "../types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

let cropsRequest: Promise<Crop[]> | undefined;

export function getAllCrops(): Promise<Crop[]> {
  if (!cropsRequest) {
    // Avoid duplicated requests on loading page
    cropsRequest = fetch(`${apiBaseUrl}/api/crops`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load crops: ${response.status}`);
        }

        return response.json() as Promise<Crop[]>;
      })
      .finally(() => {
        cropsRequest = undefined;
      });
  }

  return cropsRequest;
}
