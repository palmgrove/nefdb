# Phase 2 — Fuel Combustion Factors

NEFDB Phase 2 delivers the first 16 fuel-combustion and road-transport emission factors:

- 8 stationary-combustion factors (diesel, petrol, LPG, CNG, natural gas, HFO), including two diesel kWh variants.
- 8 road-transport factors: 2 fuel-based primary factors (petrol and diesel per litre) and 6 optional distance-based factors (car, motorcycle, bus, light truck, heavy truck).

All factors are Scope 1, Nigeria (`NG`), and published under NEFDB version `1.0.0`.

---

## 1. Stationary Combustion Factors

### 1.1 Sources

| Source ID | Document | Publisher | Year | Relevance |
|---|---|---|---|---|
| `IPCC_2006_VOL2_CH2` | IPCC 2006 Guidelines Vol 2 Ch 2 Stationary Combustion | IPCC | 2006 | Methodology and default EFs (Table 2.2). |
| `DEFRA_2024_FULL` | UK DESNZ/DEFRA 2024 GHG Conversion Factors Full Set | UK DESNZ | 2024 | Primary per-unit values for diesel, petrol, LPG, CNG, natural gas, HFO. |
| `EPA_GHG_HUB_2024` | EPA GHG Emission Factors Hub 2024 | US EPA | 2024 | Cross-check for liquid-fuel factors. |
| `SOMORIN_2017` | Life cycle assessment of self-generated electricity in Nigeria | Somorin et al., Renewable Energy | 2017 | Nigeria SGE context for the 28% field-efficiency assumption. |
| `NNPC_STATS_2023` | NNPC Annual Statistics Bulletin S3 | NNPC | 2023 | Nigeria fuel-consumption context. |

### 1.2 Extraction table

| Factor ID | Fuel | Value | Unit | Primary source | Cross-check values | Confidence | Uncertainty |
|---|---|---:|---|---|---|---|---|
| `ng.fuel.diesel.stationary` | Diesel (gas/diesel oil) | 2.662 | kgCO2e/litre | DEFRA 2024 100% mineral diesel | IPCC 2006: 2.655; EPA 2024: 2.706 | high | ±10% |
| `ng.fuel.petrol.stationary` | Petrol (motor gasoline) | 2.354 | kgCO2e/litre | DEFRA 2024 100% mineral petrol | IPCC 2006: 2.299; EPA 2024: 2.328 | high | ±10% |
| `ng.fuel.lpg.stationary` | LPG | 1.557 | kgCO2e/litre | DEFRA 2024 LPG | IPCC 2006: 1.582; EPA 2024: 1.506 | high | ±10% |
| `ng.fuel.cng.stationary` | CNG | 2.568 | kgCO2e/kg | DEFRA 2024 CNG | — | medium | ±15% |
| `ng.fuel.naturalgas.stationary` | Natural gas | 2.045 | kgCO2e/m3 | DEFRA 2024 natural gas | IPCC 2006 Table 2.4 with DEFRA NCV: 2.044 | high | ±10% |
| `ng.fuel.hfo.stationary` | Heavy fuel oil | 3.175 | kgCO2e/litre | DEFRA 2024 fuel oil | IPCC 2006: 3.084; EPA 2024: 2.987 | medium | ±15% |

DEFRA 2024 raw values (full set v1.1):

| Fuel | kgCO2e/unit | kgCO2e/kWh NCV | Density | NCV |
|---|---:|---:|---:|---:|
| Diesel | 2.66155 / L | 0.26808 | 830.565 kg/m3 | 43.028 GJ/t |
| Petrol | 2.35372 / L | 0.25460 | 746.269 kg/m3 | 44.599 GJ/t |
| LPG | 1.55713 / L | 0.23031 | 529.749 kg/m3 | 45.944 GJ/t |
| Fuel oil | 3.17493 / L | 0.28523 | 983.284 kg/m3 | 40.752 GJ/t |
| Natural gas | 2.04542 / m3 | 0.20264 | 0.796 kg/m3 | 45.627 GJ/t |
| CNG | 2,568.16 / t (= 2.56816 / kg) | — | 175 kg/m3 | 45.627 GJ/t |

The IPCC 2006 corroboration is obtained by applying Table 2.2 CO2/CH4/N2O emission factors (kg/TJ, AR5 GWP) to the DEFRA density and NCV values.

### 1.3 Diesel kWh variants

The per-kWh diesel factors convert the per-litre factor into an electricity-output emission factor using standard generator efficiency physics.

```
kgCO2e/kWh_e = per_litre_kgCO2e/L / (kWh_thermal_per_L × electrical_efficiency)
```

DEFRA 2024 gives **9.927 kWh thermal per litre** of diesel.

**Rated efficiency (33%)**

```
2.662 / (9.927 × 0.33)
= 2.662 / 3.27591
= 0.8129
≈ 0.813 kgCO2e/kWh
```

**Field efficiency (28%)**

```
2.662 / (9.927 × 0.28)
= 2.662 / 2.77956
= 0.9577
≈ 0.958 kgCO2e/kWh
```

The 33% and 28% efficiency values are NEFDB operational assumptions. The local copy of Somorin et al. (2017) does not state 28% explicitly; it reports 1,625 kg CO2e/MWh for 5 kVA self-generated electricity in Nigeria, which is consistent with low-efficiency operation. The 28% assumption is therefore used as the **recommended default** for Nigeria's aged on-site genset fleet.

---

## 2. Road Transport Factors

### 2.1 Sources

| Source ID | Document | Publisher | Year | Relevance |
|---|---|---|---|---|
| `IPCC_2006_VOL2_CH3` | IPCC 2006 Guidelines Vol 2 Ch 3 Mobile Combustion | IPCC | 2006 | Methodology and default road-vehicle EFs. |
| `DEFRA_2024_FULL` | UK DESNZ/DEFRA 2024 GHG Conversion Factors Full Set | UK DESNZ | 2024 | Primary per-litre values and per-km vehicle proxies. |
| `EPA_GHG_HUB_2024` | EPA GHG Emission Factors Hub 2024 | US EPA | 2024 | Cross-check for fuel-based factors. |
| `ICCT_SOOTFREE_2019` | Soot-Free Transport for Nigeria | ICCT | 2019 | Nigeria fleet-age/condition context. |
| `WB_LOW_CARBON_DEVELOPMENT_NIGERIA_2013` | Assessing Low-Carbon Development in Nigeria: An Analysis of Four Sectors | World Bank | 2013 | Nigeria annual-km defaults for optional stock-based calculations. |

### 2.2 Fuel-based factors (primary)

| Factor ID | Fuel | Value | Unit | Primary source | Confidence | Uncertainty |
|---|---|---:|---|---|---|---|
| `ng.transport.road.petrol.per_litre` | Petrol | 2.354 | kgCO2e/litre | DEFRA 2024, corroborated by IPCC 2006 Vol2 Ch3 | high | ±10% |
| `ng.transport.road.diesel.per_litre` | Diesel | 2.662 | kgCO2e/litre | DEFRA 2024, corroborated by IPCC 2006 Vol2 Ch3 | high | ±10% |

These are the **recommended** road-transport factors for Nigerian reporting because fuel purchase/consumption data is generally more reliable than vehicle-kilometre estimates.

### 2.3 Distance-based factors (optional proxies)

No direct Nigeria vehicle-kilometre or test-cycle data exists in public sources. The distance-based factors are therefore UK DEFRA 2024 per-km proxies, used when activity data is available in kilometres. They must be flagged with lower confidence.

| Factor ID | Vehicle type | Fuel | DEFRA 2024 source value | Value | Unit | Confidence | Uncertainty |
|---|---|---|---|---:|---|---|---|
| `ng.transport.road.petrol.car` | Passenger car | Petrol | 0.1645 kgCO2e/km | 0.165 | kgCO2e/km | medium | ±20% |
| `ng.transport.road.diesel.car` | Passenger car | Diesel | 0.16984 kgCO2e/km | 0.170 | kgCO2e/km | medium | ±20% |
| `ng.transport.road.petrol.motorcycle` | Motorcycle | Petrol | 0.11367 kgCO2e/km | 0.114 | kgCO2e/km | low | ±30% |
| `ng.transport.road.diesel.bus` | Urban bus | Diesel | 0.10846 kgCO2e/passenger-km × 30 passengers | 3.254 | kgCO2e/km | low | ±35% |
| `ng.transport.road.diesel.truck.small` | Light van | Diesel | 0.25023 kgCO2e/km | 0.250 | kgCO2e/km | medium | ±20% |
| `ng.transport.road.diesel.truck.heavy` | Heavy goods vehicle | Diesel | 0.87296 kgCO2e/km | 0.873 | kgCO2e/km | medium | ±20% |

For all distance-based factors except the bus, the committed value is the DEFRA 2024 per-km value rounded to three decimals. For the bus, the vehicle-km value is obtained from the DEFRA passenger-km factor multiplied by a 30-passenger occupancy assumption:

```
0.10846 kgCO2e/passenger-km × 30 passengers = 3.2538 kgCO2e/km
≈ 3.254 kgCO2e/km
```

### 2.4 World Bank 2013 annual-km defaults

The World Bank (2013) *Assessing Low-Carbon Development in Nigeria* provides annual-kilometre defaults from a 2010–2012 Nigeria survey. These are **not used in the per-km factors** but are recorded for users who have vehicle-stock data and need total annual emissions:

| Vehicle category | Annual km/vehicle |
|---|---:|
| Motorcycle / two-wheeler | 7,000 |
| Passenger car | 17,000 |
| Light commercial vehicle / danfo minibus | 30,000 |
| Urban bus | 30,000 |
| Long-distance coach | 45,000 |
| Heavy goods vehicle / truck | 33,500 |

---

## 3. Complete Factor Inventory — Phase 2

| # | Factor ID | Value | Unit | Confidence | Uncertainty |
|---:|---|---:|---|---|---|
| 1 | `ng.fuel.diesel.stationary` | 2.662 | kgCO2e/litre | high | ±10% |
| 2 | `ng.fuel.diesel.stationary.kwh.rated` | 0.813 | kgCO2e/kWh | medium | ±15% |
| 3 | `ng.fuel.diesel.stationary.kwh.field` | 0.958 | kgCO2e/kWh | medium | ±18% |
| 4 | `ng.fuel.petrol.stationary` | 2.354 | kgCO2e/litre | high | ±10% |
| 5 | `ng.fuel.lpg.stationary` | 1.557 | kgCO2e/litre | high | ±10% |
| 6 | `ng.fuel.cng.stationary` | 2.568 | kgCO2e/kg | medium | ±15% |
| 7 | `ng.fuel.naturalgas.stationary` | 2.045 | kgCO2e/m3 | high | ±10% |
| 8 | `ng.fuel.hfo.stationary` | 3.175 | kgCO2e/litre | medium | ±15% |
| 9 | `ng.transport.road.petrol.per_litre` | 2.354 | kgCO2e/litre | high | ±10% |
| 10 | `ng.transport.road.diesel.per_litre` | 2.662 | kgCO2e/litre | high | ±10% |
| 11 | `ng.transport.road.petrol.car` | 0.165 | kgCO2e/km | medium | ±20% |
| 12 | `ng.transport.road.diesel.car` | 0.170 | kgCO2e/km | medium | ±20% |
| 13 | `ng.transport.road.petrol.motorcycle` | 0.114 | kgCO2e/km | low | ±30% |
| 14 | `ng.transport.road.diesel.bus` | 3.254 | kgCO2e/km | low | ±35% |
| 15 | `ng.transport.road.diesel.truck.small` | 0.250 | kgCO2e/km | medium | ±20% |
| 16 | `ng.transport.road.diesel.truck.heavy` | 0.873 | kgCO2e/km | medium | ±20% |

---

## 4. Data Quality Flags

| Flag | Affected factors | Description |
|---|---|---|
| `DEFRA_PRIMARY` | All Phase 2 factors except bus | Per-unit value taken directly from DEFRA 2024. |
| `IPCC_CORROBORATED` | All stationary and fuel-based road factors | IPCC 2006 default EFs agree within ~1–3%. |
| `SOMORIN_CONTEXT` | `ng.fuel.diesel.stationary.kwh.field` | 28% field efficiency is a NEFDB assumption informed by Somorin et al. 2017 Nigeria SGE findings. |
| `UK_PROXY` | All distance-based road factors | UK DEFRA per-km values used as Nigeria proxy; local VKT data unavailable. |
| `BUS_OCCUPANCY_ASSUMED` | `ng.transport.road.diesel.bus` | Passenger-km to vehicle-km conversion uses 30-passenger occupancy assumption. |
| `WB_2013_VKT_DEFAULT` | Distance-based road factors | Annual-km defaults recorded for stock-based estimates, not per-km derivation. |
| `NO_NIGERIA_FUEL_SPEC` | CNG, natural gas | Per-m3 and per-kg values assume UK/DEFRA gas density; Nigerian gas composition may differ. |

---

## 5. Files Produced

- `src/factors/fuel_combustion.ts` — canonical stationary-combustion records.
- `src/factors/transport.ts` — canonical road-transport records.
- `src/factors/index.ts` — aggregates grid, fuel-combustion, and transport arrays.
- `src/api/fuel.ts` — ergonomic `nefdb.fuel.*` helpers.
- `src/api/transport.ts` — ergonomic `nefdb.transport.road(...)` helper.
- `src/index.ts` — public API exports.
- `src/sources/index.ts` — canonical source registry (updated with `WB_LOW_CARBON_DEVELOPMENT_NIGERIA_2013`).
- `tests/schema.test.ts` — completeness and API tests.
- `methodology/progressive/phase_02_fuel_combustion.md` — this document.
- Derived inputs:
  - `datasets/fuel_combustion/derived/stationary_fuel_factors.csv`
  - `datasets/fuel_combustion/derived/diesel_kwh_calculation.md`
  - `datasets/transport_aviation/derived/road_fuel_factors.csv`
  - `datasets/transport_aviation/derived/road_distance_factors.csv`
  - `datasets/transport_aviation/derived/road_distance_calculation.md`
- Exported data:
  - `data/nefdb_v1.csv`
  - `data/nefdb_v1.json`
