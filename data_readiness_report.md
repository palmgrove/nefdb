# NEFDB Data Readiness Report

> Report date: 2026-06-19  
> Scope: pre-build data collection for NEFDB v1 Nigeria emission-factor database  
> Working directory: `C:\Users\HP\palmgrove\NEFDB`

## Executive summary

NEFDB v1 has enough source material to build a defensible, version 1 emission-factor package covering Nigerian grid electricity, fuel combustion, road transport, domestic aviation, waste, water, and contextual industrial factors. The strongest areas are grid electricity (UNFCCC/WAPP baseline, NERC/NBS data, plant-level Energy Databank) and combustion methodology (IPCC, DEFRA, EPA). The weakest areas are distance-based road-transport VKT (no direct measurements, only a 2010/2012 World Bank proxy), airline-route-specific activity data (NCAA 2022 is aggregate), and large-hydro generation records in the Energy Databank (Kainji/Jebba/Shiroro excluded from the 2020 derived total because their units are MW/reservoir flow, not MWh).

The one material data-quality defect found — the `ELPD_NESCO_GEN` hydro value being ~1,000× too large — has been corrected and the derived `nigeria_generation_by_fuel_latest.csv` regenerated. All remaining gaps are documented and can be handled with transparent flags, conservative defaults, or Phase 0 derivation work.

## Datasets collected

| Domain | Files | Total size (MB) | PDF | XLSX | CSV | Other |
|---|---:|---:|---:|---:|---:|---:|
| Grid electricity | 37 | 64.73 | 13 | 5 | 6 | 13 |
| Transport / aviation | 39 | 395.95 | 15 | 6 | 3 | 15 |
| Waste / water | 25 | 233.56 | 10 | 0 | 5 | 10 |
| Industrial (context) | 9 | 38.05 | 7 | 0 | 1 | 1 |
| **Total** | **110** | **732.29** | **45** | **11** | **15** | **39** |

> "Other" includes JSON extractions, Markdown conversions, scripts, and methodology notes.

## Derived outputs

All derived CSVs live under `datasets/<domain>/derived/`.

| File | Rows | Key findings |
|---|---|---|
| `datasets/grid_electricity/derived/disco_billed_energy_latest.csv` | 11 | DisCo energy billed (GWh) for Q2 2024 from NBS; high confidence. |
| `datasets/grid_electricity/derived/nigeria_generation_by_fuel_latest.csv` | 8 | 2020 generation by fuel from Energy Databank. Gas = 7,281.7 GWh. Hydro corrected to 75.6 GWh after `ELPD_NESCO_GEN` ÷1,000 fix. Low confidence because Kainji/Jebba/Shiroro records are excluded. |
| `datasets/grid_electricity/derived/plant_fuel_mapping.csv` | 30 | Plant-to-fuel mapping and latest-year generation/capacity hints from Energy Databank. |
| `datasets/transport_aviation/derived/domestic_route_passengers.csv` | 102 | NCAA 2022 summary passengers; aggregate and airline-level, not route-level. |
| `datasets/transport_aviation/derived/fleet_registration_summary.csv` | 40 | NBS vehicle categories converted to counts of crash-involved vehicles (not fleet registrations). |
| `datasets/transport_aviation/derived/road_vkt_by_vehicle_type.csv` | 0 (header) | Placeholder; no direct VKT data. To be populated from World Bank (2013) defaults. |
| `datasets/waste_water/derived/f_gas_baseline_nigeria.csv` | 7 | HFC-134a consumption/emissions 2008–2014 from Nigeria HFC inventory; AR4 GWP. Mixtures excluded due to unspecified composition. |
| `datasets/waste_water/derived/msw_composition_nigeria.csv` | 9 | Lagos household-level composition: food ~63–70%, paper ~8–11%, plastic ~13–14%. |
| `datasets/waste_water/derived/wastewater_treatment_params.csv` | 5 | Three Nigerian WWTPs from HydroWASTE v10 + Oke-Afa WWTP BOD and population served. |
| `datasets/industrial/derived/cement_industry_ef_hints.csv` | 5 | Reported Scope 1 intensities: BUA ~0.65–0.67 tCO₂/t cement, Dangote ~0.58–0.59 tCO₂/t cement. |

## Resolved gaps

| Gap | How resolved | Evidence |
|---|---|---|
| IGES grid factor list blocked by Cloudflare | Reconstructed v11.7 xlsx and Markdown from Firecrawl-parsed tables | `datasets/grid_electricity/iges_grid_emission_factors.xlsx`, `docs/grid_electricity/iges_grid_emission_factors.md`, `docs/grid_electricity/alternatives_log.md` |
| FRSC annual reports legacy archive unreachable | Discovered Strapi CMS API exposing direct PDF URLs | `docs/transport_aviation/alternatives_log.md`, `datasets/transport_aviation/FRSC_Annual_Report_202{0,1,2,3}.pdf` |
| NCAA 2022 summary PPTX | Downloaded and parsed with `python-pptx` | `datasets/transport_aviation/ncaa_executive_summary_2022.pptx`, `datasets/transport_aviation/derived/domestic_route_passengers.csv` |
| Energy Databank plant-level generation | Scraped JSON endpoints and saved CSV/JSON | `datasets/grid_electricity/energy_databank_generation_by_plant.csv/.json`, `docs/grid_electricity/energy_databank_scrape_notes.md` |
| `ELPD_NESCO_GEN` hydro unit error | Applied ÷1,000 correction and regenerated derived CSV | `docs/grid_electricity/hydro_anomaly_verdict.md`, `datasets/grid_electricity/derived/nigeria_generation_by_fuel_latest.csv` |
| Nigeria VKT absence | Identified World Bank (2013) fuel-sales-calibrated annual-km defaults | `docs/transport_aviation/vkt_gap_verdict.md`, `docs/transport_aviation/vkt_web_research.md` |
| Nigeria MSW composition | Found Lagos household/commercial studies and national profiles | `datasets/waste_water/derived/msw_composition_nigeria.csv`, `docs/waste_water/deep_gap_search_log.md` |
| Nigeria WWTP data | HydroWASTE v10 subset + Oke-Afa WWTP paper | `datasets/waste_water/derived/wastewater_treatment_params.csv`, `docs/waste_water/deep_gap_search_log.md` |
| Nigeria F-gas baseline | CCAC 2015 HFC inventory | `datasets/waste_water/derived/f_gas_baseline_nigeria.csv`, `docs/waste_water/deep_gap_search_log.md` |
| Cement sector context | Downloaded Dangote, BUA, Lafarge reports and Manufacturing Africa overview | `datasets/industrial/`, `datasets/industrial/derived/cement_industry_ef_hints.csv` |

## Remaining gaps

| Gap | Impact | Proposed handling |
|---|---|---|
| No 2023–2024 WAPP standardized baseline | National EF for latest year not off-the-shelf | Derive location-based EF from NERC/NBS generation data; retain WAPP 2021 for market-based/combined margin. |
| No DisCo-level generation mix | DisCo EFs must be modeled | Map DisCos to regional plant mix + NBS billed energy; flag medium confidence, ±20%. |
| Kainji/Jebba/Shiroro 2020 generation excluded from derived hydro | Hydro total for 2020 is incomplete | Flag low confidence; cross-check with NERC annual report hydro total (~8,500–9,500 GWh). |
| No direct Nigeria VKT | Distance-based road EFs uncertain | Use World Bank (2013) defaults; publish as optional, flag `confidence=medium`. |
| NCAA 2023 Q2–Q4 summaries absent | 2023 aviation activity incomplete | Use 2022 summary as base year; note limitation. |
| No route-level domestic passenger data | Route-specific EFs rely on assumptions | Apply ICAO ICEC to route great-circle distances with assumed load factor 72%. |
| Post-2014 HFC import data unavailable | F-gas factors in v2 only | Keep 2008–2014 baseline; scope F-gases to v2. |
| Steel / fertiliser process factors absent | Industrial process EFs in v2 only | Document cement context only for v1. |
| Open Footprint schemas gated by login | Optional interoperability | Capture public overview pages; revisit if needed. |

## Data-quality flags

1. **Hydro unit correction.** `ELPD_NESCO_GEN` raw values were divided by 1,000 to fix a probable kWh-as-MWh label error. The corrected 2020 hydro value is 75.6 GWh versus the original 75,593 GWh.
2. **Incomplete hydro total.** Because Kainji, Jebba, and Shiroro 2020 records carry non-MWh units, the derived hydro total is far below NERC/TCN independent estimates. Do not use it as a complete hydro figure.
3. **VKT assumptions.** Distance-based road factors would rely on World Bank (2013) annual-km defaults from a 2010 base year / 2012 survey. Treat as proxy, not measured data; uncertainty ±25–40%.
4. **MSW composition limitations.** Available composition data is Lagos-centric and household-level. National defaults will need to blend BUR2 figures with Lagos studies and flag geographic coverage.
5. **Fleet registration vs crash-involved vehicles.** `fleet_registration_summary.csv` currently holds crash-involved vehicle counts, not registered fleet totals. Replace with FRSC/NBS registration tables where possible.
6. **Aviation passenger data is aggregate.** NCAA 2022 summary provides total domestic passengers and airline-level totals, not per-route totals.

## Readiness for Phase 0 bootstrap

| Factor category | Status | Rationale |
|---|---|---|
| National grid EF (WAPP 2021) | 🟢 Green | Direct values available, well-sourced. |
| Location-based / derived national grid EF | 🟡 Amber | Source data exists; requires derivation and hydro flag. |
| DisCo-level grid EFs | 🟡 Amber | DisCo billing + plant mix available; modeling needed. |
| Stationary fuel combustion | 🟢 Green | IPCC/DEFRA/EPA values available. |
| Road fuel-based factors | 🟢 Green | IPCC/DEFRA + methodology ready. |
| Road distance-based factors | 🟡 Amber | Proxy defaults exist; confidence is medium only. |
| Domestic aviation | 🟡 Amber | ICAO methodology ready; activity data is aggregate. |
| Waste / water | 🟡 Amber | IPCC FOD model + Nigeria proxies; composition data is Lagos-centric. |
| Industrial process | 🔴 Red | Only cement context collected; steel/fertiliser absent. Out of scope for v1. |
| F-gases | 🔴 Red | 2008–2014 baseline only; out of scope for v1. |

---

*Prepared by Palmgrove / Irenium Ltd data-readiness consolidation. Inputs: `docs/grid_electricity/*`, `docs/transport_aviation/*`, `docs/waste_water/deep_gap_search_log.md`, `docs/batch_01_conversion_log.md`, and all `datasets/*/derived/` CSVs.*
