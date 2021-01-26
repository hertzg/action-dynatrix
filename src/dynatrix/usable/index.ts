import { createPluginLoader, UsablePluginModule } from "./plugins";
import { createHandlerRegistry } from "./handlers";
import { creatExecutor } from "./executor";

export interface UsableObject<TWith = any, TName = string> {
  $use: TName;
  with?: TWith;
}

export interface UsableHandlerContext<TUser = any> {
  path: string[];
  custom?: TUser;
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
      userContext?: any
    ): Promise<TResult> => executor.execute(object, userContext),
    plugin: (module: UsablePluginModule) => registerModule(module),
  };
};
