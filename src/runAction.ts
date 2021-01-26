import { createDynatrix } from "./dynatrix";

export const runAction = async (file: string) => {
  const dynatrix = createDynatrix();
  return dynatrix.process(file);
};