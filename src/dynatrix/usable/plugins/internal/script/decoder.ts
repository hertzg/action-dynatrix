import {
  DecoderType,
  dict,
  either,
  mixed,
  object,
  optional,
  string,
} from "decoders";

const extras = {
  context: optional(dict(mixed)),
};

export const scriptDecoder = object({
  script: string,
  path: optional(string),
  ...extras,
});

export const fileDecoder = object({
  file: string,
  path: string,
  ...extras,
});

export const decoder = either(scriptDecoder, fileDecoder);
export type ScriptConfig = DecoderType<typeof decoder>;
