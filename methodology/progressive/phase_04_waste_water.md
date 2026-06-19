# Phase 4 — Waste & Water Factors

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

- `datasets/waste_water/derived/msw_composition_nigeria.csv` — Lagos metropolis mean MSW composition.
- `datasets/waste_water/derived/ipcc_default_parameters.csv` — extracted IPCC default EFs and parameters.
- `datasets/waste_water/derived/wastewater_treatment_params.csv` — wastewater treatment parameter extraction.
- `docs/regulatory_mrv/11_Nigeria_NIR1_2000_2017.md` — NIR1 tables 7.1, 7.4, 7.5 and 7.13.
- `docs/waste_water/oke_afa_wwtp_lagos_2021.md` — Oke-Afa WWTP influent BOD and operating data.
- `docs/waste_water/Environ-09-02-11.md` — Nigeria MSW composition, open burning, and disposal-practice context.
- `datasets/international_ef_databases/ghg-conversion-factors-2024-FlatFormat_v1_1.xlsx` — raw DEFRA 2024 water factors.
- `src/factors/grid_electricity.ts` — NEFDB grid factor registry.

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

Open-burning emissions use the IPCC 2006 Vol. 5 Ch. 5 Table 5.7 default emission factors per tonne of waste burned (`datasets/waste_water/derived/ipcc_default_parameters.csv`, rows 43–45). Biogenic CO₂ is excluded; the CO₂ term is fossil carbon only.

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

## 8. Complete Factor Inventory — Phase 4

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

- `src/factors/waste.ts` — canonical waste emission-factor records.
- `src/factors/water.ts` — canonical water-treatment emission-factor records.
- `src/factors/index.ts` — aggregate factor registry.
- `src/api/waste.ts` — ergonomic `nefdb.waste.*` helpers.
- `src/api/water.ts` — ergonomic `nefdb.water.*` helpers.
- `src/index.ts` — public API exports.
- `src/sources/index.ts` — canonical source registry.
- `tests/schema.test.ts` — completeness and schema tests (updated for Phase 4 factors).
- `methodology/progressive/phase_04_waste_water.md` — this document.
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
