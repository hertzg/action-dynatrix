import { UsablePlugin } from "../../index";
import { DecoderType, guard, json, object, optional, string } from "decoders";
import {createJexl} from "./jexl";

const configDecoder = object({
  args: optional(json),
  expr: string,
});
const configGuard = guard(configDecoder);

export type InternalExpressionPluginConfig = DecoderType<typeof configDecoder>;

const jexl = createJexl();

export const expressionPlugin: UsablePlugin<
  any,
  InternalExpressionPluginConfig
  > = {
  name: "jexl",
  handler: async (config) => {
    const { args, expr } = configGuard(config);
    return jexl.eval(expr, { args });
  },
};