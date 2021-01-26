import { UsableHandler } from "./index";

const errorUnknownUsable = (name: string) =>
  new Error(`Unknown usable: ${name}`);

const createMultiKeyMap = <TValue = unknown, TKey = unknown>() => {
  const values: TValue[] = [];
  const aliases = new Map<TKey, number>();

  const indexByAlias = (alias: TKey) => aliases.get(alias);
  const indexByValue = (value: TValue) => {
    const index = values.indexOf(value);
    return index !== -1 ? index : undefined;
  };

  const findOrPush = (alias: TKey, value: TValue) => {
    return indexByValue(value) ?? indexByAlias(alias) ?? values.push(value) - 1;
  };

  const byAlias = (alias: TKey) => {
    const index = indexByAlias(alias);
    if (index != null) {
      return values[index];
    }
  };

  return {
    set: (alias: TKey, value: TValue) => {
      aliases.set(alias, findOrPush(alias, value));
    },
    get: (alias: TKey): TValue | undefined => byAlias(alias),
  };
};

export interface UsableHandlerRegistry {
  register(alias: string, handler?: UsableHandler): void;

  getOrThrow(alias: string): UsableHandler;
}

export const createHandlerRegistry = (): UsableHandlerRegistry => {
  const map = createMultiKeyMap<UsableHandler, string>();

  return {
    register: (alias: string | string[], handler: UsableHandler): void => {
      const aliases = Array.isArray(alias) ? alias : [alias];
      aliases.forEach((alias) => map.set(alias, handler));
    },

    getOrThrow: (alias: string) => {
      const handler = map.get(alias);
      if (!handler) {
        throw errorUnknownUsable(alias);
      }
      return handler;
    },
  };
};
