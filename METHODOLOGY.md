# Nigeria Emission Factor Database - Methodology

This document combines all Nigeria Emission Factor Database (NEFDB) phase methodology notes into a single reference. Each section covers one methodology domain or validation report, in the order the work was carried out: grid electricity, fuel combustion, transport and aviation, waste and water, and finally the public export and documentation layer. The original standalone phase documents remain in `methodology/progressive/`; this file is the consolidated version.

## Table of Contents

- [Grid Electricity Methodology](#grid-electricity-methodology)
- [Grid Electricity Validation](#grid-electricity-validation)
- [Grid Electricity Validation & Enrichment](#grid-electricity-validation-enrichment)
- [Fuel Combustion Methodology](#fuel-combustion-methodology)
- [Transport & Aviation Methodology](#transport-aviation-methodology)
- [Waste & Water Methodology](#waste-water-methodology)
- [Public Export & Documentation](#public-export-documentation)

# Grid Electricity Methodology

NEFDB Phase 1 delivers the first 15 grid-electricity emission factors:

- 3 national-grid margin factors from WAPP ASB0034-2021 (operating, build, combined).
- 1 national-grid location-based factor derived from the NEFDB reconciled 2024 generation mix.
- 11 DisCo-level location-based factors derived from Q2 2024 billed energy and a 2024 regional generation-mix adjustment.

All values are Scope 2, Nigeria (`NG`), and published under NEFDB version `1.0.0`.

---

## 1. WAPP ASB0034-2021 National Grid Margin Factors

### 1.1 Source

- **Primary:** `WAPP_ASB0034_2021` - *Standardized Baseline for WAPP including Nigeria (ASB0034-2021)*, UNFCCC / WAPP, 2021, Section 7, Table 1.
- **Corroboration:** `WAPP_ASB0034_ASSESSMENT` - *Assessment Report ASU006 ASB0034 WAPP*, UNFCCC / WAPP, 2021.
- **Methodology:** `UNFCCC_CDM_TOOL07` - *UNFCCC CDM Methodological Tool 07 v7.0*, 2021.

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

## 2. National Grid Location-Based Emission Factor (2024)

### 2.1 Source

- **Primary:** `NEFDB_RECONCILED_GENERATION_2024` - *Nigeria Generation Mix Reconciled 2024*, NEFDB, 2024.
- **Underlying total and hydro:** `GUARDIAN_NERC_2024` - *Guardian Nigeria summary of NERC 2024 annual statistics*.
- **Solar / biomass cross-check:** `EMBER_OWID_2024` - *Ember Yearly Electricity Data / Our World in Data energy dataset*.
- **Methodology:** `IPCC_2006_VOL2_CH2` - *IPCC 2006 Guidelines Vol 2 Ch 2 Stationary Combustion*.

### 2.2 Factor

| Factor ID | Value (kgCO2e/kWh) | Data year | Confidence | Uncertainty |
|---|---|---:|---|---|---|
| `ng.grid.national.location.2024` | 0.138611 | 2024 | medium | ±15% |

### 2.3 Input data (2024)

| Fuel | Generation (GWh) | Emissions (ktCO2e) | EF (kgCO2e/kWh) |
|---|---:|---:|---:|
| Gas | 25,433.85 | 5,141.610 | 0.202156 |
| Oil | 0.00 | 0.000 | 0.279515 |
| Hydro | 11,469.85 | 0.000 | 0.000000 |
| Solar | 130.00 | 0.000 | 0.000000 |
| Biomass | 60.00 | 0.000 | 0.000000 |
| Wind / coal / other | 0.00 | 0.000 | 0.000000 |
| **Total** | **37,093.70** | **5,141.610** | **0.138611** |

Gas generation is the residual after hydro, solar and biomass are subtracted from the NERC-sourced total of 37,093.70 GWh. The 2024 hydro share is 30.92%.

### 2.4 Methodology

The factor is a generation-weighted average using the UNFCCC Tool to calculate the emission factor for an electricity system:

```
emissions_per_fuel = generation_gwh × ef_kgco2e_per_kwh
EF = sum(emissions_per_fuel) / total_generation_gwh
```

Assumptions:

- IPCC 2006 default EFs for natural gas (Table 2.2):
  - CO2: 56,100 kg/TJ
  - CH4: 1 kg/TJ
  - N2O: 0.1 kg/TJ
- IPCC 2006 default EFs for residual fuel oil (Table 2.2):
  - CO2: 77,400 kg/TJ
  - CH4: 3 kg/TJ
  - N2O: 0.6 kg/TJ
- GWP basis: AR5 (`CH4 = 28`, `N2O = 265`).
- Hydro, solar, wind, biomass and other generation are treated as zero emissions.

Natural-gas EF derivation:

```
CO2:  56,100 × 3.6 / 10^6 = 0.201960 kgCO2/kWh
CH4:  1 × 3.6 / 10^6 × 28 = 0.00010080 kgCO2e/kWh
N2O:  0.1 × 3.6 / 10^6 × 265 = 0.00009540 kgCO2e/kWh
Total gas EF = 0.202156 kgCO2e/kWh
```

### 2.5 Step-by-step arithmetic

```
Gas emissions:     25,433.85 GWh × 0.202156 = 5,141.610 ktCO2e
Oil emissions:     0 GWh × 0.279515 = 0 ktCO2e
Zero-emission:     11,659.85 GWh (hydro + solar + biomass) = 0 ktCO2e
Total emissions:   5,141.610 ktCO2e
Total generation:  37,093.70 GWh
EF:                5,141.610 / 37,093.70 = 0.138611 kgCO2e/kWh
```

Stored value: **0.138611 kgCO2e/kWh**.

### 2.6 Why 2024 supersedes 2020

The previous Phase 1 national location-based factor (`ng.grid.national.location.2020`, 0.5717 kgCO2e/kWh) was built from an incomplete 2020 plant-level dataset that captured only 7,281.71 GWh of gas and 75.59 GWh of hydro. Kainji, Jebba and Shiroro were excluded because their records used non-MWh unit labels.

A corrected 2020 recomputation using full NEDB plant-level hydro (8,341.99 GWh) gives a national factor of roughly 0.45 kgCO2e/kWh. The 2024 mix is preferred as the primary factor because:

1. It uses an official NERC-sourced total and hydro share (via Guardian Nigeria).
2. It matches the 2024 DisCo billed-energy denominator already used for DisCo factors.
3. It reflects the higher hydro share observed during the 2024 gas shortfall.

The 2020 corrected value remains available as a back-cast in the reconciled generation mix file.

### 2.7 Limitations and flags

| Issue | Impact |
|---|---|
| 2024 total is press-sourced from a Guardian Nigeria summary of NERC data | Low-to-medium; primary NERC annual report should replace when published. |
| Gas generation is a residual | Low; difference between residual and direct gas reporting is small relative to total. |
| Oil, solar, biomass and other shares are small (<0.5% combined) | Negligible on the final EF. |
| IPCC default fuel EFs applied uniformly | Medium; plant-specific gas turbine efficiency is not used here. |
| No T&D losses included | High if the factor is applied to billed rather than generated energy. |
| Upstream fugitive methane not included | Medium for full-fuel-cycle Scope 2/3 work. |

---

## 3. DisCo-Level Location-Based Emission Factors (2024)

### 3.1 Source

- **Primary billed energy:** `NBS_ELECTRICITY_DATA_2015_Q2_2024` - *Nigeria Electricity Data 2015-Q2 2024*, NBS, 2024.
- **Generation mix anchor:** `NEFDB_RECONCILED_GENERATION_2024` - *Nigeria Generation Mix Reconciled 2024*, NEFDB, 2024.
- **Underlying total and hydro:** `GUARDIAN_NERC_2024` - *Guardian Nigeria summary of NERC 2024 annual statistics*.
- **Methodology:** `IPCC_2006_VOL2_CH2`.

### 3.2 Methodology

For each DisCo:

1. Take Q2 2024 billed energy (GWh) from NBS data.
2. Anchor the regional mix to the reconciled 2024 national generation mix:
   - Gas: 68.57%
   - Hydro: 30.92%
   - Other (solar + biomass): 0.51%
3. Adjust the gas/hydro split by territory:
   - Northern DisCos (AEDC, JEDC, KDEDC, KEDC, YEDC): −10 percentage points gas, +10 percentage points hydro.
   - Western / Central DisCos (BEDC, IBEDC, IEDC): +2 percentage points gas, −2 percentage points hydro.
   - Southern DisCos (EKEDC, EEDC, PEDC): +12 percentage points gas, −12 percentage points hydro.
4. Apply the natural-gas EF derived from IPCC 2006 stationary-combustion defaults (AR5 GWP):

```
EF_DisCo = (gas_pct × EF_gas) + (hydro_pct × 0) + (other_pct × 0)
EF_gas = 0.202156 kgCO2e/kWh
```

### 3.3 DisCo billed energy and regional mix

| DisCo | Billed energy (GWh) | Gas % | Hydro % | Other % | EF (kgCO2e/kWh) |
|---|---:|---:|---:|---:|---:|
| AEDC | 301.000000 | 58.57 | 40.92 | 0.51 | 0.118396 |
| BEDC | 179.794193 | 70.57 | 28.92 | 0.51 | 0.142655 |
| EEDC | 159.799076 | 80.57 | 18.92 | 0.51 | 0.162870 |
| EKEDC | 317.000000 | 80.57 | 18.92 | 0.51 | 0.162870 |
| IBEDC | 269.530000 | 70.57 | 28.92 | 0.51 | 0.142655 |
| IEDC | 360.322343 | 70.57 | 28.92 | 0.51 | 0.142655 |
| JEDC | 105.605742 | 58.57 | 40.92 | 0.51 | 0.118396 |
| KDEDC | 83.220000 | 58.57 | 40.92 | 0.51 | 0.118396 |
| KEDC | 124.575763 | 58.57 | 40.92 | 0.51 | 0.118396 |
| PEDC | 149.913901 | 80.57 | 18.92 | 0.51 | 0.162870 |
| YEDC | 93.852360 | 58.57 | 40.92 | 0.51 | 0.118396 |

### 3.4 Data quality note on the regional mix

The 2024 national gas/hydro split is anchored to NERC-sourced data and is high confidence. The territorial adjustment (northern = more hydro, southern = more gas) is an assumption; no DisCo-level dispatch data exists in public sources. The "other" share is kept small and treated as zero-emission.

### 3.5 DisCo factors

| Factor ID | DisCo | Value (kgCO2e/kWh) | Confidence | Uncertainty |
|---|---|---:|---|---|
| `ng.grid.disco.aedc.2024` | AEDC | 0.118396 | medium | ±20% |
| `ng.grid.disco.bedc.2024` | BEDC | 0.142655 | medium | ±20% |
| `ng.grid.disco.eedc.2024` | EEDC | 0.162870 | medium | ±20% |
| `ng.grid.disco.ekedc.2024` | EKEDC | 0.162870 | medium | ±20% |
| `ng.grid.disco.ibedc.2024` | IBEDC | 0.142655 | medium | ±20% |
| `ng.grid.disco.iedc.2024` | IEDC | 0.142655 | medium | ±20% |
| `ng.grid.disco.jedc.2024` | JEDC | 0.118396 | medium | ±20% |
| `ng.grid.disco.kdedc.2024` | KDEDC | 0.118396 | medium | ±20% |
| `ng.grid.disco.kedc.2024` | KEDC | 0.118396 | medium | ±20% |
| `ng.grid.disco.pedc.2024` | PEDC | 0.162870 | medium | ±20% |
| `ng.grid.disco.yedc.2024` | YEDC | 0.118396 | medium | ±20% |

### 3.6 National-weighted check

```
Total DisCo billed energy: 2,144.613 GWh
Billed-energy-weighted gas share: 69.53%
Billed-energy-weighted hydro share: 29.96%
Billed-energy-weighted other share: 0.51%
```

This is consistent with the reconciled 2024 national generation mix (68.57% gas, 30.92% hydro). The billed-energy weighting is slightly more gas-heavy because southern DisCos have a larger share of national billed energy.

---

## 4. Deep-Research Enrichment

### 4.1 Sources reviewed

The 2024 enrichment drew on Nigeria official records, international databases and academic cross-checks:

| Source | What it provided |
|---|---|
| Nigerian Energy Data Bank (NEDB) | 2020 plant-level hydro for Kainji, Jebba, Shiroro and NESCO; unit labels required correction. |
| Ember / Our World in Data | Continuous 2020-2024 country totals and fuel shares. |
| IRENA IRENASTAT | 2020-2023 hydro, solar, biomass and oil generation by technology. |
| IEA Country Profile Nigeria | 2022 total generation cross-check. |
| EIA Country Analysis Brief 2025 | 2023 total / hydro alternative estimate. |
| Guardian Nigeria summary of NERC 2024 data | 2024 official total and hydro output. |
| Okakwu et al. (2019) AZOJETE | Validation of Kainji 2016/2017 energy values against NEDB. |
| Adoghe et al. (2023) Heliyon | Plant-level hydro figures reviewed and rejected as inconsistent with NEDB/Okakwu. |
| IPCC 2006 Guidelines Vol 2 Ch 2 | Natural-gas and oil stationary-combustion emission factors. |

### 4.2 Why 2024 was chosen as the reference year

The 2024 NERC-sourced statistics were the strongest recent dataset because they gave an official total generation and hydro share from a Nigeria authority. They also aligned with the Q2 2024 NBS billed-energy data already used for DisCo factors. Using a single reference year for both the national and DisCo factors keeps the methodology internally consistent and avoids mixing 2020 generation with 2024 billing.

### 4.3 How the incomplete 2020 hydro was corrected

The original Phase 1 2020 hydro total of 75.59 GWh came from the NESCO plant only. Kainji, Jebba and Shiroro were dropped because their records used units such as `MW` or `Bill.Cubic Meter` rather than MWh. The enrichment re-examined the NEDB plant records, cross-checked them against Okakwu et al. (2019), and accepted the numeric magnitudes as MWh. The corrected 2020 hydro total is 8,341.99 GWh (Kainji 2,953.28 + Jebba 2,678.91 + Shiroro 2,634.21 + NESCO 75.59). A corrected 2020 national EF is approximately 0.45 kgCO2e/kWh.

### 4.4 Remaining gaps

- 2021-2023 hydro totals still rely on international database estimates, not Nigerian plant dispatch records.
- No verified annual GWh exists yet for Zungeru (commissioned June 2023) or Gurara.
- DisCo-level dispatch data is unavailable; regional mix is assigned by territory.
- Transmission and distribution losses and upstream gas fugitives are still excluded.
- The primary NERC 2024 annual report should replace the press-sourced Guardian summary when released.

---

## 5. Complete Factor Inventory - Phase 1

| # | Factor ID | Source/method | Value (kgCO2e/kWh) | Confidence | Uncertainty |
|---:|---|---|---:|---|---|
| 1 | `ng.grid.national.om.2021` | WAPP ASB0034-2021 | 0.578 | high | ±10% |
| 2 | `ng.grid.national.bm.2021` | WAPP ASB0034-2021 | 0.556 | high | ±10% |
| 3 | `ng.grid.national.cm.2021` | WAPP ASB0034-2021 | 0.573 | high | ±10% |
| 4 | `ng.grid.national.location.2024` | NEFDB reconciled 2024 mix + IPCC | 0.138611 | medium | ±15% |
| 5 | `ng.grid.disco.aedc.2024` | NBS Q2 2024 + 2024 regional mix | 0.118396 | medium | ±20% |
| 6 | `ng.grid.disco.bedc.2024` | NBS Q2 2024 + 2024 regional mix | 0.142655 | medium | ±20% |
| 7 | `ng.grid.disco.eedc.2024` | NBS Q2 2024 + 2024 regional mix | 0.162870 | medium | ±20% |
| 8 | `ng.grid.disco.ekedc.2024` | NBS Q2 2024 + 2024 regional mix | 0.162870 | medium | ±20% |
| 9 | `ng.grid.disco.ibedc.2024` | NBS Q2 2024 + 2024 regional mix | 0.142655 | medium | ±20% |
| 10 | `ng.grid.disco.iedc.2024` | NBS Q2 2024 + 2024 regional mix | 0.142655 | medium | ±20% |
| 11 | `ng.grid.disco.jedc.2024` | NBS Q2 2024 + 2024 regional mix | 0.118396 | medium | ±20% |
| 12 | `ng.grid.disco.kdedc.2024` | NBS Q2 2024 + 2024 regional mix | 0.118396 | medium | ±20% |
| 13 | `ng.grid.disco.kedc.2024` | NBS Q2 2024 + 2024 regional mix | 0.118396 | medium | ±20% |
| 14 | `ng.grid.disco.pedc.2024` | NBS Q2 2024 + 2024 regional mix | 0.162870 | medium | ±20% |
| 15 | `ng.grid.disco.yedc.2024` | NBS Q2 2024 + 2024 regional mix | 0.118396 | medium | ±20% |

---

## 6. Data Quality Flags

| Flag | Affected factors | Description |
|---|---|---|
| `WAPP_DIRECT` | `ng.grid.national.om.2021`, `ng.grid.national.bm.2021`, `ng.grid.national.cm.2021` | Values taken directly from a UNFCCC standardized baseline; highest confidence. |
| `NERC_PRESS_SOURCE` | `ng.grid.national.location.2024` | 2024 total and hydro sourced from a Guardian Nigeria summary of NERC data. |
| `REGIONAL_MIX_ASSUMED` | All DisCo factors | Gas/hydro split adjusted by territory, not direct dispatch data. |
| `RESIDUAL_GAS` | `ng.grid.national.location.2024` | Gas generation is the residual after hydro, solar and biomass. |
| `NO_TD_LOSSES` | All factors | Transmission and distribution losses are excluded. |
| `NO_UPSTREAM_FUGITIVES` | `ng.grid.national.location.2024`, all DisCo factors | Upstream gas venting/leakage not included. |

---

## 7. Files Produced

- `src/factors/grid_electricity.ts` - canonical TypeScript factor records.
- `src/factors/index.ts` - aggregates all factor category arrays (currently grid electricity only).
- `methodology/progressive/phase_01_grid_electricity.md` - this document.
- Derived inputs:
  - `datasets/grid_electricity/derived/wapp_factors.json`
  - `datasets/grid_electricity/derived/nigeria_generation_mix_reconciled.csv`
  - `datasets/grid_electricity/derived/location_based_ef_2024.csv`
  - `datasets/grid_electricity/derived/disco_ef_2024_calculation.csv`
  - `datasets/grid_electricity/derived/location_based_factor.json`
  - `datasets/grid_electricity/derived/disco_factors.json`

# Grid Electricity Validation

**Date:** 2026-06-19  
**Validator:** final validation subagent  
**Scope:** 15 grid-electricity factors in `src/factors/grid_electricity.ts` and their `data/` exports

---

## Checklist

| # | Check | Result | Notes |
|---|-------|--------|-------|
| 1 | WAPP OM = 0.578 kgCO2e/kWh | PASS | `unfccc_asb0034_wapp_2021.md` Table 1 lists `EFgrid,OM,y = 0.578 tCO2/MWh`, which equals 0.578 kgCO2e/kWh |
| 1 | WAPP BM = 0.556 kgCO2e/kWh | PASS | Same source lists `EFgrid,BM,y = 0.556 tCO2/MWh` |
| 1 | WAPP CM arithmetic | PASS | `0.75*0.578 + 0.25*0.556 = 0.5725 -> 0.573`, matching source and committed record |
| 2 | Location-based EF recomputed from `location_based_ef.csv` | PASS | Recomputed: **0.571654672 kgCO2e/kWh**; rounds to committed **0.5717** |
| 3 | DisCo EFs recomputed from `disco_ef.csv` | PASS | All 11 values match committed records to 6 decimal places |
| 4 | All `source.id`s exist in `src/sources/index.ts` | PASS | 100% of primary and additional source IDs present |
| 5 | All required fields present on every factor record | PASS | `id, category, subcategory, value, unit, gwp_basis, scope, data_year, published_year, country, source, confidence, methodology_note, nefdb_version` all present |
| 6 | CSV and JSON exports contain identical 15 factors with matching values | PASS | Same 15 IDs, same values, same units |

---

## Independent Reproduction Details

### WAPP margins (`wapp_factors.json`)
 Values are taken directly from `docs/grid_electricity/unfccc_asb0034_wapp_2021.md`:
 - Operating margin: `0.578`
 - Build margin: `0.556`
 - Combined margin (wind/solar): `0.573`

 Cross-check: `round(0.578*0.75 + 0.556*0.25, 3) = 0.573`.

### National location-based factor
 Recomputed from `datasets/grid_electricity/derived/location_based_ef.csv` using the methodology note values:
 - Gas generation = 7,281.71119 GWh
 - Hydro generation = 75.59301 GWh
 - Total generation = 7,357.3042 GWh
 - Thermal efficiency = 35%
 - CO2 EF = 56.1 kg/GJ (56100 kg/TJ)
 - CH4 EF = 1 kg/TJ, N2O EF = 0.1 kg/TJ
 - AR6 GWP: CH4=28, N2O=265

 Computed EF = **0.571654672 kgCO2e/kWh**, which rounds to the committed **0.5717**.

### DisCo EFs
 Recomputed from `datasets/grid_electricity/derived/disco_ef.csv` using:
 - Gas EF per kWh of gas-fired generation = 3.6 GJ/MWh * (56.1 + 1*28 + 0.1*265) kgCO2e/GJ = **0.2021562 kgCO2e/kWh**
 - Regional EF = gas_pct * 0.2021562

 All computed values agree with the committed factors after rounding:

 | DisCo | Gas % | Recomputed | Committed |
 |-------|-------|-----------|-----------|
 | AEDC | 70 | 0.14150934 | 0.141509 |
 | BEDC | 76 | 0.153638712 | 0.153639 |
 | EEDC | 85 | 0.171832770 | 0.171833 |
 | EKEDC | 88 | 0.177897456 | 0.177897 |
 | IBEDC | 78 | 0.157681836 | 0.157682 |
 | IEDC | 80 | 0.161724960 | 0.161725 |
 | JEDC | 68 | 0.137466216 | 0.137466 |
 | KDEDC | 66 | 0.133423092 | 0.133423 |
 | KEDC | 65 | 0.131401530 | 0.131402 |
 | PEDC | 90 | 0.181940580 | 0.181941 |
 | YEDC | 67 | 0.135444654 | 0.135445 |

---

## Discrepancies / Observations

No discrepancies were found in the committed factor records or the exported CSV/JSON.

Minor note: the intermediate file `datasets/grid_electricity/derived/location_based_factor.json` is slightly stale relative to the committed record:
 - `uncertainty_pct`: 30.0 vs 20 in `grid_electricity.ts`
 - `nefdb_version`: `"phase1"` vs `"1.0.0"`
 - `published_year` is missing

 It is not referenced by the export pipeline, so it does not affect shipped data, but it should be aligned to avoid confusion.

---

## Standard Verification Commands

### `bunx tsc --noEmit`
```
(no output)
```
Result: PASS

### `bun run validate`
```
$ bun run scripts/validate.ts
Validated 15 factor(s) and 35 source(s). OK.
```
Result: PASS

### `bun test`
```
bun test v1.3.13 (bf2e2cec)

tests\schema.test.ts:
(pass) nefdb.list() returns an array

 1 pass
 0 fail
 1 expect() calls
Ran 1 test across 1 file. [273.00ms]
```
Result: PASS

---

## Verdict

**ACCEPT**

All 15 Phase 1 grid-electricity factors are correctly derived, deterministic, present in the source registry, and consistently exported. No fixes required for the committed dataset or its exports.

# Grid Electricity Validation & Enrichment

**Date:** 2026-06-19  
**Validator:** final validation subagent  
**Scope:** 2024 enrichment of `src/factors/grid_electricity.ts` (national location factor + 11 DisCo factors) and their `data/` exports  

---

## Summary of Checks

| # | Check | Result | Notes |
|---|-------|--------|-------|
| 1 | National location EF for 2024 recomputed from reconciled generation mix | PASS | Recomputed: **0.138611284 kgCO2e/kWh**; rounds to committed **0.138611** |
| 2 | 11 DisCo EFs recomputed from `disco_ef_2024_calculation.csv` | PASS | All values match committed factors to 6 decimal places |
| 3 | WAPP OM/BM/CM unchanged | PASS | 0.578 / 0.556 / 0.573 |
| 4 | All `source.id`s exist in `src/sources/index.ts` | PASS | Primary + additional source IDs present |
| 5 | All required `EmissionFactor` fields populated | PASS | 15/15 records have required fields |
| 6 | CSV and JSON exports match source factor records | PASS | 15 IDs, equal values after `build:csv` / `build:json` |
| 7 | DisCo `gas` breakdown consistency | **FAIL** | CH4/N2O entries are raw mass, not CO2e, and do not sum to `value` |
| 8 | IPCC documentation path | OBSERVATION | Requested path `docs/international_ef_databases/...` missing; equivalent file exists under `docs/grid_electricity/` |

---

## Independent Reproduction

### 1. National location-based factor (`ng.grid.national.location.2024`)

From `datasets/grid_electricity/derived/nigeria_generation_mix_reconciled.csv` (2024 NEFDB reconciled row):

| Item | Value |
|------|-------|
| `total_gwh` | 37,093.70 |
| `gas_gwh` | 25,433.85 |
| `oil_gwh` | 0.00 |

Using IPCC 2006 Table 2.2 energy-industry defaults with AR5 GWP:

- Gas EF: `(56,100 + 1×28 + 0.1×265) kgCO2e/TJ × 3.6 MJ/kWh × 1e-6 TJ/MJ` = **0.2021562 kgCO2e/kWh**
- Oil EF: `(77,400 + 3×28 + 0.6×265) kgCO2e/TJ × 3.6e-6` = **0.2795148 kgCO2e/kWh**

```
EF = (25,433.85 × 0.2021562 + 0 × 0.2795148) / 37,093.70
   = 0.138611284 kgCO2e/kWh
```

Committed value **0.138611** matches after rounding to 6 decimals.

Gas breakdown check:

| Gas | Recomputed (kgCO2e/kWh) | Committed |
|-----|--------------------------|-----------|
| CO2 | 0.138477 | 0.138477 |
| CH4 | 0.000069 | 0.000069 |
| N2O | 0.000065 | 0.000065 |
| **Sum** | **0.138611** | **0.138611** |

### 2. DisCo location-based factors (2024)

From `datasets/grid_electricity/derived/disco_ef_2024_calculation.csv`:

```
EF = gas_pct × 0.2021562
```

| DisCo | Gas % | Recomputed EF | Committed EF | Δ |
|-------|-------|---------------|--------------|---|
| AEDC | 58.566495 | 0.118396 | 0.118396 | <2×10⁻⁷ |
| BEDC | 70.566495 | 0.142655 | 0.142655 | <5×10⁻⁷ |
| EEDC | 80.566495 | 0.162870 | 0.162870 | <2×10⁻⁷ |
| EKEDC | 80.566495 | 0.162870 | 0.162870 | <2×10⁻⁷ |
| IBEDC | 70.566495 | 0.142655 | 0.142655 | <5×10⁻⁷ |
| IEDC | 70.566495 | 0.142655 | 0.142655 | <5×10⁻⁷ |
| JEDC | 58.566495 | 0.118396 | 0.118396 | <2×10⁻⁷ |
| KDEDC | 58.566495 | 0.118396 | 0.118396 | <2×10⁻⁷ |
| KEDC | 58.566495 | 0.118396 | 0.118396 | <2×10⁻⁷ |
| PEDC | 80.566495 | 0.162870 | 0.162870 | <2×10⁻⁷ |
| YEDC | 58.566495 | 0.118396 | 0.118396 | <2×10⁻⁷ |

All 11 DisCo `value`s match the committed records.

However, the `gas.CO2`/`CH4`/`N2O` breakdown on every DisCo factor is internally inconsistent with the total. Using AEDC as the representative example:

| Gas | Recomputed (kgCO2e/kWh) | Committed in `grid_electricity.ts` |
|-----|--------------------------|-------------------------------------|
| CO2 | 0.1182809 | 0.1182809 ✅ |
| CH4 | 0.0000590 | 0.00000211 ❌ |
| N2O | 0.0000559 | 0.00000021 ❌ |
| **Sum** | **0.1183958** | **0.1182832** ❌ |

The committed DisCo CH4 and N2O figures are the **raw gas masses** (kg CH4/kg N2O per kWh), not the CO2-equivalent contributions. The national factor correctly stores CO2-equivalent values (CH4 already multiplied by GWP 28, N2O by 265). The same multiplication must be applied to the DisCo records for consistency.

The mismatch pattern is identical for all 11 DisCo factors:

- Committed `CH4` ≈ expected `CH4 / 28`
- Committed `N2O` ≈ expected `N2O / 265`

### 3. WAPP margins

| Margin | Value | Source record |
|--------|-------|---------------|
| OM | 0.578 | `ng.grid.national.om.2021` |
| BM | 0.556 | `ng.grid.national.bm.2021` |
| CM | 0.573 | `ng.grid.national.cm.2021` |

Cross-check: `0.75 × 0.578 + 0.25 × 0.556 = 0.5725 → 0.573`.

### 4. Source registry coverage

Source IDs referenced in `src/factors/grid_electricity.ts`:

- `WAPP_ASB0034_2021`
- `WAPP_ASB0034_ASSESSMENT`
- `UNFCCC_CDM_TOOL07`
- `NEFDB_RECONCILED_GENERATION_2024`
- `IPCC_2006_VOL2_CH2`
- `GUARDIAN_NERC_2024`
- `EMBER_OWID_2024`
- `NBS_ELECTRICITY_DATA_2015_Q2_2024`
- `NIGERIA_GENERATION_MIX_2024`

All exist in `src/sources/index.ts`.

### 5. Required fields

A programmatic scan of the JSON export confirmed that every record has the required fields specified by `EmissionFactor`:

`id`, `category`, `subcategory`, `description`, `value`, `unit`, `gwp_basis`, `scope`, `data_year`, `published_year`, `country`, `source`, `confidence`, `methodology_note`, `nefdb_version`.

### 6. Export consistency

`bun run build:csv` and `bun run build:json` regenerated:

- `data/nefdb_v1.csv` - 15 rows
- `data/nefdb_v1.json` - 15 factors

Both contain the same 15 IDs and identical values as `src/factors/grid_electricity.ts`.

---

## Standard Verification Commands

### `bunx tsc --noEmit`

```
(no output)
```
Result: PASS

### `bun run validate`

```
$ bun run scripts/validate.ts
Validated 15 factor(s) and 39 source(s). OK.
```
Result: PASS

### `bun test`

```
bun test v1.3.13 (bf2e2cec)

tests\schema.test.ts:
(pass) nefdb.list() returns an array

 1 pass
 0 fail
 1 expect() calls
Ran 1 test across 1 file.
```
Result: PASS

### `bun run build:csv`

```
$ bun run scripts/build_csv.ts
Wrote C:\Users\HP\palmgrove\NEFDB\data\nefdb_v1.csv (15 row(s))
```
Result: PASS

### `bun run build:json`

```
$ bun run scripts/build_json.ts
Wrote C:\Users\HP\palmgrove\NEFDB\data\nefdb_v1.json (15 factor(s))
```
Result: PASS

---

## Discrepancies / Observations

1. **DisCo `gas` breakdown is inconsistent (FIX REQUIRED)**  
   The 11 DisCo factors store `gas.CH4` and `gas.N2O` as raw mass per kWh rather than CO2-equivalent per kWh. This causes `gas.CO2 + gas.CH4 + gas.N2O ≠ value` and is inconsistent with the national 2024 factor, where the breakdown correctly sums to the total.

   **Fix:** For each DisCo record, set:
   - `gas.CH4 = gas_pct × (1 kg/TJ × 28 GWP × 3.6e-6 TJ/kWh)`
   - `gas.N2O = gas_pct × (0.1 kg/TJ × 265 GWP × 3.6e-6 TJ/kWh)`

2. **IPCC doc path mismatch (observation)**  
   The validation inputs list `docs/international_ef_databases/ipcc_2006gl_vol2_ch2_stationary_combustion.md`, but that file does not exist. The equivalent reference is at `docs/grid_electricity/ipcc_2006gl_vol2_ch2_stationary_combustion.md` and its values support the defaults used.

3. **Exports not yet committed (observation)**  
   `git status` shows `data/nefdb_v1.csv` and `data/nefdb_v1.json` as modified relative to HEAD. The working-tree exports now contain the 2024 enrichment, but a commit is required to persist them.

---

## Verdict

**FIX REQUIRED**

The 2024 national location-based emission factor and all 11 DisCo emission factors are arithmetically correct and deterministic. Source coverage, required fields, TypeScript compilation, validation, tests, and export generation all pass. However, the DisCo `gas.CH4`/`gas.N2O` breakdowns are captured as raw mass instead of CO2-equivalent, making them inconsistent both internally and with the national factor. This must be corrected before the enrichment can be accepted.

# Fuel Combustion Methodology

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
| `ng.fuel.cng.stationary` | CNG | 2.568 | kgCO2e/kg | DEFRA 2024 CNG | - | medium | ±15% |
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
| CNG | 2,568.16 / t (= 2.56816 / kg) | - | 175 kg/m3 | 45.627 GJ/t |

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

The World Bank (2013) *Assessing Low-Carbon Development in Nigeria* provides annual-kilometre defaults from a 2010-2012 Nigeria survey. These are **not used in the per-km factors** but are recorded for users who have vehicle-stock data and need total annual emissions:

| Vehicle category | Annual km/vehicle |
|---|---:|
| Motorcycle / two-wheeler | 7,000 |
| Passenger car | 17,000 |
| Light commercial vehicle / danfo minibus | 30,000 |
| Urban bus | 30,000 |
| Long-distance coach | 45,000 |
| Heavy goods vehicle / truck | 33,500 |

---

## 3. Complete Factor Inventory - Phase 2

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
| `IPCC_CORROBORATED` | All stationary and fuel-based road factors | IPCC 2006 default EFs agree within ~1-3%. |
| `SOMORIN_CONTEXT` | `ng.fuel.diesel.stationary.kwh.field` | 28% field efficiency is a NEFDB assumption informed by Somorin et al. 2017 Nigeria SGE findings. |
| `UK_PROXY` | All distance-based road factors | UK DEFRA per-km values used as Nigeria proxy; local VKT data unavailable. |
| `BUS_OCCUPANCY_ASSUMED` | `ng.transport.road.diesel.bus` | Passenger-km to vehicle-km conversion uses 30-passenger occupancy assumption. |
| `WB_2013_VKT_DEFAULT` | Distance-based road factors | Annual-km defaults recorded for stock-based estimates, not per-km derivation. |
| `NO_NIGERIA_FUEL_SPEC` | CNG, natural gas | Per-m3 and per-kg values assume UK/DEFRA gas density; Nigerian gas composition may differ. |

---

## 5. Files Produced

- `src/factors/fuel_combustion.ts` - canonical stationary-combustion records.
- `src/factors/transport.ts` - canonical road-transport records.
- `src/factors/index.ts` - aggregates grid, fuel-combustion, and transport arrays.
- `src/api/fuel.ts` - ergonomic `nefdb.fuel.*` helpers.
- `src/api/transport.ts` - ergonomic `nefdb.transport.road(...)` helper.
- `src/index.ts` - public API exports.
- `src/sources/index.ts` - canonical source registry (updated with `WB_LOW_CARBON_DEVELOPMENT_NIGERIA_2013`).
- `tests/schema.test.ts` - completeness and API tests.
- `methodology/progressive/phase_02_fuel_combustion.md` - this document.
- Derived inputs:
  - `datasets/fuel_combustion/derived/stationary_fuel_factors.csv`
  - `datasets/fuel_combustion/derived/diesel_kwh_calculation.md`
  - `datasets/transport_aviation/derived/road_fuel_factors.csv`
  - `datasets/transport_aviation/derived/road_distance_factors.csv`
  - `datasets/transport_aviation/derived/road_distance_calculation.md`
- Exported data:
  - `data/nefdb_v1.csv`
  - `data/nefdb_v1.json`

# Transport & Aviation Methodology

NEFDB Phase 3 delivers six Nigeria (`NG`) domestic aviation emission factors:

- Four route-specific factors for the trunk domestic pairs Lagos-Abuja, Lagos-Port Harcourt, Lagos-Kano, and Abuja-Port Harcourt.
- One generic national-average factor for use when the exact route is unknown.
- One optional radiative-forcing multiplier (RF) drawn from Lee et al. (2021) for users who want a non-CO₂ climate-adjustment layer.

All base factors are CO₂-only, Scope 3 business-travel / category 6 proxies, and published under NEFDB version `1.0.0`.

---

## 1. Sources

| Source ID | Title | Publisher / Year | Relevance |
|---|---|---|---|
| `ICAO_ICEC_V13_1` | Methodology ICAO Carbon Emissions Calculator v13.1 | ICAO / 2024 | Core fuel-consumption coefficients, passenger-to-cargo factors, and calculation logic. |
| `NCAA_2022_DOMESTIC` | Executive Summary on International and Domestic Flight Operations (January - December 2022) | Nigeria Civil Aviation Authority / 2023 | Nigeria 2022 domestic passenger and flight totals for context; no aircraft-type or load-factor detail. |
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
| LOS-ABV | Lagos (DNMM) | Abuja (DNAA) | 511.42 |
| LOS-PHC | Lagos (DNMM) | Port Harcourt (DNPO) | 437.35 |
| LOS-KAN | Lagos (DNMM) | Kano (DNKN) | 833.86 |
| ABV-PHC | Abuja (DNAA) | Port Harcourt (DNPO) | 445.16 |

### 2.2 9% ICAO uplift to obtain stage length

The ICAO standard 9% uplift is applied to great-circle distance to obtain the flown stage length used in fuel-burn modelling:

```
stage_length_km = gc_km × 1.09
stage_length_nm = stage_length_km / 1.852
```

| Route | Uplifted (km) | Uplifted (nm) |
|---|---|---:|
| LOS-ABV | 557.4 | 301.0 |
| LOS-PHC | 476.7 | 257.4 |
| LOS-KAN | 908.9 | 490.8 |
| ABV-PHC | 485.2 | 262.0 |

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
| LOS-ABV | 301.0 | 3,368.02 |
| LOS-PHC | 257.4 | 3,184.20 |
| LOS-KAN | 490.8 | 4,168.21 |
| ABV-PHC | 262.0 | 3,203.59 |

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
| 1 | `ng.aviation.domestic.los_abv` | Lagos - Abuja | 0.1962 | kgCO₂/passenger-km | medium | ±25% |
| 2 | `ng.aviation.domestic.los_phc` | Lagos - Port Harcourt | 0.2169 | kgCO₂/passenger-km | medium | ±25% |
| 3 | `ng.aviation.domestic.los_kan` | Lagos - Kano | 0.1489 | kgCO₂/passenger-km | medium | ±25% |
| 4 | `ng.aviation.domestic.abv_phc` | Abuja - Port Harcourt | 0.2144 | kgCO₂/passenger-km | medium | ±25% |
| 5 | `ng.aviation.domestic.generic` | Nigeria domestic average | 0.1940 | kgCO₂/passenger-km | medium | ±25% |
| 6 | `ng.aviation.domestic.rf_multiplier` | Radiative-forcing multiplier | 1.9 | multiplier | low | - |

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

- `src/factors/aviation.ts` - canonical aviation factor records.
- `src/api/aviation.ts` - ergonomic `nefdb.aviation.*` helpers.
- `src/index.ts` - public API exports (updated).
- `src/sources/index.ts` - canonical source registry (updated with Phase 3 aviation sources).
- `tests/schema.test.ts` - completeness and API tests (updated).
- `methodology/progressive/phase_03_aviation.md` - this document.
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

# Waste & Water Methodology

NEFDB Phase 4 delivers eight waste and water emission factors for Nigeria:

- **Six Scope 1 waste factors**: municipal solid waste (MSW) disposed to managed landfill, open dump, and open burning; organic-waste composting; domestic wastewater; and industrial wastewater.
- **Two Scope 2 water-treatment factors**: public water supply and wastewater treatment, derived from electricity-intensity proxies using the NEFDB national grid factor.

All factors are for Nigeria (`NG`), use AR5 GWP values (CH₄ = 28, N₂O = 265), and are published under NEFDB version `1.0.0`.

---

## 1. Sources

| Source ID | Document | Publisher | Year | Relevance |
|---|---|---|---|---|
| `IPCC_2006_VOL5` | IPCC 2006 Guidelines Vol 5 Waste | IPCC | 2006 | Methodology, default DOC values, MCFs, oxidation factors, open-burning EFs, composting EFs, wastewater parameters. |
| `IPCC_2019_REFINEMENTS` | 2019 Refinement to IPCC 2006 Guidelines | IPCC | 2019 | Refined tropical-wet defaults; reviewed but not used for final values in this phase. |
| `NIGERIA_NIR1` | Nigeria First National Inventory Report 2000-2017 | Federal Republic of Nigeria | 2021 | Domestic wastewater organics (TOW), reported CH₄ emissions, and treatment-pathway fractions. |
| `NIGERIA_BUR2` | Nigeria Second Biennial Update Report to UNFCCC | Federal Republic of Nigeria | 2022 | National MSW generation and disposal context. |
| `NIGERIA_OPEN_BURNING` | Nigeria Open Burning Factsheet | regulatory_mrv datasets | 2021 | Nigeria open-burning context and combustion shares. |
| `DEFRA_2024_FULL` | UK DESNZ/DEFRA 2024 GHG Conversion Factors Full Set | UK DESNZ | 2024 | Water-supply and wastewater-treatment emission factors used as electricity-intensity proxies. |
| `NIGERIA_GENERATION_MIX_2024` | Nigeria Generation Mix 2024 (NERC / NEFDB reconciled) | NERC / NEFDB | 2024 | Basis for the national grid factor applied to water-treatment electricity use. |
| `NEFDB_RECONCILED_GENERATION_2024` | Nigeria Generation Mix Reconciled 2024 | NEFDB | 2024 | Canonical NEFDB grid factor source (`ng.grid.national.location.2024`). |

Local documents and datasets used in derivations:

- `datasets/waste_water/derived/msw_composition_nigeria.csv` - Lagos metropolis mean MSW composition.
- `datasets/waste_water/derived/ipcc_default_parameters.csv` - extracted IPCC default EFs and parameters.
- `datasets/waste_water/derived/wastewater_treatment_params.csv` - wastewater treatment parameter extraction.
- `docs/regulatory_mrv/11_Nigeria_NIR1_2000_2017.md` - NIR1 tables 7.1, 7.4, 7.5 and 7.13.
- `docs/waste_water/oke_afa_wwtp_lagos_2021.md` - Oke-Afa WWTP influent BOD and operating data.
- `docs/waste_water/Environ-09-02-11.md` - Nigeria MSW composition, open burning, and disposal-practice context.
- `datasets/international_ef_databases/ghg-conversion-factors-2024-FlatFormat_v1_1.xlsx` - raw DEFRA 2024 water factors.
- `src/factors/grid_electricity.ts` - NEFDB grid factor registry.

---

## 2. Solid Waste Disposal

### 2.1 Degradable organic carbon

Nigeria does not have a national MSW composition table in its UNFCCC submissions, so the Phase 4 factors use the Lagos metropolis mean composition from `datasets/waste_water/derived/msw_composition_nigeria.csv` as the most representative Nigeria urban data available.

| Component | % wet mass | DOC_j |
|---|---:|---:|
| Food | 66.11 | 0.15 |
| Paper | 10.02 | 0.40 |
| Plastic | 13.93 | 0.00 |
| Metal | 2.99 | 0.00 |
| Glass | 2.36 | 0.00 |
| Textile | 4.58 | 0.24 |
| Wood | 0.00 | 0.43 |
| Other | 0.00 | 0.00 |

```
DOC = Σ(frac_j × DOC_j)
    = 0.6611×0.15 + 0.1002×0.40 + 0.0458×0.24
    = 0.15024 kg C / kg wet waste
```

### 2.2 Managed landfill

The managed-landfill factor applies IPCC 2006 Vol. 5 Ch. 3 Tier 1 parameters for a controlled landfill:

| Parameter | Value |
|---|---|
| DOCf | 0.5 |
| F | 0.5 |
| OX | 0.1 |
| MCF | 1.0 |

```
EF_CH4 = DOC × DOCf × F × (16/12) × (1 − OX) × MCF × 1000
       = 0.15024 × 0.5 × 0.5 × 1.3333 × 0.9 × 1.0 × 1000
       = 45.07 kg CH4 / t wet waste
```

```
CO2e = EF_CH4 × 28
     = 45.07 × 28
     = 1,262 kgCO2e / t
     ≈ 1,260 kgCO2e / t
```

### 2.3 Open dump

Same DOC composition, with IPCC parameters for an unmanaged deep dump (> 5 m):

| Parameter | Value |
|---|---|
| DOCf | 0.5 |
| F | 0.5 |
| OX | 0.0 |
| MCF | 0.4 |

```
EF_CH4 = DOC × DOCf × F × (16/12) × (1 − OX) × MCF × 1000
       = 0.15024 × 0.5 × 0.5 × 1.3333 × 1.0 × 0.4 × 1000
       = 20.03 kg CH4 / t wet waste
```

```
CO2e = EF_CH4 × 28
     = 20.03 × 28
     = 560.9 kgCO2e / t
     ≈ 561 kgCO2e / t
```

---

## 3. Open Burning of MSW

Open-burning emissions use the IPCC 2006 Vol. 5 Ch. 5 Table 5.7 default emission factors per tonne of waste burned (`datasets/waste_water/derived/ipcc_default_parameters.csv`, rows 43-45). Biogenic CO₂ is excluded; the CO₂ term is fossil carbon only.

| Parameter | Value |
|---|---|
| EF_CO₂ (fossil) | 33 kg CO₂ / t |
| EF_CH₄ | 6.5 kg CH₄ / t |
| EF_N₂O | 0.2 kg N₂O / t |

```
CO2e = EF_CO2 + (EF_CH4 × 28) + (EF_N2O × 265)
     = 33 + (6.5 × 28) + (0.2 × 265)
     = 33 + 182 + 53
     = 268 kgCO2e / t
```

Country-specific fossil-carbon fractions for Nigerian MSW (e.g. higher plastic or synthetic textile shares) would increase the fossil CO₂ term. The IPCC default is retained until Nigeria-specific values are agreed.

---

## 4. Composting

The composting factor uses wet-weight default emission factors from IPCC 2006 Vol. 5 Ch. 4 Table 4.1.

| Parameter | Value |
|---|---|
| EF_CH₄ | 4 g / kg wet waste = 4.00 kg CH₄ / t |
| EF_N₂O | 0.24 g / kg wet waste = 0.240 kg N₂O / t |

```
CO2e = (EF_CH4 × 28) + (EF_N2O × 265)
     = (4.00 × 28) + (0.240 × 265)
     = 112 + 63.6
     = 175.6 kgCO2e / t
     ≈ 176 kgCO2e / t
```

Biogenic CO₂ from composting is excluded.

---

## 5. Domestic Wastewater

### 5.1 Methane emission factor

The IPCC 2006 Tier 1 model expresses methane emissions from domestic wastewater as:

```
EF_CH4 (kg/kg BOD) = Bo × MCF
```

Where:

- `Bo` = maximum methane-producing capacity = **0.6 kg CH₄ / kg BOD** (`IPCC_2006_VOL5`, default).
- `MCF` = methane correction factor.

A national weighted MCF is derived from `NIGERIA_NIR1` 2017 aggregate domestic-wastewater emissions:

| NIR1 value | Amount |
|---|---|
| Total organically degradable material (TOW) | 2,577,699,350 kg BOD |
| Reported CH₄ emissions (Table 7.13) | 547.6 Gg = 547,600,000 kg CH₄ |

```
Effective EF_CH4 = 547,600,000 / 2,577,699,350 = 0.2124 kg CH4 / kg BOD
MCF              = 0.2124 / 0.6 = 0.354
```

### 5.2 Convert to per-cubic-metre factor

Influent BOD for the domestic factor is taken from Oke-Afa WWTP, Lagos (`docs/waste_water/oke_afa_wwtp_lagos_2021.md`):

```
BOD = 127.5 mg/L = 0.1275 kg BOD / m3
```

```
CH4 per m3 = 0.2124 kg/kg BOD × 0.1275 kg BOD/m3
           = 0.0271 kg CH4 / m3

CO2e = 0.0271 × 28
     = 0.758 kgCO2e / m3
```

This factor excludes N₂O from domestic wastewater. N₂O depends on protein intake; add a separate factor if required.

---

## 6. Industrial Wastewater

Industrial wastewater uses the IPCC 2006 Vol. 5 Ch. 6 COD-based default:

| Parameter | Value |
|---|---|
| Bo | 0.25 kg CH₄ / kg COD |
| MCF | 0.3 (conservative: overloaded aerobic / partial anaerobic treatment) |

```
EF_CH4 = Bo × MCF
       = 0.25 × 0.3
       = 0.0750 kg CH4 / kg COD

CO2e = 0.0750 × 28
     = 2.10 kgCO2e / kg COD
```

Site-specific industrial treatment can range from ~0.1 (clean aerobic) to ~0.8 (anaerobic lagoon). The 0.3 value is a conservative default until Nigeria-specific sector-level treatment data are available.

---

## 7. Water Treatment

The two water-treatment factors are Scope 2 electricity factors. Local electricity-intensity data for Nigerian waterworks was not available, so DEFRA 2024 emission factors are used as an international proxy, and converted to Nigerian grid emissions using the NEFDB 2024 national grid factor `ng.grid.national.location.2024` = **0.138611 kgCO2e / kWh**.

### 7.1 Water supply

```
UK DEFRA water-supply factor = 0.15311 kgCO2e / m3
UK grid EF                   = 0.20705 kgCO2e / kWh
Implied intensity            = 0.15311 / 0.20705 = 0.739 kWh / m3

CO2e = 0.739 × 0.138611
     = 0.1025 kgCO2e / m3
     ≈ 0.103 kgCO2e / m3
```

### 7.2 Wastewater treatment

```
UK DEFRA wastewater-treatment factor = 0.18574 kgCO2e / m3
UK grid EF                           = 0.20705 kgCO2e / kWh
Implied intensity                    = 0.18574 / 0.20705 = 0.897 kWh / m3

CO2e = 0.897 × 0.138611
     = 0.1243 kgCO2e / m3
     ≈ 0.124 kgCO2e / m3
```

---

## 8. Complete Factor Inventory - Phase 4

| # | Factor ID | Value | Unit | Confidence | Uncertainty |
|---:|---|---:|---|---|---|
| 1 | `ng.waste.msw.landfill.managed` | 1,260 | kgCO2e / t | high | ±20% |
| 2 | `ng.waste.msw.open_dump` | 561 | kgCO2e / t | medium | ±25% |
| 3 | `ng.waste.msw.open_burning` | 268 | kgCO2e / t | medium | ±35% |
| 4 | `ng.waste.organic.composting` | 176 | kgCO2e / t | high | ±25% |
| 5 | `ng.waste.wastewater.domestic` | 0.758 | kgCO2e / m3 | medium | ±30% |
| 6 | `ng.waste.wastewater.industrial` | 2.10 | kgCO2e / kg COD | low | ±40% |
| 7 | `ng.water.treatment.supply` | 0.103 | kgCO2e / m3 | medium | ±30% |
| 8 | `ng.water.treatment.wastewater` | 0.124 | kgCO2e / m3 | medium | ±30% |

---

## 9. Data Quality Flags

| Flag | Affected factors | Description |
|---|---|---|
| `LAGOS_COMPOSITION_PROXY` | `ng.waste.msw.landfill.managed`, `ng.waste.msw.open_dump`, `ng.waste.msw.open_burning` | Nigeria has no national MSW composition table; Lagos metropolis mean composition is used as the best-available urban proxy. |
| `IPCC_LANDFILL_DEFAULTS` | `ng.waste.msw.landfill.managed`, `ng.waste.msw.open_dump` | DOCf, F, OX and MCF values are IPCC 2006 Tier 1 defaults for tropical managed/unmanaged deep dumps. |
| `IPCC_OPEN_BURNING_DEFAULT` | `ng.waste.msw.open_burning` | EFs are IPCC 2006 Vol. 5 Ch. 5 Table 5.7 defaults; fossil CO₂ term may be conservative for Nigerian plastic-rich waste. |
| `IPCC_COMPOSTING_DEFAULT` | `ng.waste.organic.composting` | EFs are IPCC 2006 Vol. 5 Ch. 4 Table 4.1 wet-weight defaults. |
| `NIR1_AGGREGATE_MCF` | `ng.waste.wastewater.domestic` | National weighted MCF (0.354) inferred from NIR1 2017 aggregate CH₄ emissions and TOW. |
| `OKE_AFA_BOD_PROXY` | `ng.waste.wastewater.domestic` | Per-m³ conversion is based on Oke-Afa WWTP influent BOD (Lagos). |
| `NO_DOMESTIC_WW_N2O` | `ng.waste.wastewater.domestic` | N₂O from domestic wastewater is not included. |
| `INDUSTRIAL_MCF_CONSERVATIVE` | `ng.waste.wastewater.industrial` | MCF = 0.3 is a conservative default; limited Nigeria-specific industrial effluent data available. |
| `UK_DEFRA_WATER_PROXY` | `ng.water.treatment.supply`, `ng.water.treatment.wastewater` | Electricity intensity is proxied from UK DEFRA 2024 water factors because Nigerian utility data were not found. |
| `NEFDB_GRID_2024` | `ng.water.treatment.supply`, `ng.water.treatment.wastewater` | Converted to Nigerian grid emissions using `ng.grid.national.location.2024` (0.138611 kgCO2e/kWh). |

---

## 10. Files Produced

- `src/factors/waste.ts` - canonical waste emission-factor records.
- `src/factors/water.ts` - canonical water-treatment emission-factor records.
- `src/factors/index.ts` - aggregate factor registry.
- `src/api/waste.ts` - ergonomic `nefdb.waste.*` helpers.
- `src/api/water.ts` - ergonomic `nefdb.water.*` helpers.
- `src/index.ts` - public API exports.
- `src/sources/index.ts` - canonical source registry.
- `tests/schema.test.ts` - completeness and schema tests (updated for Phase 4 factors).
- `methodology/progressive/phase_04_waste_water.md` - this document.
- Derived inputs:
  - `datasets/waste_water/derived/phase_04_factor_calculation.csv`
  - `datasets/waste_water/derived/phase_04_calculation_steps.md`
  - `datasets/waste_water/derived/waste_water_factor_notes.md`
  - `datasets/waste_water/derived/msw_composition_nigeria.csv`
  - `datasets/waste_water/derived/ipcc_default_parameters.csv`
  - `datasets/waste_water/derived/wastewater_treatment_params.csv`
  - `datasets/waste_water/derived/nigeria_waste_water_inputs.csv`
- Local extraction and source notes:
  - `docs/waste_water/local_inputs_extraction_note.md`
  - `docs/waste_water/oke_afa_wwtp_lagos_2021.md`
  - `docs/waste_water/Environ-09-02-11.md`
  - `docs/regulatory_mrv/11_Nigeria_NIR1_2000_2017.md`
- Exported data:
  - `data/nefdb_v1.csv`
  - `data/nefdb_v1.json`

# Public Export & Documentation

Phase 5 publishes the NEFDB as a public Cloudflare R2 object store, exposed through a Cloudflare Worker. Four domains are now live: `grid_electricity`, `fuel_combustion`, `transport_aviation`, and `waste_water`. Users can download datasets and methodology documentation directly from the Worker URL.

---

## 1. What Was Published

Four NEFDB domains are now published:

| Domain | Branches | Description |
|---|---|---|
| `grid_electricity` | `main`, `additional`, `derived` | Location- and market-based grid emission factors and supporting electricity data. |
| `fuel_combustion` | `main`, `derived` | Stationary combustion emission factors for liquid, solid, and gaseous fuels. |
| `transport_aviation` | `main`, `additional`, `derived` | Road-transport and aviation factors, fleet data, and route-level passenger estimates. |
| `waste_water` | `main`, `additional`, `derived` | Solid-waste composition, wastewater treatment, and fugitive-emission parameters. |

Each domain contains:

- **Datasets**
  - `main/` - primary authoritative sources and their original documentation (e.g., international databases, government statistics, academic studies).
  - `additional/` - supplementary and alternative data stores (e.g., `alternative/` reports, `hyperbrowser/` deep-web captures, FRSC/NADDC fleet digests, OWID/World Bank extracts).
  - `derived/` - NEFDB-computed tables, JSON extracts, and the audit logs that explain how they were produced.

- **Methodology documents**
  - Phase methodology documents for each domain.
  - Validation, enrichment, download, alternatives, and deep-research logs matching `deep_*_log.md`.
  - Derived dataset documentation: calculation steps, data-quality assessments, and audit trails.

- **Repository manifest**
  - `manifest.json` lists all available domains, branches (`main`, `additional`, `derived`), and the files contained in each.

### Domain summaries and sample files

#### `grid_electricity`

| Branch | Asset type | Rationale |
|---|---|---|
| `main` | datasets, docs | Primary electricity data: generation statistics (NBS, NERC, NBET, TCN, WAPP), international comparisons (Ember, IEA, IRENA, OWID), and academic calibration sources. |
| `additional` | datasets, docs | Alternative reports, CDM monitoring documents, and hyperbrowser archives used for cross-checks and gap-filling. |
| `derived` | datasets, docs | Final location-based and market-based factors, intermediate grids-and-fuels tables, and audit logs. |

Sample download: `grid_electricity/derived/datasets/location_based_factor_2024.json`  
<https://nefdb-r2-publisher.ugbodagadavid.workers.dev/grid_electricity/derived/datasets/location_based_factor_2024.json>

#### `fuel_combustion`

| Branch | Asset type | Rationale |
|---|---|---|
| `main` | datasets, docs | Petroleum product statistics from NBS/PPPRA and canonical guidance from IPCC, EPA GHG Emission Factors Hub, DEFRA, and GLEC framework. |
| `derived` | datasets, docs | Stationary fuel emission-factor tables and the download/calculation audit logs. |

Sample download: `fuel_combustion/derived/datasets/stationary_fuel_factors.csv`  
<https://nefdb-r2-publisher.ugbodagadavid.workers.dev/fuel_combustion/derived/datasets/stationary_fuel_factors.csv>

#### `transport_aviation`

| Branch | Asset type | Rationale |
|---|---|---|
| `main` | datasets, docs | International and national guidance for mobile combustion and aviation (ICAO, ICCT, IPCC, EPA, UK DEFRA) plus Nigerian fleet and load-factor references. |
| `additional` | datasets, docs | FRSC statistics digests, NCAA executive summaries, road-VKT spreadsheets, route counts, and wayback captures. |
| `derived` | datasets, docs | Route distances, road vehicle-kilometre estimates, fuel factors, and aviation emission-factor calculations. |

Sample download: `transport_aviation/derived/datasets/road_fuel_factors.csv`  
<https://nefdb-r2-publisher.ugbodagadavid.workers.dev/transport_aviation/derived/datasets/road_fuel_factors.csv>

#### `waste_water`

| Branch | Asset type | Rationale |
|---|---|---|
| `main` | datasets, docs | Waste-sector primary sources: IPCC Waste Model, HydroWASTE Nigeria subset, Lagos waste/water reports, JMP WASH data, and academic studies on composition and treatment. |
| `additional` | datasets, docs | Supplemental city-level and national datasets (OWID, World Bank, UNData, What-a-Waste) and extracted hyperbrowser archives. |
| `derived` | datasets, docs | Nigeria solid-waste composition, wastewater treatment parameters, fugitive-gas baselines, and calculation audit trails. |

Sample download: `waste_water/derived/datasets/msw_composition_nigeria.csv`  
<https://nefdb-r2-publisher.ugbodagadavid.workers.dev/waste_water/derived/datasets/msw_composition_nigeria.csv>

---

## 2. Worker URL

All content is served from:

```
https://nefdb-r2-publisher.ugbodagadavid.workers.dev
```

The Worker returns the requested object, directory-style listings, or the manifest depending on the path.

---

## 3. R2 Key Hierarchy

Objects in the `nefdb` R2 bucket follow this layout:

```
nefdb/
├── manifest.json
├── grid_electricity/
│   ├── main/
│   │   ├── datasets/
│   │   └── docs/
│   ├── additional/
│   │   ├── datasets/
│   │   └── docs/
│   └── derived/
│       ├── datasets/
│       └── docs/
├── fuel_combustion/
│   ├── main/
│   │   ├── datasets/
│   │   └── docs/
│   └── derived/
│       ├── datasets/
│       └── docs/
├── transport_aviation/
│   ├── main/
│   │   ├── datasets/
│   │   └── docs/
│   ├── additional/
│   │   ├── datasets/
│   │   └── docs/
│   └── derived/
│       ├── datasets/
│       └── docs/
└── waste_water/
    ├── main/
    │   ├── datasets/
    │   └── docs/
    ├── additional/
    │   ├── datasets/
    │   └── docs/
    └── derived/
        ├── datasets/
        └── docs/
```

- `main/` - primary authoritative sources and their original documentation.
- `additional/` - supplementary and alternative data stores (e.g., `alternative/` reports, `hyperbrowser/` deep-web captures).
- `derived/` - NEFDB-computed tables, JSON extracts, and the audit logs that explain how they were produced.
- `__root__/` - files that sit at the top level of a category folder in the raw repository.

---

## 4. Classification Rules

Publication is driven by `packages/nefdb-r2-publisher/scripts/classification.json`. For `grid_electricity`, the current rules are:

| Branch | Asset type | Subfolders included |
|---|---|---|
| `main` | datasets | `academic`, `international`, `__root__` |
| `main` | docs | `academic`, `international`, `__root__` |
| `additional` | datasets | `alternative`, `hyperbrowser` |
| `additional` | docs | `alternative`, `hyperbrowser` |
| `derived` | datasets | `derived` |
| `derived` | docs | `derived` (specific listed files + `deep_*_log.md` patterns) |

The classification map now covers all published NEFDB domains. New domains will be added here as they reach public export.

---

## 5. Example Browse Paths

- Manifest listing:
  <https://nefdb-r2-publisher.ugbodagadavid.workers.dev/manifest.json>

- Browse a domain:
  - Grid electricity: <https://nefdb-r2-publisher.ugbodagadavid.workers.dev/grid_electricity/>
  - Fuel combustion: <https://nefdb-r2-publisher.ugbodagadavid.workers.dev/fuel_combustion/>
  - Transport and aviation: <https://nefdb-r2-publisher.ugbodagadavid.workers.dev/transport_aviation/>
  - Waste and water: <https://nefdb-r2-publisher.ugbodagadavid.workers.dev/waste_water/>

- Browse a `main` branch (lists both `datasets/` and `docs/`):
  <https://nefdb-r2-publisher.ugbodagadavid.workers.dev/grid_electricity/main/>

### Sample file download links

Domain | Sample file
---|---
`grid_electricity` | `location_based_factor_2024.json`: <https://nefdb-r2-publisher.ugbodagadavid.workers.dev/grid_electricity/derived/datasets/location_based_factor_2024.json>
`fuel_combustion` | `stationary_fuel_factors.csv`: <https://nefdb-r2-publisher.ugbodagadavid.workers.dev/fuel_combustion/derived/datasets/stationary_fuel_factors.csv>
`transport_aviation` | `road_fuel_factors.csv`: <https://nefdb-r2-publisher.ugbodagadavid.workers.dev/transport_aviation/derived/datasets/road_fuel_factors.csv>
`waste_water` | `msw_composition_nigeria.csv`: <https://nefdb-r2-publisher.ugbodagadavid.workers.dev/waste_water/derived/datasets/msw_composition_nigeria.csv>

---

## 6. Credentials and Security Notes

- The R2 bucket `nefdb` and the Worker serve public objects; no authentication is required to read published paths.
- R2 credentials (account ID, access key ID, secret access key) are stored in the Worker secret bindings and are **not** committed to this repository.
- Licensed third-party PDFs (e.g., IPCC reports, NERC annual reports) are published only where redistribution is permitted or where they are already public government/international documents. Any restricted-paywalled content is excluded from the public bucket.

---

## 7. Gitignore and Raw Data

The raw `NEFDB/` folder itself remains **gitignored** in the Palmgrove repository. It contains the working source files, vendor PDFs, and intermediate extracts. The R2-published bucket is the canonical public distribution point; the gitignored folder remains the audit and build workspace.

---

## 8. Files Produced

- `NEFDB/methodology/progressive/phase_05_export_docs.md` - this document.
- Public R2 objects under `nefdb/{grid_electricity,fuel_combustion,transport_aviation,waste_water}/{main,additional,derived}/`.
- `nefdb/manifest.json`.
