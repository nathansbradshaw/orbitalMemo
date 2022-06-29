import { is } from "cypress/types/bluebird";

export const safeParseInt = (num: string) => {
  const newNum = parseInt(num);
  if (isNaN(newNum)) {
    return;
  }
  return newNum;
};
