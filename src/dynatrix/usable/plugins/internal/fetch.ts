import { UsablePlugin } from "../index";
import fetch from "node-fetch";
import {
  array,
  compose,
  constant,
  DecoderType,
  dict,
  either,
  guard,
  integer,
  object,
  optional,
  predicate,
  string,
  url,
} from "decoders";

const positiveInteger = compose(
  integer,
  predicate((n) => n >= 0, "Must be positive")
);

const configDecoder = object({
  url: url(["http", "https"]),
  method: optional(string),
  headers: optional(compose(dict(string), array(array(string)))),
  follow: optional(positiveInteger),
  size: optional(positiveInteger),
  timeout: optional(positiveInteger),
  body: optional(string),
  as: optional(either(constant("text" as "text"), constant("json" as "json"))),
});

const configGuard = guard(configDecoder);

export type InternalFetchPluginConfig = DecoderType<typeof configDecoder>;

export interface InternalFetchPluginResponse {
  status: number;
  headers: { [key: string]: string };
  body: any;
}

export const fetchPlugin: UsablePlugin<any, InternalFetchPluginConfig> = {
  name: "fetch",
  handler: async (config) => {
    const { url, as, ...options } = configGuard(config);
    return fetch(url, {
      ...options,
    }).then(async (res) => ({
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
      body: as === "json" ? await res.json() : await res.text(),
    }));
  },
};
