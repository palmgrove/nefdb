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

export function msw(
  type: "landfill_managed" | "open_dump" | "open_burning",
  options?: QueryOptions
) {
  const idMap = {
    landfill_managed: "ng.waste.msw.landfill.managed",
    open_dump: "ng.waste.msw.open_dump",
    open_burning: "ng.waste.msw.open_burning",
  };
  return find(idMap[type], options);
}

export function composting(options?: QueryOptions) {
  return find("ng.waste.organic.composting", options);
}

export function wastewater(
  type: "domestic" | "industrial",
  options?: QueryOptions
) {
  if (type !== "domestic" && type !== "industrial") return undefined;
  const id =
    type === "domestic"
      ? "ng.waste.wastewater.domestic"
      : "ng.waste.wastewater.industrial";
  return find(id, options);
}
