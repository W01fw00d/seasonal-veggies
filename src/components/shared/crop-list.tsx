import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";

import type { Crop } from "../../types";

import { CROPS_LABELS } from "../../labels.ts";
import { getMonthLabel, capitalize } from "../../helpers.ts";

const LABELS = {
  yearRound: "Todo el año",
  crop: "Cultivo",
};

type CropName = keyof typeof CROPS_LABELS;

// TODO: component test
export function CropList({ crops }: { crops: Crop[] }) {
  return (
    <div className="flex w-full max-w-md flex-col gap-6 mb-4">
      <ItemGroup className="gap-4">
        {crops.map(({ name, seasonTo, seasonFrom, yearRound }) => (
          <Item
            key={name}
            variant="outline"
            role="listitem"
            render={
              <div>
                <ItemContent>
                  <ItemTitle>
                    {capitalize(CROPS_LABELS[name as CropName] || LABELS.crop)}
                  </ItemTitle>
                </ItemContent>

                <ItemContent>
                  {yearRound ? (
                    <ItemTitle>{LABELS.yearRound}</ItemTitle>
                  ) : (
                    <ItemDescription>
                      {capitalize(getMonthLabel(seasonFrom))} -{" "}
                      <span>{capitalize(getMonthLabel(seasonTo))}</span>
                    </ItemDescription>
                  )}
                </ItemContent>
              </div>
            }
          />
        ))}
      </ItemGroup>
    </div>
  );
}
