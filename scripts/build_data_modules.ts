import * as fs from "node:fs";
import * as path from "node:path";

const repoRoot = path.resolve(import.meta.dir, "..");
const dataDir = path.join(repoRoot, "data");
const srcOutDir = path.join(repoRoot, "src", "data");
const distOutDir = path.join(repoRoot, "dist", "data");

function main(): void {
  fs.mkdirSync(srcOutDir, { recursive: true });
  fs.mkdirSync(distOutDir, { recursive: true });

  const csvPath = path.join(dataDir, "nefdb_v1.csv");
  const csvRaw = fs.readFileSync(csvPath, "utf-8");

  const csvSrc = `const csv: string = ${JSON.stringify(csvRaw)};\nexport default csv;\n`;
  fs.writeFileSync(path.join(srcOutDir, "csv.ts"), csvSrc, "utf-8");

  const csvCjs = `module.exports = ${JSON.stringify(csvRaw)};\n`;
  fs.writeFileSync(path.join(distOutDir, "csv.cjs"), csvCjs, "utf-8");

  const jsonPath = path.join(dataDir, "nefdb_v1.json");
  const jsonRaw = fs.readFileSync(jsonPath, "utf-8");
  const jsonParsed = JSON.parse(jsonRaw);
  const jsonLiteral = JSON.stringify(jsonParsed, null, 2);

  const jsonSrc = `import type { EmissionFactor } from "../types.ts";\n\nconst json: EmissionFactor[] = ${jsonLiteral};\nexport default json;\n`;
  fs.writeFileSync(path.join(srcOutDir, "json.ts"), jsonSrc, "utf-8");

  const jsonCjs = `module.exports = ${jsonLiteral};\n`;
  fs.writeFileSync(path.join(distOutDir, "json.cjs"), jsonCjs, "utf-8");

  console.log(`Wrote src/data/csv.ts, src/data/json.ts, dist/data/csv.cjs, dist/data/json.cjs`);
}

main();
