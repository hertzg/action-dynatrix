import {
  debug as _debug,
  error as _error,
  info as _info,
  isDebug,
  warning as _warning,
} from "@actions/core";
import { format } from "util";
import __debug from "debug";

const dbgr = __debug("");
const withDebug = <T>(fn: T): T => {
  return ((...args: any) => {
    (dbgr as any)(...args);
    return (fn as any)(...args);
  }) as any;
};

export const debug = withDebug((...args: any[]) =>
  isDebug() ? _debug(format(...args)) : null
);
export const info = withDebug((...args: any[]) => _info(format(...args)));
export const log = info;
export const warning = withDebug((...args: any[]) => _warning(format(...args)));
export const error = withDebug((...args: any[]) => _error(format(...args)));
