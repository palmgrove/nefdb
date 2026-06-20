import { expect, test } from "bun:test";
import { nefdb } from "../src/index.ts";
import {
  DISCOS,
  FACTOR_CATEGORIES,
  FACTOR_UNITS,
  type EmissionFactor,
} from "../src/types.ts";

const factors = nefdb.list({ full: true }) as EmissionFactor[];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

const VALID_GWP = ["AR5", "AR6"] as const;
const VALID_SCOPES = [1, 2, "1_and_2"] as const;
const VALID_CONFIDENCE = ["high", "medium", "low"] as const;

for (const factor of factors) {
  test(`factor ${factor.id} matches EmissionFactor schema`, () => {
    expect(isNonEmptyString(factor.id)).toBe(true);
    expect(FACTOR_CATEGORIES.includes(factor.category)).toBe(true);
    expect(isNonEmptyString(factor.subcategory)).toBe(true);
    expect(isNonEmptyString(factor.description)).toBe(true);
    expect(Number.isFinite(factor.value)).toBe(true);
    expect(FACTOR_UNITS.includes(factor.unit)).toBe(true);
    expect(VALID_GWP).toContain(factor.gwp_basis);
    expect(VALID_SCOPES).toContain(factor.scope);
    expect(typeof factor.data_year).toBe("number");
    expect(typeof factor.published_year).toBe("number");
    expect(factor.country).toBe("NG");
    expect(VALID_CONFIDENCE).toContain(factor.confidence);
    expect(isNonEmptyString(factor.methodology_note)).toBe(true);
    expect(isNonEmptyString(factor.nefdb_version)).toBe(true);

    if (factor.disco !== undefined) {
      expect(DISCOS.includes(factor.disco)).toBe(true);
    }

    expect(factor.source).toBeDefined();
    expect(isNonEmptyString(factor.source.id)).toBe(true);
    expect(isNonEmptyString(factor.source.title)).toBe(true);
    expect(isNonEmptyString(factor.source.publisher)).toBe(true);
    expect(typeof factor.source.year).toBe("number");

    if (factor.gas !== null) {
      expect(Number.isFinite(factor.gas.CO2)).toBe(true);
      expect(Number.isFinite(factor.gas.CH4)).toBe(true);
      expect(Number.isFinite(factor.gas.N2O)).toBe(true);
    }

    if (factor.additional_sources) {
      for (const source of factor.additional_sources) {
        expect(isNonEmptyString(source.id)).toBe(true);
        expect(isNonEmptyString(source.title)).toBe(true);
        expect(isNonEmptyString(source.publisher)).toBe(true);
        expect(typeof source.year).toBe("number");
      }
    }
  });
}
