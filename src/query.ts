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

export function get(
  id: string,
  options?: QueryOptions
): MinimalFactor | FactorWithSource | EmissionFactor | undefined {
  const factor = allFactors.find((f) => f.id === id);
  return factor ? toFactorView(factor, options) : undefined;
}

export function query(
  filter: Partial<EmissionFactor> & { source?: { id?: string } },
  options?: QueryOptions
): MinimalFactor[] | FactorWithSource[] | EmissionFactor[] {
  const entries = Object.entries(filter) as [string, unknown][];
  const matches = allFactors.filter((factor) => {
    for (const [key, value] of entries) {
      if (key === "source" && value && typeof value === "object") {
        const sourceId = (value as { id?: string }).id;
        if (sourceId !== undefined && factor.source.id !== sourceId) {
          return false;
        }
        continue;
      }
      if ((factor as Record<string, unknown>)[key] !== value) {
        return false;
      }
    }
    return true;
  });
  return matches.map((factor) => toFactorView(factor, options));
}

export function list(
  options?: QueryOptions
): MinimalFactor[] | FactorWithSource[] | EmissionFactor[] {
  return allFactors.map((factor) => toFactorView(factor, options));
}
