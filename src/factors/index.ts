import type { EmissionFactor } from "../types.ts";
import { aviationFactors } from "./aviation.ts";
import { fuelCombustionFactors } from "./fuel_combustion.ts";
import { gridElectricityFactors } from "./grid_electricity.ts";
import { transportFactors } from "./transport.ts";

export const allFactors: EmissionFactor[] = [
  ...aviationFactors,
  ...gridElectricityFactors,
  ...fuelCombustionFactors,
  ...transportFactors,
];
