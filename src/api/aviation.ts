import { allFactors } from "../factors/index.ts";
import type {
  EmissionFactor,
  FactorWithSource,
  MinimalFactor,
  QueryOptions,
} from "../types.ts";

export interface AviationOptions extends QueryOptions {
  rf?: boolean;
}

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

const RF_MULTIPLIER = 1.9;

export function route(
  origin: string,
  destination: string,
  options?: AviationOptions
): MinimalFactor | FactorWithSource | EmissionFactor | undefined {
  const a = origin.toLowerCase();
  const b = destination.toLowerCase();
  const forwardId = `ng.aviation.domestic.${a}_${b}`;
  const reverseId = `ng.aviation.domestic.${b}_${a}`;

  const base =
    allFactors.find((f) => f.id === forwardId) ??
    allFactors.find((f) => f.id === reverseId);

  if (!base) return undefined;

  if (!options?.rf) {
    return toFactorView(base, options);
  }

  const adjustedValue = base.value * RF_MULTIPLIER;

  if (options.full) {
    return { ...base, value: adjustedValue };
  }

  if (options.withSource) {
    return {
      id: base.id,
      value: adjustedValue,
      unit: base.unit,
      source: base.source,
    };
  }

  return {
    id: base.id,
    value: adjustedValue,
    unit: base.unit,
  };
}
