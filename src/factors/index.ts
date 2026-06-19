import type { EmissionFactor } from "../types.ts";
import { fuelCombustionFactors } from "./fuel_combustion.ts";
import { gridElectricityFactors } from "./grid_electricity.ts";
import { transportFactors } from "./transport.ts";

export const allFactors: EmissionFactor[] = [
  ...gridElectricityFactors,
  ...fuelCombustionFactors,
  ...transportFactors,
];
