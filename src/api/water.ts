import { allFactors } from "../factors/index.ts";
import type {
  EmissionFactor,
  FactorWithSource,
  MinimalFactor,
  QueryOptions,
} from "../types.ts";

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

function find(id: string, options?: QueryOptions) {
  const factor = allFactors.find((f) => f.id === id);
  return factor ? toFactorView(factor, options) : undefined;
}

export function supply(options?: QueryOptions) {
  return find("ng.water.treatment.supply", options);
}

export function wastewater(options?: QueryOptions) {
  return find("ng.water.treatment.wastewater", options);
}
