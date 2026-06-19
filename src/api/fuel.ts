import type {
  EmissionFactor,
  FactorWithSource,
  MinimalFactor,
  QueryOptions,
} from "../types.ts";

export function diesel(
  _options?: QueryOptions,
): MinimalFactor | FactorWithSource | EmissionFactor | undefined {
  // ponytail: Phase 0 — zero factors, returns undefined until populated
  return undefined;
}

export function petrol(
  _options?: QueryOptions,
): MinimalFactor | FactorWithSource | EmissionFactor | undefined {
  return undefined;
}

export function lpg(
  _options?: QueryOptions,
): MinimalFactor | FactorWithSource | EmissionFactor | undefined {
  return undefined;
}

export function cng(
  _options?: QueryOptions,
): MinimalFactor | FactorWithSource | EmissionFactor | undefined {
  return undefined;
}

export function naturalGas(
  _options?: QueryOptions,
): MinimalFactor | FactorWithSource | EmissionFactor | undefined {
  return undefined;
}

export function hfo(
  _options?: QueryOptions,
): MinimalFactor | FactorWithSource | EmissionFactor | undefined {
  return undefined;
}
