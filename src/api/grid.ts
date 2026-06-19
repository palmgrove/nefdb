import type {
  DisCo,
  EmissionFactor,
  FactorWithSource,
  MinimalFactor,
  QueryOptions,
} from "../types.ts";

type Margin = "om" | "bm" | "cm" | "location";

export function national(
  options?: QueryOptions,
): MinimalFactor | FactorWithSource | EmissionFactor | undefined;
export function national(
  margin: Margin,
  options?: QueryOptions,
): MinimalFactor | FactorWithSource | EmissionFactor | undefined;
export function national(
  _marginOrOptions?: Margin | QueryOptions,
  _options?: QueryOptions,
): MinimalFactor | FactorWithSource | EmissionFactor | undefined {
  // ponytail: Phase 0 — zero factors, returns undefined until populated
  return undefined;
}

export function disco(
  _name: DisCo,
  _options?: QueryOptions,
): MinimalFactor | FactorWithSource | EmissionFactor | undefined {
  // ponytail: Phase 0 — zero factors, returns undefined until populated
  return undefined;
}
