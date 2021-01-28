import { UsableHandler, UsableHandlerRegistry } from "../index";
import * as internalPlugins from "./internal";
import { debug } from "../../../log";

export interface UsablePlugin<TResult, TWith> {
  name: string;
  handler: UsableHandler<TResult, TWith>;
}

export interface UsablePluginModule {
  [key: string]: UsablePlugin<any, any>;
}

export const createPluginLoader = (registry: UsableHandlerRegistry) => {
  const findPlugins = (object: UsablePluginModule) =>
    Object.entries(object)
      .filter(
        ([, v]) =>
          v !== null &&
          typeof v === "object" &&
          v.hasOwnProperty("name") &&
          v.hasOwnProperty("handler")
      )
      .map(([, v]) => v);

  const registerPlugin = <TReturn, TWith>(
    plugin: UsablePlugin<TReturn, TWith>
  ) => {
    debug("[PluginLoader] register: %s", plugin.name);
    registry.register(plugin.name, plugin.handler);
  };

  const registerPlugins = (plugins: UsablePlugin<any, any>[]) =>
    plugins.forEach((plugin) => registerPlugin(plugin));

  const registerModule = (module: UsablePluginModule) => {
    registerPlugins(findPlugins(module));
  };

  registerModule(internalPlugins);

  return {
    loadPlugin: (plugin: UsablePlugin<any, any>) => {
      registerPlugin(plugin);
    },
    loadModule: (module: UsablePluginModule) => {
      registerPlugins(findPlugins(module));
    },
  };
};
