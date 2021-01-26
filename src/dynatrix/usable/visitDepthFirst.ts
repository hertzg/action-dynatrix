export const visitDepthFirst = (
  root: any,
  shouldDive: (object: any) => boolean,
  callback: (value: any, path: string[], parent?: any) => void
) => {
  const _visit = (entries: any, path: string[], parent?: any) => {
    for (const entry of entries) {
      const [key, value] = entry;
      const nextPath = [...path, key];
      if (shouldDive(value)) {
        _visit(Object.entries(value), nextPath, parent);
        callback(value, nextPath, parent);
      }
    }
  };

  _visit(Object.entries(root), [], root);
};
