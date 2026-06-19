# Phase 1 — Grid Electricity Emission Factors

NEFDB Phase 1 delivers the first 15 grid-electricity emission factors:

- 3 national-grid margin factors from WAPP ASB0034-2021 (operating, build, combined).
- 1 national-grid location-based factor derived from the NEFDB reconciled 2024 generation mix.
- 11 DisCo-level location-based factors derived from Q2 2024 billed energy and a 2024 regional generation-mix adjustment.

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

## 2. National Grid Location-Based Emission Factor (2024)

### 2.1 Source

- **Primary:** `NEFDB_RECONCILED_GENERATION_2024` — *Nigeria Generation Mix Reconciled 2024*, NEFDB, 2024.
- **Underlying total and hydro:** `GUARDIAN_NERC_2024` — *Guardian Nigeria summary of NERC 2024 annual statistics*.
- **Solar / biomass cross-check:** `EMBER_OWID_2024` — *Ember Yearly Electricity Data / Our World in Data energy dataset*.
- **Methodology:** `IPCC_2006_VOL2_CH2` — *IPCC 2006 Guidelines Vol 2 Ch 2 Stationary Combustion*.

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

- **Primary billed energy:** `NBS_ELECTRICITY_DATA_2015_Q2_2024` — *Nigeria Electricity Data 2015–Q2 2024*, NBS, 2024.
- **Generation mix anchor:** `NEFDB_RECONCILED_GENERATION_2024` — *Nigeria Generation Mix Reconciled 2024*, NEFDB, 2024.
- **Underlying total and hydro:** `GUARDIAN_NERC_2024` — *Guardian Nigeria summary of NERC 2024 annual statistics*.
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

The 2024 national gas/hydro split is anchored to NERC-sourced data and is high confidence. The territorial adjustment (northern = more hydro, southern = more gas) is an assumption; no DisCo-level dispatch data exists in public sources. The “other” share is kept small and treated as zero-emission.

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
| Ember / Our World in Data | Continuous 2020–2024 country totals and fuel shares. |
| IRENA IRENASTAT | 2020–2023 hydro, solar, biomass and oil generation by technology. |
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

- 2021–2023 hydro totals still rely on international database estimates, not Nigerian plant dispatch records.
- No verified annual GWh exists yet for Zungeru (commissioned June 2023) or Gurara.
- DisCo-level dispatch data is unavailable; regional mix is assigned by territory.
- Transmission and distribution losses and upstream gas fugitives are still excluded.
- The primary NERC 2024 annual report should replace the press-sourced Guardian summary when released.

---

## 5. Complete Factor Inventory — Phase 1

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

- `src/factors/grid_electricity.ts` — canonical TypeScript factor records.
- `src/factors/index.ts` — aggregates all factor category arrays (currently grid electricity only).
- `methodology/progressive/phase_01_grid_electricity.md` — this document.
- Derived inputs:
  - `datasets/grid_electricity/derived/wapp_factors.json`
  - `datasets/grid_electricity/derived/nigeria_generation_mix_reconciled.csv`
  - `datasets/grid_electricity/derived/location_based_ef_2024.csv`
  - `datasets/grid_electricity/derived/disco_ef_2024_calculation.csv`
  - `datasets/grid_electricity/derived/location_based_factor.json`
  - `datasets/grid_electricity/derived/disco_factors.json`
