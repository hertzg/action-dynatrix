import {
  UsableHandlerContext,
  UsableHandlerRegistry,
  UsableObject,
} from "./index";
import { visitDepthFirst } from "./visitDepthFirst";
import _ from "lodash";
import { debug } from "../../log";

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
    const resolved = await handler(usable.with, context);
    debug(
      "[Executor] resolveUsable: resolved %s with %j as %j",
      usable.$use,
      usable.with,
      resolved
    );
    return resolved;
  };

  return {
    execute: async (
      object: any,
      context: UsableHandlerContext["execution"]
    ): Promise<any> => {
      const target = _.cloneDeep(object);
      const { usables, context: visitorCtx } = extractUsables(target);
      debug(
        "[Executor] execute: extracted %s usables at %j",
        usables.length,
        usables.map((usable) => visitorCtx.get(usable).path.join("."))
      );

      let usable;
      while ((usable = usables.shift())) {
        // Why not just use a foreach?
        const { path } = visitorCtx.get(usable);
        const resolved = await resolveUsable(usable, {
          lexical: {
            path,
          },
          execution: context,
        });
        _.set(target, path, resolved);
      }
      return target;
    },
  };
};
