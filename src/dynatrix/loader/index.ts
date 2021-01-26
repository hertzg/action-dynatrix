import { guard } from "decoders";
import { PathLike, promises as fs } from "fs";
import JsYaml from "js-yaml";
import { Matrixfile, matrixfileDecoder } from "./decoder";

const matrixfileGuard = guard(matrixfileDecoder);

export const createLoader = () => {
  const parseYaml = (contents: any) => JsYaml.load(contents);
  const validate = (contents: any) => matrixfileGuard(contents) as any;
  const load = (contents: any) => parseYaml(contents);

  return {
    validate: (contents: any): Matrixfile => validate(contents),
    read: async (path: PathLike): Promise<Matrixfile> =>
      load(await fs.readFile(path, { encoding: "utf8" })) as any,
  };
};

export { Matrixfile, MatrixfileMatrices, MatrixfileMatrix } from "./decoder";
