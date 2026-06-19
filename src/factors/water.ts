import type { EmissionFactor } from "../types.ts";

export const waterFactors: EmissionFactor[] = [
  {
    id: "ng.water.treatment.supply",
    category: "water",
    subcategory: "water_supply",
    description:
      "Scope 2 emission factor for treated water supply in Nigeria, per cubic metre supplied",
    value: 0.103,
    unit: "kgCO2e_per_m3",
    gas: null,
    gwp_basis: "AR5",
    scope: 2,
    data_year: 2024,
    published_year: 2026,
    country: "NG",
    region: "NG",
    source: {
      id: "DEFRA_2024_FULL",
      title: "UK DESNZ/DEFRA 2024 GHG Conversion Factors Full Set",
      publisher: "UK DESNZ",
      year: 2024,
    },
    additional_sources: [
      {
        id: "NEFDB_RECONCILED_GENERATION_2024",
        title: "Nigeria Generation Mix Reconciled 2024",
        publisher: "NEFDB",
        year: 2024,
      },
    ],
    uncertainty_pct: 30,
    confidence: "medium",
    methodology_note:
      "DEFRA 2024 water supply factor 0.15311 kgCO2e/m3 ÷ UK grid 0.20705 kgCO2e/kWh → 0.739 kWh/m3; × Nigeria grid ng.grid.national.location.2024 (0.138611) → 0.103.",
    nefdb_version: "1.0.0",
  },
  {
    id: "ng.water.treatment.wastewater",
    category: "water",
    subcategory: "water_wastewater_treatment",
    description:
      "Scope 2 emission factor for wastewater treatment services in Nigeria, per cubic metre treated",
    value: 0.124,
    unit: "kgCO2e_per_m3",
    gas: null,
    gwp_basis: "AR5",
    scope: 2,
    data_year: 2024,
    published_year: 2026,
    country: "NG",
    region: "NG",
    source: {
      id: "DEFRA_2024_FULL",
      title: "UK DESNZ/DEFRA 2024 GHG Conversion Factors Full Set",
      publisher: "UK DESNZ",
      year: 2024,
    },
    additional_sources: [
      {
        id: "NEFDB_RECONCILED_GENERATION_2024",
        title: "Nigeria Generation Mix Reconciled 2024",
        publisher: "NEFDB",
        year: 2024,
      },
    ],
    uncertainty_pct: 30,
    confidence: "medium",
    methodology_note:
      "DEFRA 2024 water treatment factor 0.18574 kgCO2e/m3 ÷ UK grid 0.20705 → 0.897 kWh/m3; × Nigeria grid 0.138611 → 0.124.",
    nefdb_version: "1.0.0",
  },
];
