export interface EmissionFactor {
  id: string;
  category: FactorCategory;
  subcategory: string;
  description: string;
  value: number;
  unit: FactorUnit;
  gas: GasBreakdown | null;
  gwp_basis: "AR5" | "AR6";
  scope: 1 | 2 | "1_and_2";
  data_year: number;
  published_year: number;
  country: "NG";
  region?: string;
  disco?: DisCo;
  source: SourceReference;
  additional_sources?: SourceReference[];
  uncertainty_pct?: number;
  confidence: "high" | "medium" | "low";
  methodology_note: string;
  nefdb_version: string;
  deprecated?: boolean;
  superseded_by?: string;
}

export interface SourceReference {
  id: string;
  title: string;
  publisher: string;
  year: number;
  url?: string;
  page?: string;
  access_date?: string;
}

export interface GasBreakdown {
  CO2: number;
  CH4: number;
  N2O: number;
}

export const FACTOR_CATEGORIES = [
  "grid_electricity",
  "fuel_combustion",
  "transport",
  "aviation",
  "waste",
  "water",
] as const;

export type FactorCategory = (typeof FACTOR_CATEGORIES)[number];

export const FACTOR_UNITS = [
  "kgCO2e_per_kWh",
  "kgCO2e_per_litre",
  "kgCO2e_per_kg",
  "kgCO2e_per_m3",
  "kgCO2e_per_tonne",
  "kgCO2e_per_km",
  "kgCO2e_per_passenger_km",
  "kgCO2e_per_person_year",
  "multiplier",
] as const;

export type FactorUnit = (typeof FACTOR_UNITS)[number];

export const DISCOS = [
  "AEDC",
  "BEDC",
  "EKEDC",
  "EEDC",
  "IBEDC",
  "IEDC",
  "JEDC",
  "KDEDC",
  "KEDC",
  "PEDC",
  "YEDC",
] as const;

export type DisCo = (typeof DISCOS)[number];

export interface QueryOptions {
  withSource?: boolean;
  full?: boolean;
}

export type MinimalFactor = Pick<
  EmissionFactor,
  "id" | "value" | "unit"
>;

export type FactorWithSource = Pick<
  EmissionFactor,
  "id" | "value" | "unit" | "source"
>;
