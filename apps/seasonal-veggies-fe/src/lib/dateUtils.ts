import type { Month } from "../types.ts";

export const getMonthLabel = (month: Month, locale = "es-ES") =>
  new Intl.DateTimeFormat(locale, { month: "long" }).format(
    new Date(2000, month, 1),
  );
