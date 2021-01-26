import {
  array,
  constant,
  DecoderType,
  dict,
  json,
  object,
  optional,
  unknown,
} from "decoders";

const versionDecoder = constant("1" as "1");

const matrixDecoder = dict(array(json));
export type MatrixfileMatrix = DecoderType<typeof matrixDecoder>;

const matricesDecoder = dict(matrixDecoder);
export type MatrixfileMatrices = DecoderType<typeof matricesDecoder>;

export const matrixfileDecoder = object({
  version: optional(versionDecoder),

  matrices: dict(unknown),
});

export type Matrixfile = DecoderType<typeof matrixfileDecoder>;
