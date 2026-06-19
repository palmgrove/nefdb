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

export function petrol(options?: QueryOptions) {
  return find("ng.fuel.petrol.stationary", options);
}

export function lpg(options?: QueryOptions) {
  return find("ng.fuel.lpg.stationary", options);
}

export function cng(options?: QueryOptions) {
  return find("ng.fuel.cng.stationary", options);
}

export function naturalGas(options?: QueryOptions) {
  return find("ng.fuel.naturalgas.stationary", options);
}

export function hfo(options?: QueryOptions) {
  return find("ng.fuel.hfo.stationary", options);
}

export function diesel(options?: QueryOptions) {
  const per_litre = find("ng.fuel.diesel.stationary", options);
  if (!per_litre) return undefined;
  return {
    per_litre,
    per_kwh: {
      rated: find("ng.fuel.diesel.stationary.kwh.rated", options),
      // field efficiency is the recommended default for Nigeria's aged generator fleet
      field: find("ng.fuel.diesel.stationary.kwh.field", options),
    },
  };
}
