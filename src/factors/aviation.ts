import type { EmissionFactor } from "../types.ts";

export const aviationFactors: EmissionFactor[] = [
  {
    id: "ng.aviation.domestic.los_abv",
    category: "aviation",
    subcategory: "domestic_route",
    description:
      "Domestic aviation emission factor for Lagos (LOS) to Abuja (ABV) routes, per passenger-km",
    value: 0.1962,
    unit: "kgCO2e_per_passenger_km",
    gas: null,
    gwp_basis: "AR5",
    scope: 1,
    data_year: 2022,
    published_year: 2026,
    country: "NG",
    source: {
      id: "ICAO_ICEC_V13",
      title: "ICAO Carbon Emissions Calculator Methodology v13.1",
      publisher: "ICAO",
      year: 2023,
      page:
        "Boeing 737-500, 9% uplift, 3.16 kg CO2/kg fuel, 114 seats, 72% load factor, 84.32% Intra-Africa passenger-to-cargo factor",
    },
    additional_sources: [
      {
        id: "NCAA_EXEC_2022",
        title: "NCAA Executive Summary Jan-Dec 2022",
        publisher: "NCAA",
        year: 2023,
      },
    ],
    uncertainty_pct: 20,
    confidence: "medium",
    methodology_note:
      "Derived from ICAO ICEC v13.1 using Boeing 737-500 fuel burn with 9% uplift, 3.16 kg CO2/kg fuel, 114 seats, 72% load factor and 84.32% Intra-Africa passenger-to-cargo factor. Rounded to four decimal places.",
    nefdb_version: "1.0.0",
  },
  {
    id: "ng.aviation.domestic.los_phc",
    category: "aviation",
    subcategory: "domestic_route",
    description:
      "Domestic aviation emission factor for Lagos (LOS) to Port Harcourt (PHC) routes, per passenger-km",
    value: 0.2168,
    unit: "kgCO2e_per_passenger_km",
    gas: null,
    gwp_basis: "AR5",
    scope: 1,
    data_year: 2022,
    published_year: 2026,
    country: "NG",
    source: {
      id: "ICAO_ICEC_V13",
      title: "ICAO Carbon Emissions Calculator Methodology v13.1",
      publisher: "ICAO",
      year: 2023,
      page:
        "Boeing 737-500, 9% uplift, 3.16 kg CO2/kg fuel, 114 seats, 72% load factor, 84.32% Intra-Africa passenger-to-cargo factor",
    },
    additional_sources: [
      {
        id: "NCAA_EXEC_2022",
        title: "NCAA Executive Summary Jan-Dec 2022",
        publisher: "NCAA",
        year: 2023,
      },
    ],
    uncertainty_pct: 20,
    confidence: "medium",
    methodology_note:
      "Derived from ICAO ICEC v13.1 using Boeing 737-500 fuel burn with 9% uplift, 3.16 kg CO2/kg fuel, 114 seats, 72% load factor and 84.32% Intra-Africa passenger-to-cargo factor. Rounded to four decimal places.",
    nefdb_version: "1.0.0",
  },
  {
    id: "ng.aviation.domestic.los_kan",
    category: "aviation",
    subcategory: "domestic_route",
    description:
      "Domestic aviation emission factor for Lagos (LOS) to Kano (KAN) routes, per passenger-km",
    value: 0.1489,
    unit: "kgCO2e_per_passenger_km",
    gas: null,
    gwp_basis: "AR5",
    scope: 1,
    data_year: 2022,
    published_year: 2026,
    country: "NG",
    source: {
      id: "ICAO_ICEC_V13",
      title: "ICAO Carbon Emissions Calculator Methodology v13.1",
      publisher: "ICAO",
      year: 2023,
      page:
        "Boeing 737-500, 9% uplift, 3.16 kg CO2/kg fuel, 114 seats, 72% load factor, 84.32% Intra-Africa passenger-to-cargo factor",
    },
    additional_sources: [
      {
        id: "NCAA_EXEC_2022",
        title: "NCAA Executive Summary Jan-Dec 2022",
        publisher: "NCAA",
        year: 2023,
      },
    ],
    uncertainty_pct: 20,
    confidence: "medium",
    methodology_note:
      "Derived from ICAO ICEC v13.1 using Boeing 737-500 fuel burn with 9% uplift, 3.16 kg CO2/kg fuel, 114 seats, 72% load factor and 84.32% Intra-Africa passenger-to-cargo factor. Rounded to four decimal places.",
    nefdb_version: "1.0.0",
  },
  {
    id: "ng.aviation.domestic.abv_phc",
    category: "aviation",
    subcategory: "domestic_route",
    description:
      "Domestic aviation emission factor for Abuja (ABV) to Port Harcourt (PHC) routes, per passenger-km",
    value: 0.2143,
    unit: "kgCO2e_per_passenger_km",
    gas: null,
    gwp_basis: "AR5",
    scope: 1,
    data_year: 2022,
    published_year: 2026,
    country: "NG",
    source: {
      id: "ICAO_ICEC_V13",
      title: "ICAO Carbon Emissions Calculator Methodology v13.1",
      publisher: "ICAO",
      year: 2023,
      page:
        "Boeing 737-500, 9% uplift, 3.16 kg CO2/kg fuel, 114 seats, 72% load factor, 84.32% Intra-Africa passenger-to-cargo factor",
    },
    additional_sources: [
      {
        id: "NCAA_EXEC_2022",
        title: "NCAA Executive Summary Jan-Dec 2022",
        publisher: "NCAA",
        year: 2023,
      },
    ],
    uncertainty_pct: 20,
    confidence: "medium",
    methodology_note:
      "Derived from ICAO ICEC v13.1 using Boeing 737-500 fuel burn with 9% uplift, 3.16 kg CO2/kg fuel, 114 seats, 72% load factor and 84.32% Intra-Africa passenger-to-cargo factor. Rounded to four decimal places.",
    nefdb_version: "1.0.0",
  },
  {
    id: "ng.aviation.domestic.generic",
    category: "aviation",
    subcategory: "domestic_route",
    description:
      "Generic domestic aviation emission factor for Nigeria, arithmetic mean of four domestic routes, per passenger-km",
    value: 0.194,
    unit: "kgCO2e_per_passenger_km",
    gas: null,
    gwp_basis: "AR5",
    scope: 1,
    data_year: 2022,
    published_year: 2026,
    country: "NG",
    source: {
      id: "ICAO_ICEC_V13",
      title: "ICAO Carbon Emissions Calculator Methodology v13.1",
      publisher: "ICAO",
      year: 2023,
      page:
        "Boeing 737-500, 9% uplift, 3.16 kg CO2/kg fuel, 114 seats, 72% load factor, 84.32% Intra-Africa passenger-to-cargo factor",
    },
    additional_sources: [
      {
        id: "NCAA_EXEC_2022",
        title: "NCAA Executive Summary Jan-Dec 2022",
        publisher: "NCAA",
        year: 2023,
      },
    ],
    uncertainty_pct: 20,
    confidence: "medium",
    methodology_note:
      "Arithmetic mean of ng.aviation.domestic.los_abv, ng.aviation.domestic.los_phc, ng.aviation.domestic.los_kan and ng.aviation.domestic.abv_phc. Derived from ICAO ICEC v13.1 using Boeing 737-500 fuel burn with 9% uplift, 3.16 kg CO2/kg fuel, 114 seats, 72% load factor and 84.32% Intra-Africa passenger-to-cargo factor.",
    nefdb_version: "1.0.0",
  },
  {
    id: "ng.aviation.domestic.rf_multiplier",
    category: "aviation",
    subcategory: "rf_multiplier",
    description:
      "Radiative forcing multiplier for domestic aviation non-CO2 climate effects in Nigeria",
    value: 1.9,
    unit: "multiplier",
    gas: null,
    gwp_basis: "AR5",
    scope: 1,
    data_year: 2022,
    published_year: 2026,
    country: "NG",
    source: {
      id: "LEE_ET_AL_2021",
      title: "Contribution of global aviation to anthropogenic climate forcing",
      publisher: "Atmospheric Environment",
      year: 2021,
    },
    uncertainty_pct: 30,
    confidence: "medium",
    methodology_note:
      "Radiative forcing multiplier from Lee et al. (2021) applied to domestic aviation CO2 factors to account for contrails and other non-CO2 effects. Use via nefdb.aviation.route(origin, destination, { rf: true }).",
    nefdb_version: "1.0.0",
  },
];
