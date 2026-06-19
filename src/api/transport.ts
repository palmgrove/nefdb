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

export function road(
  fuel: "petrol" | "diesel",
  vehicle?:
    | "car"
    | "motorcycle"
    | "bus"
    | "truck.small"
    | "truck.heavy",
  options?: QueryOptions
) {
  if (!vehicle) {
    const factor = allFactors.find(
      (f) => f.id === `ng.transport.road.${fuel}.per_litre`
    );
    return factor ? toFactorView(factor, options) : undefined;
  }

  const factor = allFactors.find(
    (f) => f.id === `ng.transport.road.${fuel}.${vehicle}`
  );
  return factor ? toFactorView(factor, options) : undefined;
}
