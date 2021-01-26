import { UsablePlugin } from "../index";
import { runInNewContext } from "vm";
import {
  compose,
  DecoderType,
  dict,
  guard,
  mixed,
  object,
  optional,
  positiveInteger,
  predicate,
  string,
} from "decoders";
import semver = require("semver");
import lodash = require("lodash");

const MAX_EXECUTION_TIME = 300000;
const configDecoder = object({
  script: string,
  context: optional(dict(mixed)),
  timeoutMs: optional(
    compose(
      positiveInteger,
      predicate(
        (v) => v <= MAX_EXECUTION_TIME,
        `Maximum allowed execution time is ${MAX_EXECUTION_TIME} ms`
      )
    )
  ),
});
const configGuard = guard(configDecoder);

export type InternalExpressionPluginConfig = DecoderType<typeof configDecoder>;

export const expressionPlugin: UsablePlugin<
  any,
  InternalExpressionPluginConfig
> = {
  name: "script",
  handler: async (config) => {
    const { script, context, timeoutMs } = configGuard(config);
    return runInNewContext(
      script,
      {
        context: context,
        semver: semver,
        _: lodash,
      },
      {
        displayErrors: true,
        filename: "scriptPluginVmContext Line",
        timeout: timeoutMs ?? MAX_EXECUTION_TIME,
      }
    );
  },
};
