import { allFactors } from "../src/factors/index.ts";
import { sourcesById } from "../src/sources/index.ts";
import {
  DISCOS,
  FACTOR_CATEGORIES,
  FACTOR_UNITS,
  type EmissionFactor,
} from "../src/types.ts";

const VALID_GWP = ["AR5", "AR6"] as const;
const VALID_SCOPES = [1, 2, "1_and_2"] as const;
const VALID_CONFIDENCE = ["high", "medium", "low"] as const;
const VALID_YEAR_MIN = 1900;
const VALID_YEAR_MAX = 2100;

const errors: string[] = [];

function fail(message: string): void {
  errors.push(message);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}

function isFiniteNumber(value: unknown): value is number {
  return isNumber(value) && Number.isFinite(value);
}

function isReasonableYear(value: unknown): value is number {
  return (
    isNumber(value) && value >= VALID_YEAR_MIN && value <= VALID_YEAR_MAX
  );
}

function validateSources(): void {
  const seen = new Set<string>();
  for (const [id, source] of Object.entries(sourcesById)) {
    if (!isNonEmptyString(id)) {
      fail("source registry: missing id");
      continue;
    }
    if (seen.has(id)) {
      fail(`source registry: duplicate source id "${id}"`);
    }
    seen.add(id);
    if (!isNonEmptyString(source?.title)) {
      fail(`source "${id}": missing or empty title`);
    }
    if (!isNonEmptyString(source?.publisher)) {
      fail(`source "${id}": missing or empty publisher`);
    }
    if (!isReasonableYear(source?.year)) {
      fail(`source "${id}": year must be between ${VALID_YEAR_MIN} and ${VALID_YEAR_MAX}`);
    }
  }
}

function validateFactor(factor: EmissionFactor, index: number): void {
  const idLabel = isNonEmptyString(factor?.id) ? ` (${factor.id})` : "";
  const prefix = `factor[${index}]${idLabel}`;

  if (!isNonEmptyString(factor?.id)) fail(`${prefix}: missing or empty id`);
  if (!FACTOR_CATEGORIES.includes(factor?.category)) {
    fail(`${prefix}: invalid category "${factor?.category}"`);
  }
  if (!isNonEmptyString(factor?.subcategory)) {
    fail(`${prefix}: missing or empty subcategory`);
  }
  if (!isNonEmptyString(factor?.description)) {
    fail(`${prefix}: missing or empty description`);
  }
  if (!isFiniteNumber(factor?.value)) {
    fail(`${prefix}: value must be a finite number`);
  }
  if (!FACTOR_UNITS.includes(factor?.unit)) {
    fail(`${prefix}: invalid unit "${factor?.unit}"`);
  }
  if (!VALID_GWP.includes(factor?.gwp_basis as "AR5" | "AR6")) {
    fail(`${prefix}: invalid gwp_basis "${factor?.gwp_basis}"`);
  }
  if (!VALID_SCOPES.includes(factor?.scope as 1 | 2 | "1_and_2")) {
    fail(`${prefix}: invalid scope "${factor?.scope}"`);
  }
  if (!isNumber(factor?.data_year)) {
    fail(`${prefix}: data_year must be a number`);
  }
  if (factor?.country !== "NG") {
    fail(`${prefix}: country must be "NG"`);
  }
  if (factor?.disco !== undefined && !DISCOS.includes(factor.disco)) {
    fail(`${prefix}: invalid disco "${factor.disco}"`);
  }
  if (
    !VALID_CONFIDENCE.includes(
      factor?.confidence as "high" | "medium" | "low"
    )
  ) {
    fail(`${prefix}: invalid confidence "${factor?.confidence}"`);
  }
  if (!isNonEmptyString(factor?.methodology_note)) {
    fail(`${prefix}: missing or empty methodology_note`);
  }
  if (!isNonEmptyString(factor?.nefdb_version)) {
    fail(`${prefix}: missing or empty nefdb_version`);
  }
  if (
    factor?.uncertainty_pct !== undefined &&
    (!isFiniteNumber(factor.uncertainty_pct) || factor.uncertainty_pct < 0)
  ) {
    fail(`${prefix}: uncertainty_pct must be a non-negative finite number`);
  }

  if (factor?.gas != null) {
    if (!isFiniteNumber(factor.gas.CO2)) {
      fail(`${prefix}: gas.CO2 must be a finite number`);
    }
    if (!isFiniteNumber(factor.gas.CH4)) {
      fail(`${prefix}: gas.CH4 must be a finite number`);
    }
    if (!isFiniteNumber(factor.gas.N2O)) {
      fail(`${prefix}: gas.N2O must be a finite number`);
    }
  }

  if (factor?.source == null) {
    fail(`${prefix}: missing source`);
  } else {
    if (!isNonEmptyString(factor.source.id)) {
      fail(`${prefix}: source.id missing or empty`);
    }
    if (!sourcesById[factor.source.id]) {
      fail(`${prefix}: source.id "${factor.source.id}" not found in registry`);
    }
    if (!isNonEmptyString(factor.source.title)) {
      fail(`${prefix}: source.title missing or empty`);
    }
    if (!isNonEmptyString(factor.source.publisher)) {
      fail(`${prefix}: source.publisher missing or empty`);
    }
    if (!isReasonableYear(factor.source.year)) {
      fail(`${prefix}: source.year must be between ${VALID_YEAR_MIN} and ${VALID_YEAR_MAX}`);
    }
  }
}

function main(): void {
  validateSources();

  const seenIds = new Set<string>();
  for (let i = 0; i < allFactors.length; i++) {
    const factor = allFactors[i]!;
    validateFactor(factor, i);
    if (seenIds.has(factor.id)) {
      fail(`duplicate factor id "${factor.id}"`);
    }
    seenIds.add(factor.id);
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(error);
    }
    console.error(`\nValidation failed: ${errors.length} error(s).`);
    process.exit(1);
  }

  console.log(
    `Validated ${allFactors.length} factor(s) and ${Object.keys(sourcesById).length} source(s). OK.`
  );
  process.exit(0);
}

main();
