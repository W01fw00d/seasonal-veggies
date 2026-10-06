import type { Month } from "./types.ts";

// TODO: unit test
export const getMonthLabel = (month: Month, locale = "es-ES") =>
  new Intl.DateTimeFormat(locale, { month: "long" }).format(
    new Date(2000, month, 1),
  );

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
