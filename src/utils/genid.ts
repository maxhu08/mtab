import { v4 as uuidv4 } from "uuid";

export const genid = () => {
  return uuidv4().replace(/-/g, "");
};
