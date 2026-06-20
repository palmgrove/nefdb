import { expect, test } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dir, "..");
const SCRIPT = path.join(REPO_ROOT, "scripts", "build_csv.ts");
const CSV_PATH = path.join(REPO_ROOT, "data", "nefdb_v1.csv");

function parseColumnsFromScript(): string[] {
  const source = fs.readFileSync(SCRIPT, "utf-8");
  const match = source.match(/const\s+columns\s*=\s*\[\s*([\s\S]*?)\s*\]\s*as\s+const;/);
  if (!match) throw new Error("Could not extract columns from build_csv.ts");
  const items = match[1]!.split(",");
  return items
    .map((item) => {
      const quoted = item.match(/"([^"]+)"/);
      return quoted ? quoted[1] : item.trim();
    })
    .filter(Boolean);
}

function parseCsvRow(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        fields.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }
  fields.push(current);
  return fields;
}

test("build_csv.ts produces a CSV with expected columns", async () => {
  const proc = Bun.spawn(["bun", "run", SCRIPT], {
    cwd: REPO_ROOT,
    stdout: "pipe",
    stderr: "pipe",
  });
  const exitCode = await proc.exited;
  expect(exitCode).toBe(0);

  const content = fs.readFileSync(CSV_PATH, "utf-8");
  const lines = content.split(/\r?\n/).filter((line) => line.length > 0);
  expect(lines.length).toBeGreaterThan(1);

  const header = parseCsvRow(lines[0]!);
  const expectedColumns = parseColumnsFromScript();
  expect(header).toEqual(expectedColumns);

  const sourceIdIndex = header.indexOf("source_id");
  const sourceTitleIndex = header.indexOf("source_title");
  expect(sourceIdIndex).toBeGreaterThan(-1);
  expect(sourceTitleIndex).toBeGreaterThan(-1);

  const dataRows = lines.slice(1);
  expect(dataRows.length).toBe(45);
  for (const rowLine of dataRows) {
    const row = parseCsvRow(rowLine);
    expect(row[sourceIdIndex]!.trim().length).toBeGreaterThan(0);
    expect(row[sourceTitleIndex]!.trim().length).toBeGreaterThan(0);
  }
});
