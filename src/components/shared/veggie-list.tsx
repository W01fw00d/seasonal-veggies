import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";

// TODO: Create a type for veggie

// TODO: component test

const veggies = [
  // TODO: Move to App file, make this a generic component without data

  // Lang: Spanish
  {
    name: "Aguacate",
    seasonFrom: "Noviembre",
    seasonTo: "Mayo",
  },
  {
    name: "Aguacate 2",
    seasonFrom: "Noviembre",
    seasonTo: "Mayo",
  },
  {
    name: "Aguacate 3",
    seasonFrom: "Noviembre",
    seasonTo: "Mayo",
  },
];

export function VeggieList() {
  // TODO: fix horizontal margin in mobile screens

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <ItemGroup className="gap-4">
        {veggies.map((veggie) => (
          <Item
            key={veggie.name}
            variant="outline"
            role="listitem"
            render={
              <div>
                <ItemContent>
                  <ItemTitle>{veggie.name}</ItemTitle>
                </ItemContent>

                <ItemContent>
                  <ItemDescription>
                    {veggie.seasonTo} - <span>{veggie.seasonFrom}</span>
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
