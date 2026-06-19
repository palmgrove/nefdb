# Phase 1 — Grid Electricity Emission Factors

NEFDB Phase 1 delivers the first 15 grid-electricity emission factors:

- 3 national-grid margin factors from WAPP ASB0034-2021 (operating, build, combined).
- 1 national-grid location-based factor derived from 2020 plant-level generation records.
- 11 DisCo-level location-based factors derived from Q2 2024 billed energy and regional generation-mix assumptions.

All values are Scope 2, Nigeria (`NG`), and published under NEFDB version `1.0.0`.

---

## 1. WAPP ASB0034-2021 National Grid Margin Factors

### 1.1 Source

- **Primary:** `WAPP_ASB0034_2021` — *Standardized Baseline for WAPP including Nigeria (ASB0034-2021)*, UNFCCC / WAPP, 2021, Section 7, Table 1.
- **Corroboration:** `WAPP_ASB0034_ASSESSMENT` — *Assessment Report ASU006 ASB0034 WAPP*, UNFCCC / WAPP, 2021.
- **Methodology:** `UNFCCC_CDM_TOOL07` — *UNFCCC CDM Methodological Tool 07 v7.0*, 2021.

### 1.2 Extracted values

| Factor ID | Subcategory | Value (kgCO2e/kWh) | Data year | Confidence | Uncertainty |
|---|---|---:|---|---|---|
| `ng.grid.national.om.2021` | `national_grid_operating_margin` | 0.578 | 2019 | high | ±10% |
| `ng.grid.national.bm.2021` | `national_grid_build_margin` | 0.556 | 2019 | high | ±10% |
| `ng.grid.national.cm.2021` | `national_grid_combined_margin` | 0.573 | 2019 | high | ±10% |

### 1.3 Unit conversion

The source publishes factors in **tCO2/MWh**. Because:

```
1 tCO2 = 1,000 kgCO2
1 MWh = 1,000 kWh
```

the conversion to kgCO2e/kWh is 1:1. No GWP adjustment is required because these factors are CO2-only.

### 1.4 Combined-margin cross-check

TOOL07 v7.0 Equation 16:

```
EFgrid,CM,y = EFgrid,OM,y × wOM + EFgrid,BM,y × wBM
```

For wind/solar projects, first crediting period: `wOM = 0.75`, `wBM = 0.25`.

```
0.578 × 0.75 + 0.556 × 0.25 = 0.4335 + 0.1390 = 0.5725 → 0.573 tCO2/MWh
```

This matches ASB0034-2021 Table 1 exactly.

---

## 2. National Grid Location-Based Emission Factor

### 2.1 Source

- **Primary:** `ENERGY_DATABANK_GENERATION` — *Nigerian Energy Data Bank — Power Plant Generation Statistics*, Federal Ministry of Energy / Energy Data Bank, 2024.
- **Methodology:** `IPCC_2006_VOL2_CH2` — *IPCC 2006 Guidelines Vol 2 Ch 2 Stationary Combustion*.
- **Cross-check:** `NERC_2024_ANNUAL` — *NERC 2024 Annual Report*.

### 2.2 Factor

| Factor ID | Value (kgCO2e/kWh) | Data year | Confidence | Uncertainty |
|---|---|---:|---|---|---|
| `ng.grid.national.location.2020` | 0.5717 | 2020 | low | ±20% |

### 2.3 Input data (2020)

| Fuel | Generation (GWh) | Confidence flag |
|---|---|---:|:---|
| Gas | 7,281.71119 | high |
| Hydro | 75.59301 | low |
| Oil / solar / wind / coal / biomass / other | 0.00000 | low |

**Total generation used in denominator:** 7,357.30420 GWh.

**Important limitation:** The hydro total is only 75.59 GWh because the Kainji, Jebba and Shiroro records for 2020 carried non-MWh units (`MW` / `Bill.Cubic Meter`) and were excluded. Independent NERC/TCN estimates put 2020 hydro at roughly 8,500–9,500 GWh. The gas total is also limited to the eight NIPP/IPPs with valid MWh records after correcting the `ELPD_NESCO_GEN` unit error.

### 2.4 Methodology

Following the UNFCCC "Tool to calculate the emission factor for an electricity system":

```
fuel_input_energy = electricity_generated / thermal_efficiency
emissions = fuel_input_energy × emission_factor
```

Assumptions:

- Gas thermal efficiency: **35%** (representative for Nigerian simple-cycle gas turbines; literature range 28–34%, NERC MYTO benchmark ≈36%).
- IPCC 2006 default EFs for natural gas:
  - CO2: 56,100 kg/TJ
  - CH4: 1 kg/TJ
  - N2O: 0.1 kg/TJ
- GWP basis: AR6 (CH4 = 28, N2O = 265).
- Hydro / solar / wind = zero emissions.

### 2.5 Step-by-step arithmetic

**Gas:**

```
Generation: 7,281.71119 GWh
Useful output: 7,281.71119 × 3.6 = 26,214.1603 TJ
Fuel input (η = 0.35): 26,214.1603 / 0.35 = 74,897.6008 TJ
CO2: 74,897.6008 × 56,100 = 4,201,755,406 kg = 4,201.755 ktCO2
CH4: 74,897.6008 × 1 = 74,897.6 kg = 0.07490 ktCH4 → 0.07490 × 28 = 2.097 ktCO2e
N2O: 74,897.6008 × 0.1 = 7,489.8 kg = 0.00749 ktN2O → 0.00749 × 265 = 1.984 ktCO2e
Gas total GHG = 4,201.755 + 2.097 + 1.984 = 4,205.836 ktCO2e
```

**National factor:**

```
EF = 4,205.836 ktCO2e / 7,357.304 GWh
EF = 4,205,836,000 kgCO2e / 7,357,304,000 kWh
EF = 0.57165 kgCO2e/kWh
```

Stored value: **0.5717 kgCO2e/kWh**.

### 2.6 Limitations and flags

| Issue | Impact |
|---|---|
| Incomplete generation coverage (missing large hydro and other thermal plants) | High; denominator understated, renewable share under-counted. |
| Gas thermal efficiency assumed at 35% | Medium; ±5 percentage points changes the factor by roughly ±8%. |
| IPCC default CO2 EF range for natural gas (54,300–58,300 kg/TJ) | Low-to-medium (≈ ±4%). |
| CH4/N2O GWP choice (AR6) | Negligible (<0.2% of final value). |

**Recommended before using for reporting:** incorporate NERC/TCN official national generation-by-fuel totals, add plant-specific thermal efficiencies, then supersede this Phase 1 value.

---

## 3. DisCo-Level Location-Based Emission Factors

### 3.1 Source

- **Primary:** `NBS_ELECTRICITY_DATA_2015_Q2_2024` — *Nigeria Electricity Data 2015–Q2 2024*, NBS, 2024.
- **Generation mix anchor:** `ENERGY_DATABANK_GENERATION` — *Nigerian Energy Data Bank — Power Plant Generation Statistics*, 2024.
- **Methodology:** `IPCC_2006_VOL2_CH2`.

### 3.2 Methodology

For each DisCo:

1. Take Q2 2024 billed energy (GWh) from NBS data.
2. Assign a regional gas/hydro mix based on the DisCo's service territory and proximity to hydro (Kainji/Jebba/Shiroro) versus gas (Niger Delta / NIPP plants). Oil, solar and other generation are treated as zero in Phase 1.
3. Apply the natural-gas EF derived from IPCC 2006 stationary-combustion defaults (AR5 GWP: CH4 = 28, N2O = 265):

```
EF_DisCo = (gas_pct × EF_gas) + (hydro_pct × 0)
EF_gas = 0.202156 kgCO2e/kWh
```

Derived natural-gas EF:

```
CO2: 56100 kg/TJ × 3.6 MJ/kWh / 10^6 = 0.201960 kg/kWh
CH4: 1 kg/TJ × 3.6 / 10^6 = 0.000003600 kg/kWh × 28 = 0.00010080 kgCO2e/kWh
N2O: 0.1 kg/TJ × 3.6 / 10^6 = 0.000000360 kg/kWh × 265 = 0.00009540 kgCO2e/kWh
Total gas = 0.202156 kgCO2e/kWh
```

### 3.3 DisCo billed energy and regional mix

| DisCo | Billed energy (GWh) | Gas % | Hydro % | Region |
|---|---:|---:|---:|:---|
| AEDC | 301.000000 | 70 | 30 | North-Central |
| BEDC | 179.794193 | 76 | 24 | South-South/East |
| EEDC | 159.799076 | 85 | 15 | South-East |
| EKEDC | 317.000000 | 88 | 12 | South (Lagos) |
| IBEDC | 269.530000 | 78 | 22 | South-West |
| IEDC | 360.322343 | 80 | 20 | South-West (Lagos) |
| JEDC | 105.605742 | 68 | 32 | North |
| KDEDC | 83.220000 | 66 | 34 | North-West |
| KEDC | 124.575763 | 65 | 35 | North |
| PEDC | 149.913901 | 90 | 10 | South-South |
| YEDC | 93.852360 | 67 | 33 | North-East |

### 3.4 Data quality note on hydro

The derived plant-level hydro total for 2020 is incomplete because Kainji, Jebba and Shiroro records used non-MWh units. Independent NERC data indicate hydro accounted for roughly 23–27% of grid generation in 2020 and ~32–33% in 2024. Regional hydro shares above are therefore assigned by DisCo territory rather than taken directly from the incomplete plant-level records.

### 3.5 DisCo factors

| Factor ID | DisCo | Value (kgCO2e/kWh) | Confidence | Uncertainty |
|---|---|---:|---|---|
| `ng.grid.disco.aedc.2020` | AEDC | 0.141509 | medium | ±20% |
| `ng.grid.disco.bedc.2020` | BEDC | 0.153639 | medium | ±20% |
| `ng.grid.disco.eedc.2020` | EEDC | 0.171833 | medium | ±20% |
| `ng.grid.disco.ekedc.2020` | EKEDC | 0.177897 | medium | ±20% |
| `ng.grid.disco.ibedc.2020` | IBEDC | 0.157682 | medium | ±20% |
| `ng.grid.disco.iedc.2020` | IEDC | 0.161725 | medium | ±20% |
| `ng.grid.disco.jedc.2020` | JEDC | 0.137466 | medium | ±20% |
| `ng.grid.disco.kdedc.2020` | KDEDC | 0.133423 | medium | ±20% |
| `ng.grid.disco.kedc.2020` | KEDC | 0.131402 | medium | ±20% |
| `ng.grid.disco.pedc.2020` | PEDC | 0.181941 | medium | ±20% |
| `ng.grid.disco.yedc.2020` | YEDC | 0.135445 | medium | ±20% |

### 3.6 National-weighted check

```
Total DisCo billed energy: 2,144.613 GWh
Billed-energy-weighted national gas share: 77.69%
Billed-energy-weighted national hydro share: 22.31%
```

This is consistent with independent NERC-reported 2020 hydro shares of ~23–27% and 2024 shares of ~32–33%, given that DisCo billed energy is a downstream (not generation) weighting.

---

## 4. Complete Factor Inventory — Phase 1

| # | Factor ID | Source/method | Value (kgCO2e/kWh) | Confidence | Uncertainty |
|---:|---|---|---:|---|---|
| 1 | `ng.grid.national.om.2021` | WAPP ASB0034-2021 | 0.578 | high | ±10% |
| 2 | `ng.grid.national.bm.2021` | WAPP ASB0034-2021 | 0.556 | high | ±10% |
| 3 | `ng.grid.national.cm.2021` | WAPP ASB0034-2021 | 0.573 | high | ±10% |
| 4 | `ng.grid.national.location.2020` | Energy Databank + IPCC | 0.5717 | low | ±20% |
| 5 | `ng.grid.disco.aedc.2020` | NBS + regional mix | 0.141509 | medium | ±20% |
| 6 | `ng.grid.disco.bedc.2020` | NBS + regional mix | 0.153639 | medium | ±20% |
| 7 | `ng.grid.disco.eedc.2020` | NBS + regional mix | 0.171833 | medium | ±20% |
| 8 | `ng.grid.disco.ekedc.2020` | NBS + regional mix | 0.177897 | medium | ±20% |
| 9 | `ng.grid.disco.ibedc.2020` | NBS + regional mix | 0.157682 | medium | ±20% |
| 10 | `ng.grid.disco.iedc.2020` | NBS + regional mix | 0.161725 | medium | ±20% |
| 11 | `ng.grid.disco.jedc.2020` | NBS + regional mix | 0.137466 | medium | ±20% |
| 12 | `ng.grid.disco.kdedc.2020` | NBS + regional mix | 0.133423 | medium | ±20% |
| 13 | `ng.grid.disco.kedc.2020` | NBS + regional mix | 0.131402 | medium | ±20% |
| 14 | `ng.grid.disco.pedc.2020` | NBS + regional mix | 0.181941 | medium | ±20% |
| 15 | `ng.grid.disco.yedc.2020` | NBS + regional mix | 0.135445 | medium | ±20% |

---

## 5. Data Quality Flags

| Flag | Affected factors | Description |
|---|---|---|
| `WAPP_DIRECT` | `ng.grid.national.om.2021`, `ng.grid.national.bm.2021`, `ng.grid.national.cm.2021` | Values taken directly from a UNFCCC standardized baseline; highest confidence. |
| `INCOMPLETE_HYDRO` | `ng.grid.national.location.2020`, all DisCo factors | Kainji/Jebba/Shiroro 2020 records excluded due to non-MWh units; hydro share is inferred. |
| `ASSUMED_THERMAL_EFFICIENCY` | `ng.grid.national.location.2020` | 35% gas efficiency assumed. |
| `REGIONAL_MIX_ASSUMED` | All DisCo factors | Gas/hydro split assigned by territory, not direct dispatch data. |
| `NO_TD_LOSSES` | All factors | Transmission and distribution losses are excluded. |
| `NO_UPSTREAM_FUGITIVES` | `ng.grid.national.location.2020`, all DisCo factors | Upstream gas venting/leakage not included. |

---

## 6. Files Produced

- `src/factors/grid_electricity.ts` — canonical TypeScript factor records.
- `src/factors/index.ts` — aggregates all factor category arrays (currently grid electricity only).
- `methodology/progressive/phase_01_grid_electricity.md` — this document.
- Derived inputs:
  - `datasets/grid_electricity/derived/wapp_factors.json`
  - `datasets/grid_electricity/derived/location_based_factor.json`
  - `datasets/grid_electricity/derived/disco_factors.json`
