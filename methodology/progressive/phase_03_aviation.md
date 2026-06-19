# Phase 3 — Domestic Aviation Factors

NEFDB Phase 3 delivers six Nigeria (`NG`) domestic aviation emission factors:

- Four route-specific factors for the trunk domestic pairs Lagos–Abuja, Lagos–Port Harcourt, Lagos–Kano, and Abuja–Port Harcourt.
- One generic national-average factor for use when the exact route is unknown.
- One optional radiative-forcing multiplier (RF) drawn from Lee et al. (2021) for users who want a non-CO₂ climate-adjustment layer.

All base factors are CO₂-only, Scope 3 business-travel / category 6 proxies, and published under NEFDB version `1.0.0`.

---

## 1. Sources

| Source ID | Title | Publisher / Year | Relevance |
|---|---|---|---|
| `ICAO_ICEC_V13_1` | Methodology ICAO Carbon Emissions Calculator v13.1 | ICAO / 2024 | Core fuel-consumption coefficients, passenger-to-cargo factors, and calculation logic. |
| `NCAA_2022_DOMESTIC` | Executive Summary on International and Domestic Flight Operations (January – December 2022) | Nigeria Civil Aviation Authority / 2023 | Nigeria 2022 domestic passenger and flight totals for context; no aircraft-type or load-factor detail. |
| `LEE_2021_AVIATION_RF` | The contribution of global aviation to anthropogenic climate forcing for 2000 to 2018 | Lee et al., Atmospheric Environment / 2021 | Radiative-forcing multiplier (GTP₅₀ contrail-cirrus, km basis). |
| `AFRAA_2023_AR` | African Airlines Annual Report 2023 | AFRAA / 2024 | Africa passenger load factor (71.6% in 2022) used to anchor the 72% assumption. |
| `OURAIRPORTS` | OurAirports airport data | OurAirports / 2026 | WGS-84 coordinates for Lagos, Abuja, Port Harcourt, and Kano airports. |

---

## 2. Numbered Derivation Steps

### 2.1 Airport coordinates and great-circle distances

Airport coordinates were taken from OurAirports in WGS-84. Great-circle distances were computed with the haversine formula on a spherical Earth radius of 6,371 km:

```
a = sin²(Δφ/2) + cos(φ1) × cos(φ2) × sin²(Δλ/2)
c = 2 × atan2(√a, √(1−a))
gc_km = R × c
```

Route distances:

| Route | Origin | Destination | Great-circle (km) |
|---|---|---|---|---:|
| LOS–ABV | Lagos (DNMM) | Abuja (DNAA) | 511.42 |
| LOS–PHC | Lagos (DNMM) | Port Harcourt (DNPO) | 437.35 |
| LOS–KAN | Lagos (DNMM) | Kano (DNKN) | 833.86 |
| ABV–PHC | Abuja (DNAA) | Port Harcourt (DNPO) | 445.16 |

### 2.2 9% ICAO uplift to obtain stage length

The ICAO standard 9% uplift is applied to great-circle distance to obtain the flown stage length used in fuel-burn modelling:

```
stage_length_km = gc_km × 1.09
stage_length_nm = stage_length_km / 1.852
```

| Route | Uplifted (km) | Uplifted (nm) |
|---|---|---:|
| LOS–ABV | 557.4 | 301.0 |
| LOS–PHC | 476.7 | 257.4 |
| LOS–KAN | 908.9 | 490.8 |
| ABV–PHC | 485.2 | 262.0 |

### 2.3 Representative aircraft selection

Phase 3 adopts a single representative aircraft because NCAA 2022 does not publish aircraft-type or seat-capacity data by route and Nigerian domestic routes are served by a mixed narrow-body / regional-jet fleet.

| Parameter | Value | Basis |
|---|---|---|
| Representative aircraft | Boeing 737-500 | Dominant in Air Peace 2022 domestic fleet; documented 114-seat config; ICAO ICEC code `735`. |
| Seats | 114 | Air Peace configuration: 12 business + 102 economy. |
| Load factor | 72% | 2022 Africa average 71.6% (AFRAA citing IATA); slight premium for Nigerian trunk routes. |

### 2.4 ICAO ICEC v13.1 Appendix C fuel-consumption coefficients for code `735`

From ICAO ICEC v13.1 Appendix C, page 16, the fuel-consumption row for aircraft equivalent code `735` (Boeing 737-500) is:

| Stage length (nm) | 125 | 250 | 500 | 750 | 1000 | 1500 | 2000 | 2500 | 3000 | 3500 | 4000 |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Fuel consumption (kg) | 1539 | 3153 | 4207 | 5694 | 7119 | 9850 | 12477 | 15033 | 17535 | 19995 | 22421 |

### 2.5 Linear interpolation per route stage length

All four routes fall between 250 nm and 500 nm, so linear interpolation is used:

```
fuel_kg(x) = 3153 + (4207 − 3153) × (x − 250) / (500 − 250)
```

| Route | Uplifted (nm) | Interpolated fuel (kg) |
|---|---|---:|
| LOS–ABV | 301.0 | 3,368.02 |
| LOS–PHC | 257.4 | 3,184.20 |
| LOS–KAN | 490.8 | 4,168.21 |
| ABV–PHC | 262.0 | 3,203.59 |

### 2.6 CO₂ conversion

Jet fuel is converted to CO₂ using the standard aviation conversion:

```
co2_kg = fuel_kg × 3.16
```

(3.16 kg CO₂ per kg jet fuel, consistent with ICAO ICEC and close to EUROCONTROL / IATA values.)

### 2.7 Passenger attribution

Total flight CO₂ is attributed to passengers using the Intra-Africa passenger-to-cargo factor from ICAO ICEC v13.1 Appendix A:

```
kgCO2_per_passenger_km = fuel_kg × 3.16 × 0.8432 / (seats × load_factor × uplifted_km)
```

Where:

- `seats = 114`
- `load_factor = 0.72`
- `passenger_to_cargo_factor = 0.8432` (ICAO ICEC v13.1 Intra-Africa)

This produces the route-specific per-passenger-kilometre emission factors.

### 2.8 Generic factor

The generic domestic aviation factor is the arithmetic mean of the four route factors and is recommended when the exact route is unknown.

---

## 3. Final Factor Table

| # | Factor ID | Route | Value | Unit | Confidence | Uncertainty |
|---:|---|---|---|---:|---|---|
| 1 | `ng.aviation.domestic.los_abv` | Lagos – Abuja | 0.1962 | kgCO₂/passenger-km | medium | ±25% |
| 2 | `ng.aviation.domestic.los_phc` | Lagos – Port Harcourt | 0.2169 | kgCO₂/passenger-km | medium | ±25% |
| 3 | `ng.aviation.domestic.los_kan` | Lagos – Kano | 0.1489 | kgCO₂/passenger-km | medium | ±25% |
| 4 | `ng.aviation.domestic.abv_phc` | Abuja – Port Harcourt | 0.2144 | kgCO₂/passenger-km | medium | ±25% |
| 5 | `ng.aviation.domestic.generic` | Nigeria domestic average | 0.1940 | kgCO₂/passenger-km | medium | ±25% |
| 6 | `ng.aviation.domestic.rf_multiplier` | Radiative-forcing multiplier | 1.9 | multiplier | low | — |

Values in the final registry are rounded to four decimal places.

---

## 4. RF Multiplier

NEFDB includes the optional radiative-forcing multiplier `ng.aviation.domestic.rf_multiplier` with value **1.9**, sourced from Lee et al. (2021), Table F.1a, row **"Contrail cirrus (km basis)"**, column **GTP₅₀**.

- **Usage is optional.** The base route factors are CO₂-only.
- When the RF multiplier is requested, multiply the CO₂-only result by 1.9:
  ```
  kgCO2e_rf = kgCO2_only × 1.9
  ```
- The multiplier is **not baked into** the base factor values.
- Confidence is **low** because the value is metric- and time-horizon-dependent; total aviation multipliers in Lee et al. range from 1.0 (GTP₅₀) to 4.0 (GWP₂₀).

---

## 5. Data Quality Flags

| Flag | Affected factors | Description |
|---|---|---|
| `ICAO_ICEC_PRIMARY` | All route factors | Fuel-consumption coefficients and passenger-to-cargo factor taken from ICAO ICEC v13.1. |
| `REPRESENTATIVE_AIRCRAFT` | All route factors | Boeing 737-500 (114 seats) used as a single representative aircraft for the mixed Nigerian domestic fleet. |
| `LOAD_FACTOR_ASSUMED` | All route factors | 72% load factor assumed from AFRAA/IATA Africa 2022 average (71.6%) plus small trunk-route premium; NCAA 2022 does not provide load factor. |
| `NO_NIGERIA_ROUTE_FUEL_DATA` | All route factors | No Nigeria-specific fuel-burn measurements by route; calculation depends on ICAO global aircraft coefficients. |
| `GREAT_CIRCLE_UPPLIFT` | All route factors | Route lengths are great-circle distances uplifted by 9%; actual flight paths and holding/circuit patterns may differ. |
| `RF_OPTIONAL` | `ng.aviation.domestic.rf_multiplier` | Radiative-forcing multiplier is a separate, optional climate-adjustment layer, not included in base CO₂ values. |
| `AFRICA_BENCHMARK` | Load factor and cargo factor | Intra-Africa passenger-to-cargo factor and Africa load-factor benchmark used due to lack of Nigeria-specific data. |

---

## 6. Files Produced

- `src/factors/aviation.ts` — canonical aviation factor records.
- `src/api/aviation.ts` — ergonomic `nefdb.aviation.*` helpers.
- `src/index.ts` — public API exports (updated).
- `src/sources/index.ts` — canonical source registry (updated with Phase 3 aviation sources).
- `tests/schema.test.ts` — completeness and API tests (updated).
- `methodology/progressive/phase_03_aviation.md` — this document.
- Derived inputs:
  - `datasets/transport_aviation/derived/route_distances_phase3.md`
  - `datasets/transport_aviation/derived/route_distances_phase3.csv`
  - `datasets/transport_aviation/derived/aviation_ef_calculation_phase3.md`
- Documentation:
  - `docs/transport_aviation/aircraft_loadfactor_phase3.md`
  - `docs/transport_aviation/rf_multiplier_phase3.md`
  - `docs/transport_aviation/sources_index_phase3.md`
- Exported data:
  - `data/nefdb_v1.csv`
  - `data/nefdb_v1.json`
