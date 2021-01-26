import { getInput, setFailed, setOutput } from "@actions/core";
import { runAction } from "./runAction";

const file = getInput("file", { required: true });

runAction(file)
  .then((result) => {
    console.log(JSON.stringify({ matrices: result }, null, 2));
    setOutput("matrices", result);
  })
  .catch((error) => {
    setFailed(error);
    console.error(error);
    throw error;
  });
