import { AssistDate } from "src/newtab/scripts/utils/search/search-assist-utils";

export const handleDate = (val: string) => {
  if (val.trim().toLowerCase() === "date") {
    return { type: "date" } satisfies AssistDate;
  }
};
