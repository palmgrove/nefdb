import { allFactors } from "../src/factors/index.ts";
import * as fs from "node:fs";
import * as path from "node:path";

const outputPath = path.join(import.meta.dir, "..", "data", "nefdb_v1.json");

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(
  outputPath,
  JSON.stringify(allFactors, null, 2) + "\n",
  "utf-8"
);
console.log(`Wrote ${outputPath} (${allFactors.length} factor(s))`);
