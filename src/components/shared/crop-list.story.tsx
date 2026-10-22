import { ThemeProvider } from "@/components/theme-provider";

import type { Crop } from "../../types";

import { CropList } from "./crop-list";

export function Default({ crops }: { crops: Crop[] }) {
  return (
    <ThemeProvider>
      <CropList crops={crops} />
    </ThemeProvider>
  );
}
