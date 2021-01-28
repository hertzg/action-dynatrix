import { UsablePlugin } from "../../index";
import { NodeVM } from "vm2";
import {
  DecoderType,
  dict,
  guard,
  mixed,
  object,
  optional,
  string,
} from "decoders";
import { dirname, join, resolve } from "path";

const configDecoder = object({
  script: string,
  path: optional(string),
  context: optional(dict(mixed)),
});
const configGuard = guard(configDecoder);

export type InternalExpressionPluginConfig = DecoderType<typeof configDecoder>;

export const expressionPlugin: UsablePlugin<
  any,
  InternalExpressionPluginConfig
> = {
  name: "script",
  handler: async (config, ctx) => {
    const { script, context } = configGuard(config);

    const root = dirname(resolve(ctx.execution.cwd, ctx.execution.path));
    const vm = new NodeVM({
      console: "inherit",
      sandbox: {
        context,
      },
      wrapper: "none", // allows returns from the script
      require: {
        external: true,
        builtin: ["fs", "path"],
        root: "./",
        context: "sandbox",
      },
    });

    return vm.run(script, join(root, "vm.js"));
  },
};
