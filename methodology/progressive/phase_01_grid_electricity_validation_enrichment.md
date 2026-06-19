# Phase 1 Grid Electricity Enrichment Validation Report

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

- `data/nefdb_v1.csv` — 15 rows
- `data/nefdb_v1.json` — 15 factors

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
