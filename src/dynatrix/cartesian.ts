export const product = <T>(...arrays: Array<T[]>) =>
  arrays.reduce<Array<T[]>>(
    (states, source) =>
      states.flatMap((acc) => source.map((entry) => [...acc, entry])),
    [[]]
  );

export const objectProduct = <T>(object: { [key: string]: T[] }) => {
  const keys = Object.keys(object);
  const values = Object.values(object);
  return product<T>(...values).map((values) => [
    values.reduce((acc, value, i) => ({ ...acc, [keys[i]]: value }), {} as T),
  ]);
};
