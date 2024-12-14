export const handleDate = (val: string) => {
  if (val === "date") {
    return { type: "date" } as const;
  }
};
