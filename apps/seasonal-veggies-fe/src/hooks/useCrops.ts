import { useQuery } from "@tanstack/react-query";

import { getAllCrops } from "../services/cropService";

export function useCrops() {
  return useQuery({
    queryKey: ["crops"],
    queryFn: getAllCrops,
    retry: false,
  });
}
