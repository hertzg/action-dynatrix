import Jexl from "jexl";
import semver = require("semver");

const prefixCase = (prefix: string, name: string) =>
  `${prefix}${name[0].toUpperCase()}${name.split("").slice(1).join("")}`;

const exposeFunctions = (jexl: any, prefix: string, pairs: [string, any][]) =>
  pairs.map(([name, value]) => {
    (jexl as any).addFunction(prefixCase(prefix, name), value);
  });

export const createJexl = () => {
  const jexl = new Jexl.Jexl();
  jexl.addTransform("unpluck", (value: any[], key = "v") =>
    value.map((v) => ({ [key]: v }))
  );
  jexl.addTransform("pluck", (value: any[], key = "v") =>
    value.map((v) => v[key])
  );

  jexl.addTransform("split", (value: string, sep = " ") => value.split(sep));
  jexl.addTransform("join", (value: any[], sep = " ") => value.join(sep));

  exposeFunctions(
    jexl,
    "math",
    Object.getOwnPropertyNames(Math)
      .map((name) => [name, (Math as any)[name]] as [string, any])
      .filter(([, value]) => typeof value === "function")
  );

  exposeFunctions(
    jexl,
    "semver",
    Object.entries(semver).filter(([, value]) => typeof value === "function")
  );

  return jexl;
};
