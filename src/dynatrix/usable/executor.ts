import {
  UsableHandlerContext,
  UsableHandlerRegistry,
  UsableObject,
} from "./index";
import { visitDepthFirst } from "./visitDepthFirst";
import _ from "lodash";

const isObject = (obj: any): obj is object =>
  obj !== null && typeof obj === "object";

const isExecutable = <TWith = any, TName = string>(
  obj: any
): obj is UsableObject<TWith, TName> =>
  isObject(obj) && obj.hasOwnProperty("$use");

const isTraversible = (obj: any): boolean =>
  obj !== null && typeof obj === "object";

const extractUsables = (
  object: any
): { usables: UsableObject[]; context: WeakMap<UsableObject, any> } => {
  const usables: UsableObject[] = [];
  const context = new WeakMap<UsableObject, any>();

  visitDepthFirst(object, isTraversible, (obj, path) => {
    if (isExecutable(obj)) {
      usables.push(obj);
      context.set(obj, {
        path,
      });
    }
  });

  return { usables, context };
};

export const creatExecutor = (registry: UsableHandlerRegistry) => {
  const resolveUsable = async (
    usable: UsableObject,
    context: UsableHandlerContext
  ): Promise<any> => {
    const handler = registry.getOrThrow(usable.$use);
    return handler(usable.with, context);
  };

  return {
    execute: async <TContext = any>(
      object: any,
      userContext?: TContext
    ): Promise<any> => {
      const target = _.cloneDeep(object);
      const { usables, context: visitorCtx } = extractUsables(target);

      let usable;
      while ((usable = usables.shift())) {
        const { path } = visitorCtx.get(usable);
        const resolved = await resolveUsable(usable, {
          path,
          custom: userContext,
        });
        _.set(target, path, resolved);
      }
      return target;
    },
  };
};
