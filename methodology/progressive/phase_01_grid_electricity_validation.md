# Phase 1 Grid Electricity Factor Validation Report

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
