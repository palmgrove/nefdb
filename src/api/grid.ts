import { allFactors } from "../factors/index.ts";
import type {
  DisCo,
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

type Margin = "om" | "bm" | "cm" | "location";

const NATIONAL_IDS: Record<Margin, string> = {
  om: "ng.grid.national.om.2021",
  bm: "ng.grid.national.bm.2021",
  cm: "ng.grid.national.cm.2021",
  location: "ng.grid.national.location.2024",
};

export function national(
  options?: QueryOptions,
): MinimalFactor | FactorWithSource | EmissionFactor | undefined;
export function national(
  margin: Margin,
  options?: QueryOptions,
): MinimalFactor | FactorWithSource | EmissionFactor | undefined;
export function national(
  marginOrOptions?: Margin | QueryOptions,
  options?: QueryOptions,
): MinimalFactor | FactorWithSource | EmissionFactor | undefined {
  const margin =
    typeof marginOrOptions === "string" ? marginOrOptions : "cm";
  const opts = typeof marginOrOptions === "string" ? options : marginOrOptions;
  const factor = allFactors.find((f) => f.id === NATIONAL_IDS[margin]);
  return factor ? toFactorView(factor, opts) : undefined;
}

export function disco(
  name: DisCo,
  options?: QueryOptions,
): MinimalFactor | FactorWithSource | EmissionFactor | undefined {
  const factor = allFactors.find(
    (f) =>
      f.disco === name &&
      f.id.startsWith("ng.grid.disco.") &&
      f.id.endsWith(".2024")
  );
  return factor ? toFactorView(factor, options) : undefined;
}
