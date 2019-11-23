import fs from "fs";
import path from "path";

function loadAll() {
  const ignorePatterns = [/\.test\.[tj]s$/, /^index\.[tj]s$/];
  const root = path.join(__dirname);
  const list = fs
    .readdirSync(root)
    .filter(f => !ignorePatterns.some(pattern => pattern.test(f)))
    .map(f => [f.split(".")[0], path.join(root, f)]);
  return Object.fromEntries(list);
}

export default loadAll();
