import type { EmissionFactor } from "../types.ts";
import { gridElectricityFactors } from "./grid_electricity.ts";

export const allFactors: EmissionFactor[] = [...gridElectricityFactors];
