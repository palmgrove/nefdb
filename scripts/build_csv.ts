import { allFactors } from "../src/factors/index.ts";
import type { EmissionFactor } from "../src/types.ts";
import * as fs from "node:fs";
import * as path from "node:path";

const columns = [
  "id",
  "category",
  "subcategory",
  "description",
  "value",
  "unit",
  "gwp_basis",
  "scope",
  "data_year",
  "country",
  "disco",
  "confidence",
  "uncertainty_pct",
  "source_id",
  "source_title",
  "source_publisher",
  "source_year",
  "source_url",
  "source_page",
  "methodology_note",
] as const;

function csvCell(value: unknown): string {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function factorToRow(factor: EmissionFactor): string {
  const values = [
    factor.id,
    factor.category,
    factor.subcategory,
    factor.description,
    factor.value,
    factor.unit,
    factor.gwp_basis,
    factor.scope,
    factor.data_year,
    factor.country,
    factor.disco ?? "",
    factor.confidence,
    factor.uncertainty_pct ?? "",
    factor.source.id,
    factor.source.title,
    factor.source.publisher,
    factor.source.year,
    factor.source.url ?? "",
    factor.source.page ?? "",
    factor.methodology_note,
  ];
  return values.map(csvCell).join(",");
}

function main(): void {
  const header = columns.join(",");
  const rows = allFactors.map(factorToRow);
  const csv = [header, ...rows].join("\n") + "\n";
  const outputPath = path.join(import.meta.dir, "..", "data", "nefdb_v1.csv");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, csv, "utf-8");
  console.log(`Wrote ${outputPath} (${allFactors.length} row(s))`);
}

main();
