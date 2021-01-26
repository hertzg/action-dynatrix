import { createUsable } from "./usable";
import { createLoader, MatrixfileMatrices, MatrixfileMatrix } from "./loader";
import { objectProduct } from "./cartesian";

export const createDynatrix = () => {
  const loader = createLoader();
  const usable = createUsable();

  const matrixProduct = async (matrix: MatrixfileMatrix) => {
    const resolved = (await usable.execute(matrix)) as any;
    return objectProduct(resolved);
  };

  const createOutput = async (matrix: MatrixfileMatrix) => {
    return {
      include: JSON.stringify(await matrixProduct(matrix)),
    };
  };

  const processMatrices = async (matrices: MatrixfileMatrices) =>
    Object.fromEntries(
      await Promise.all(
        Object.entries(matrices).map(async ([group, matrix]) => [
          group,
          await createOutput(matrix),
        ])
      )
    );

  return {
    process: async (path: string) => {
      const matrixfile = await loader.read(path);
      return await processMatrices(matrixfile.matrices as any);
    },
  };
};
