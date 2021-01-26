import { getInput, setFailed, setOutput } from "@actions/core";
import { runAction } from "./runAction";

const file = getInput("file", { required: true });

runAction(file)
  .then((result) => setOutput("matrices", result))
  .catch((error) => setFailed(error));
