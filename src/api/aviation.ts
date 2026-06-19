import type {
  EmissionFactor,
  FactorWithSource,
  MinimalFactor,
  QueryOptions,
} from "../types.ts";

export interface AviationOptions extends QueryOptions {
  rf?: boolean;
}

export function route(
  _origin: string,
  _destination: string,
  _options?: AviationOptions,
): MinimalFactor | FactorWithSource | EmissionFactor | undefined {
  // ponytail: Phase 0 — zero factors, returns undefined until populated
  return undefined;
}
