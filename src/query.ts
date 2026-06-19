import { allFactors } from "./factors/index.ts";
import type {
  EmissionFactor,
  FactorWithSource,
  MinimalFactor,
  QueryOptions,
} from "./types.ts";

function toFactorView(
  factor: EmissionFactor,
  options?: QueryOptions
): MinimalFactor | FactorWithSource | EmissionFactor {
  if (options?.full) return factor;
  if (options?.withSource) {
    return {
      id: factor.id,
      value: factor.value,
      unit: factor.unit,
      source: factor.source,
    };
  }
  return { id: factor.id, value: factor.value, unit: factor.unit };
}

export function list(
  options?: QueryOptions
): MinimalFactor[] | FactorWithSource[] | EmissionFactor[] {
  return allFactors.map((factor) => toFactorView(factor, options));
}
