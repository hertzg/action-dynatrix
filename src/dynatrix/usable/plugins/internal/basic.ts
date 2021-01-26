import { UsablePlugin } from "../index";

export const concat: UsablePlugin<Array<any>, any> = {
  name: "concat",
  handler: async (arrays) => [].concat(...arrays),
};
