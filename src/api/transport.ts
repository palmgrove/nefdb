import type {
  EmissionFactor,
  FactorWithSource,
  MinimalFactor,
  QueryOptions,
} from "../types.ts";

export type RoadFuel = "petrol" | "diesel";
export type RoadVehicle =
  | "car"
  | "motorcycle"
  | "bus"
  | "truck.small"
  | "truck.heavy";

export function road(
  _fuel: RoadFuel,
  _vehicle?: RoadVehicle,
  _options?: QueryOptions,
): MinimalFactor | FactorWithSource | EmissionFactor | undefined {
  // ponytail: Phase 0 — zero factors, returns undefined until populated
  return undefined;
}
