import { createUsable, UsableHandlerContext } from "./usable";
import { createLoader, MatrixfileMatrices, MatrixfileMatrix } from "./loader";
import { objectProduct } from "./cartesian";
import { matrixDecoder } from "./loader/decoder";
import { guard } from "decoders";

const matrixGuard = guard(matrixDecoder);

export const createDynatrix = () => {
  const loader = createLoader();
  const usable = createUsable();

  const matrixProduct = async (
    matrix: MatrixfileMatrix,
    context: UsableHandlerContext["execution"]
  ) => {
    const resolved = matrixGuard(await usable.execute(matrix, context)) as any;
    return objectProduct(resolved);
  };

  const createOutput = async (
    matrix: MatrixfileMatrix,
    context: UsableHandlerContext["execution"]
  ) => {
    return {
      include: JSON.stringify(await matrixProduct(matrix, context)),
    };
  };

  const processMatrices = async (
    matrices: MatrixfileMatrices,
    context: UsableHandlerContext["execution"]
  ) =>
    Object.fromEntries(
      await Promise.all(
        Object.entries(matrices).map(async ([group, matrix]) => [
          group,
          await createOutput(matrix, context),
        ])
      )
    );

  return {
    process: async (path: string) => {
      const matrixfile = await loader.read(path);
      return await processMatrices(matrixfile.matrices as any, {
        path,
        cwd: process.cwd(),
      });
    },
  };
};
