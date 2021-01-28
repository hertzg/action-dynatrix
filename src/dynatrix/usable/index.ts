import { createPluginLoader, UsablePluginModule } from "./plugins";
import { createHandlerRegistry } from "./handlers";
import { creatExecutor } from "./executor";

export interface UsableObject<TWith = any, TName = string> {
  $use: TName;
  with?: TWith;
}

export interface UsableHandlerContext {
  lexical:
    | {
        path: string[];
      }
    | { [key: string]: any };
  execution: { path: string; cwd: string };
}

export interface UsableHandler<TResult = any, TWith = any> {
  (config: TWith, context: UsableHandlerContext): Promise<TResult>;
}

export * from "./executor";
export * from "./handlers";

export const createUsable = () => {
  const registry = createHandlerRegistry();
  const plugins = createPluginLoader(registry);
  const executor = creatExecutor(registry);

  const registerModule = (module: UsablePluginModule) =>
    plugins.loadModule(module);

  return {
    execute: async <TResult = unknown>(
      object: unknown,
      context: UsableHandlerContext["execution"]
    ): Promise<TResult> => executor.execute(object, context),
    plugin: (module: UsablePluginModule) => registerModule(module),
  };
};
