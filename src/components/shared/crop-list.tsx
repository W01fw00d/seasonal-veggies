import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";

import type { Crop } from "../../types";

// TODO: component test

export function CropList({ crops }: { crops: Crop[] }) {
  // TODO: fix horizontal margin in mobile screens

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <ItemGroup className="gap-4">
        {crops.map(({ name, seasonTo, seasonFrom }) => (
          <Item
            key={name}
            variant="outline"
            role="listitem"
            render={
              <div>
                <ItemContent>
                  <ItemTitle>{name}</ItemTitle>
                </ItemContent>

                <ItemContent>
                  <ItemDescription>
                    {seasonTo} - <span>{seasonFrom}</span>
                  </ItemDescription>
                </ItemContent>
              </div>
            }
          />
        ))}
      </ItemGroup>
    </div>
  );
}
