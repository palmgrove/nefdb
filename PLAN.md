# NEFDB — Nigeria Emission Factor Database
## v1 Build Plan: From Raw Data to npm Publication

> **Prepared:** June 2026  
> **Status:** Pre-build — raw datasets collected, key grid-electricity gaps filled, documentation downloaded  
> **Target:** `@palmgrove/nefdb` published on npm, CC BY-SA 4.0  
> **Maintainer:** Irenium Ltd (Palmgrove)

---

## Can We Proceed With What We Have?

**Yes — with targeted gap-fills.** Here is the honest inventory:

| Category | What We Have | Confidence | Gap |
|---|---|---|---|
| **Nigeria National Grid EF** | WAPP ASB0034-2021 (OM: 0.578, BM: 0.556, CM: 0.573 tCO2/MWh); NERC annual + quarterly reports 2022-2024; EIA Nigeria 2025 brief; IRENA REMap 2023; UNFCCC CDM Tool 07 | **High** | No 2023-2024 recalculated WAPP factor yet; must derive from NERC generation data |
| **DisCo-level grid factors** | NERC 2022-2024 annual reports (MD); quarterly reports 2024 Q1/Q3/Q4; NBS Q4 2023 energy billed by DisCo; **Energy Databank generation-by-plant CSV (653 records)**; **NBS Electricity Data 2015–Q2 2024.xlsx** | **Medium-High** | DisCo-specific EFs require generation-mix calculation; no off-the-shelf DisCo EF table exists anywhere. **Note:** Energy Databank `ELPD_NESCO_GEN` hydro value is a 1,000× unit error and must be corrected before use. |
| **Diesel generator combustion** | IPCC 2006 Vol2 Ch2 Stationary Combustion; GHG Protocol Corporate Standard; EPA GHG EF Hub 2024; UK DEFRA 2024/2026 methodology; NNPC Annual Statistics (fuel consumption) | **High** | Efficiency-adjusted kWh factor needs documented Nigeria-specific genset efficiency assumption |
| **Petrol / LPG / CNG combustion** | IPCC 2006 Vol2 Ch2; EPA GHG EF Hub 2024; UK DEFRA 2024; GHG Protocol Corporate Standard; NNPC fuel stats | **High** | LPG combustion EF confirmed; CNG needs explicit NCV value for Nigeria |
| **Fleet / road vehicles** | IPCC 2006 Vol2 Ch3 Mobile Combustion; ICCT Soot-Free Transport; World Bank (2013) Nigeria vehicle survey; NBS/FRSC vehicle stock data; EPA GHG EF Hub 2024; Lagos Transport Statistics 2020; NESREA vehicular emission regulations 2011 | **Medium** | No measured Nigeria VKT data exists. v1 will use fuel-based factors (`kgCO2e/litre`) as primary output. Optional distance-based factors derived from World Bank (2013) annual-km defaults (car 17,000 km/yr, motorcycle 7,000 km/yr, HGV 33,500 km/yr, etc.) may be published with low–medium confidence flags. |
| **Domestic aviation** | ICAO ICEC methodology v13.1; Lee et al 2021 (aviation RF); NCAA Executive Summary 2022; GLEC Framework v3 | **Medium** | Nigerian route-specific EFs need ICAO methodology applied to route distances |
| **Waste and water** | IPCC Waste Model FOD (XLS); Lagos WASH factsheet; Nigeria BUR2; Nigeria open-burning data; Fecal Sludge Management report; Solid Waste Management Nigeria draft report; UK DEFRA 2026 waste factors | **Medium-Low** | Waste composition data for Nigeria is thin; will use IPCC defaults with Nigeria-specific waste composition where available |
| **International EF benchmarks** | EPA GHG EF Hub 2011-2025; UK DEFRA 2024 full set; IPCC 2006 GL Vol2; IPCC 2019 Refinements; OpenEmissionFactorsDB; GHGCalc datasets | **High** | These underpin methodology; no gap |

**Bottom line:** We have enough to build a defensible, well-sourced v1 for all seven categories. The grid electricity EFs require the most derivation work (not a gap — it is the work). Everything else is extracting, curating, and documenting values that exist in our downloaded sources.

---

## Pre-Build Data Quality Verdicts

Two material data-quality issues were investigated by focused subagents before implementation begins.

### 1. Energy Databank hydro anomaly — `ELPD_NESCO_GEN`

**Verdict:** Unit/scale error. The raw value `75,593,010 MWh` is ~1,000× too large for a ~19–26 MW plant.

**Action for implementation:**
- Correct all `ELPD_NESCO_GEN` generation values by dividing by 1,000.
- Regenerate `nigeria_generation_by_fuel_latest.csv`.
- Add a data-quality flag in the factor record and methodology note.

**Details:** `NEFDB/docs/grid_electricity/hydro_anomaly_verdict.md`

### 2. Road VKT gap

**Verdict:** No direct Nigeria VKT dataset exists in public sources.

**Action for implementation:**
- Primary NEFDB v1 road-transport factors remain **fuel-based** (`kgCO2e/litre` petrol/diesel).
- Optional distance-based factors may be derived from **World Bank (2013) Nigeria vehicle survey** annual-km defaults:
  - Motorcycle: 7,000 km/yr
  - Passenger car: 17,000 km/yr
  - Light commercial / danfo minibus: 30,000 km/yr
  - Urban bus: 30,000 km/yr
  - Long-distance coach: 45,000 km/yr
  - Heavy goods vehicle: 33,500 km/yr
- Any derived vehicle-km factors must carry `confidence=medium` and explicit `source=WB_2013_Nigeria_vehicle_survey` flags.

**Details:** `NEFDB/docs/transport_aviation/vkt_gap_verdict.md`

---

## Architecture Decision

### What NEFDB Is

NEFDB is **a curated, versioned, typed database of emission factors relevant to Nigerian operations**, published as:
1. An npm package (`@palmgrove/nefdb`) — TypeScript-first, tree-shakeable
2. A CSV flat file — for non-dev users (sustainability officers, consultants, Excel users)
3. A JSON flat file — for any language/tool integration
4. A methodology PDF — for regulators, auditors, FRC/NGX submission

### What NEFDB Is Not

- It is not a calculation engine (that is `@palmgrove/calc`)
- It does not do unit conversion (that is `@palmgrove/calc`)
- It does not make network requests at runtime
- It is not a live API (factors are baked in at publish time, versioned)

---

## Data Model

Every emission factor record has the following shape:

```typescript
interface EmissionFactor {
  // Identity
  id: string;                    // e.g. "ng.grid.national.2021"
  category: FactorCategory;      // "grid_electricity" | "fuel_combustion" | "transport" | "aviation" | "waste" | "water"
  subcategory: string;           // e.g. "national_grid" | "disco_ikeja" | "diesel_stationary"
  
  // The factor
  value: number;                 // e.g. 0.573
  unit: FactorUnit;              // "kgCO2e_per_kWh" | "kgCO2e_per_litre" | "kgCO2e_per_tonne" | etc.
  gas: GasBreakdown | null;      // { CO2: number, CH4: number, N2O: number } or null if only CO2e total
  
  // Context
  gwp_basis: "AR5" | "AR6";     // GWP version used for CO2e conversion
  scope: 1 | 2 | "1_and_2";    // Which GHG Protocol scope
  
  // Temporal
  data_year: number;             // Year the underlying data represents
  published_year: number;        // Year this factor was published/added to NEFDB
  
  // Geography
  country: "NG";                 // Always Nigeria for NEFDB v1
  region?: string;               // Optional: "lagos" | "abuja" | "south-west" etc.
  disco?: DisCo;                 // Optional: "AEDC" | "BEDC" | "EKEDC" | "EEDC" | "IBEDC" | "IEDC" | "JEDC" | "KDEDC" | "KEDC" | "PEDC" | "YEDC"
  
  // Source / Citation (key feature)
  source: SourceReference;       // Always present — no unsourced factors
  additional_sources?: SourceReference[]; // Supporting/corroborating sources
  
  // Quality metadata
  uncertainty_pct?: number;      // e.g. 15 = +/-15%
  confidence: "high" | "medium" | "low";
  methodology_note: string;      // How this factor was derived
  
  // Versioning
  nefdb_version: string;         // e.g. "1.0.0"
  deprecated?: boolean;
  superseded_by?: string;
}

interface SourceReference {
  id: string;                    // Short internal ID, e.g. "WAPP_ASB0034_2021"
  title: string;                 // Full document/dataset title
  publisher: string;             // e.g. "UNFCCC / West African Power Pool"
  year: number;                  // Publication year
  url?: string;                  // Public URL if available
  page?: string;                 // Page or table reference
  access_date?: string;          // ISO date when source was accessed
}
```

### Source/Citation as Optional Argument (API Design)

The `source` field is **always present on every factor record** — no factor enters NEFDB without a source. Non-negotiable for regulatory credibility.

The **optional argument** is for the consumer API — developers choose how much source metadata they receive:

```typescript
// Minimal — just the number
const ef = nefdb.get("ng.grid.national.cm.2021");
// -> { value: 0.573, unit: "kgCO2e_per_kWh" }

// With citation
const ef = nefdb.get("ng.grid.national.cm.2021", { withSource: true });
// -> { value: 0.573, unit: "kgCO2e_per_kWh", source: { title, publisher, url, year, page } }

// Full record
const ef = nefdb.get("ng.grid.national.cm.2021", { full: true });
// -> EmissionFactor (all fields)
```

This means:
- Developers who just want the number get a clean, lean response
- Developers building audit trails or reports get citations automatically
- Non-dev users (CSV/JSON consumers) always see the source column

---

## Factor Inventory (v1.0 Target)

### 1. Grid Electricity (~15 factors)

| Factor ID | Description | Derivation | Primary Source |
|---|---|---|---|
| `ng.grid.national.om.2021` | Nigeria national grid — Operating Margin EF | Direct from WAPP ASB0034-2021 | UNFCCC ASB0034-2021 |
| `ng.grid.national.bm.2021` | Nigeria national grid — Build Margin EF | Direct from WAPP ASB0034-2021 | UNFCCC ASB0034-2021 |
| `ng.grid.national.cm.2021` | Nigeria national grid — Combined Margin EF | Direct from WAPP ASB0034-2021 | UNFCCC ASB0034-2021 |
| `ng.grid.national.location.2024` | Nigeria national grid — Location-based (Scope 2) | Derived from NEFDB reconciled 2024 generation mix + IPCC fuel EFs | NERC/Guardian 2024 + NEFDB reconciliation + IPCC 2006 |
| `ng.grid.disco.aedc.2024` | Abuja AEDC DisCo grid EF | Derived from NBS Q2 2024 billing + 2024 regional generation-mix adjustment | NBS Q2 2024 + NERC/Guardian 2024 + NEFDB reconciliation |
| `ng.grid.disco.bedc.2024` | Benin BEDC DisCo grid EF | Same methodology | NBS Q2 2024 + NERC/Guardian 2024 + NEFDB reconciliation |
| `ng.grid.disco.ekedc.2024` | Eko EKEDC DisCo grid EF | Same methodology | NBS Q2 2024 + NERC/Guardian 2024 + NEFDB reconciliation |
| `ng.grid.disco.eedc.2024` | Enugu EEDC DisCo grid EF | Same methodology | NBS Q2 2024 + NERC/Guardian 2024 + NEFDB reconciliation |
| `ng.grid.disco.ibedc.2024` | Ibadan IBEDC DisCo grid EF | Same methodology | NBS Q2 2024 + NERC/Guardian 2024 + NEFDB reconciliation |
| `ng.grid.disco.iedc.2024` | Ikeja IEDC DisCo grid EF | Same methodology | NBS Q2 2024 + NERC/Guardian 2024 + NEFDB reconciliation |
| `ng.grid.disco.jedc.2024` | Jos JEDC DisCo grid EF | Same methodology | NBS Q2 2024 + NERC/Guardian 2024 + NEFDB reconciliation |
| `ng.grid.disco.kdedc.2024` | Kaduna KDEDC DisCo grid EF | Same methodology | NBS Q2 2024 + NERC/Guardian 2024 + NEFDB reconciliation |
| `ng.grid.disco.kedc.2024` | Kano KEDC DisCo grid EF | Same methodology | NBS Q2 2024 + NERC/Guardian 2024 + NEFDB reconciliation |
| `ng.grid.disco.pedc.2024` | Port Harcourt PEDC DisCo grid EF | Same methodology | NBS Q2 2024 + NERC/Guardian 2024 + NEFDB reconciliation |
| `ng.grid.disco.yedc.2024` | Yola YEDC DisCo grid EF | Same methodology | NBS Q2 2024 + NERC/Guardian 2024 + NEFDB reconciliation |

> **DisCo EF Methodology:** No off-the-shelf DisCo EF table exists anywhere. Approach: take each DisCo's share of Q2 2024 national billed energy (NBS data), adjust the 2024 national gas/hydro mix by territory (more hydro in the north, more gas in the south), and compute EF per DisCo. Confidence: **medium–high** (high confidence in the 2024 NERC/Guardian national hydro share; medium confidence in the territorial allocation). Flagged transparently with ±20% uncertainty.

### 2. Fuel Combustion — Stationary (~8 factors)

| Factor ID | Fuel | Value | Unit | Primary Source |
|---|---|---|---|---|
| `ng.fuel.diesel.stationary` | Diesel — stationary combustion | ~2.68 | kgCO2e/litre | IPCC 2006 Vol2 Ch2 + UK DEFRA 2024 |
| `ng.fuel.diesel.stationary.kwh.rated` | Diesel — kWh basis, rated genset efficiency (33%) | ~0.57 | kgCO2e/kWh | Above + manufacturer specs |
| `ng.fuel.diesel.stationary.kwh.field` | Diesel — kWh basis, field efficiency Nigeria (28%) | ~0.67 | kgCO2e/kWh | Above + Somorin et al 2017 |
| `ng.fuel.petrol.stationary` | Petrol — stationary | ~2.31 | kgCO2e/litre | IPCC 2006 Vol2 Ch2 + UK DEFRA 2024 |
| `ng.fuel.lpg.stationary` | LPG — stationary combustion | ~1.63 | kgCO2e/litre | IPCC 2006 Vol2 Ch2 + UK DEFRA 2024 |
| `ng.fuel.cng.stationary` | CNG — stationary combustion | ~2.04 | kgCO2e/kg | IPCC 2006 Vol2 Ch2 |
| `ng.fuel.naturalgas.stationary` | Natural gas — stationary | ~2.04 | kgCO2e/m3 | IPCC 2006 Vol2 Ch2 + NNPC stats |
| `ng.fuel.hfo.stationary` | Heavy fuel oil — stationary | ~3.17 | kgCO2e/litre | IPCC 2006 Vol2 Ch2 |

> **Key design choice:** `kwh.field` (lower efficiency = higher emissions per kWh) is the **recommended default** — reflects real-world performance of Nigeria's aged genset fleet per Somorin et al. 2017 LCA study.

### 3. Fuel Combustion — Mobile / Road Transport (~8 factors)

| Factor ID | Fuel/Vehicle | Unit | Primary Source |
|---|---|---|---|
| `ng.transport.road.petrol.per_litre` | Petrol — fuel-based (no vehicle type) | kgCO2e/litre | IPCC 2006 + UK DEFRA 2024 |
| `ng.transport.road.diesel.per_litre` | Diesel — fuel-based (no vehicle type) | kgCO2e/litre | IPCC 2006 + UK DEFRA 2024 |
| `ng.transport.road.petrol.car` | Petrol car | kgCO2e/km | IPCC 2006 Vol2 Ch3 + ICCT West Africa + WB 2013 km defaults (optional) |
| `ng.transport.road.diesel.car` | Diesel car | kgCO2e/km | IPCC 2006 Vol2 Ch3 + WB 2013 km defaults (optional) |
| `ng.transport.road.petrol.motorcycle` | Petrol motorcycle (okada) | kgCO2e/km | IPCC 2006 Vol2 Ch3 + WB 2013 km defaults (optional) |
| `ng.transport.road.diesel.bus` | Diesel bus (BRT/commercial) | kgCO2e/km | IPCC 2006 Vol2 Ch3 + Lagos stats + WB 2013 km defaults (optional) |
| `ng.transport.road.diesel.truck.small` | Diesel light truck | kgCO2e/km | IPCC 2006 Vol2 Ch3 + WB 2013 km defaults (optional) |
| `ng.transport.road.diesel.truck.heavy` | Diesel HGV | kgCO2e/km | IPCC 2006 Vol2 Ch3 + WB 2013 km defaults (optional) |

> **Design choice for v1:** Fuel-based factors (`kgCO2e/litre`) are the **primary, recommended** road-transport factors because Nigerian fuel-consumption data is more reliable than vehicle-kilometre data. Distance-based factors (`kgCO2e/km`) are derived optionally from World Bank (2013) Nigeria annual-km defaults and must be flagged `confidence=low–medium` with explicit source citations. See `NEFDB/docs/transport_aviation/vkt_gap_verdict.md`.

### 4. Domestic Aviation (~6 factors)

| Factor ID | Route | Value | Unit | Primary Source |
|---|---|---|---|---|
| `ng.aviation.domestic.los_abv` | Lagos (LOS) <-> Abuja (ABV) | ~0.136 | kgCO2e/km per pax | ICAO ICEC v13.1 |
| `ng.aviation.domestic.los_phc` | Lagos (LOS) <-> Port Harcourt (PHC) | ~0.148 | kgCO2e/km per pax | ICAO ICEC v13.1 |
| `ng.aviation.domestic.los_kan` | Lagos (LOS) <-> Kano (KAN) | ~0.127 | kgCO2e/km per pax | ICAO ICEC v13.1 |
| `ng.aviation.domestic.abv_phc` | Abuja (ABV) <-> Port Harcourt (PHC) | ~0.141 | kgCO2e/km per pax | ICAO ICEC v13.1 |
| `ng.aviation.domestic.generic` | Generic domestic — all-route average | ~0.138 | kgCO2e/km per pax | ICAO ICEC v13.1 |
| `ng.aviation.domestic.rf_multiplier` | Radiative forcing multiplier (non-CO2) | 1.9 | multiplier | Lee et al. 2021 |

> **Aviation Methodology:** ICAO ICEC v13.1 applied to Nigeria domestic routes. Aircraft: Boeing 737-500 (dominant per NCAA 2022). Load factor: 72% (NCAA data). RF multiplier is an optional add-on field, not baked into the base value.

### 5. Waste (~6 factors)

| Factor ID | Waste Stream | Unit | Primary Source |
|---|---|---|---|
| `ng.waste.msw.landfill.managed` | MSW — managed landfill | kgCO2e/tonne | IPCC 2006 Vol5 + Nigeria BUR2 |
| `ng.waste.msw.open_dump` | MSW — open dump (dominant Nigeria method) | kgCO2e/tonne | IPCC 2006 Vol5 + Nigeria open-burning data |
| `ng.waste.msw.open_burning` | MSW — open burning | kgCO2e/tonne | IPCC 2006 Vol5 + Nigeria open-burning data |
| `ng.waste.organic.composting` | Organic waste — composting | kgCO2e/tonne | IPCC 2006 Vol5 |
| `ng.waste.wastewater.domestic` | Domestic wastewater treatment | kgCO2e/person-year | IPCC 2006 Vol5 + Nigeria WASH data |
| `ng.waste.wastewater.industrial` | Industrial wastewater treatment | kgCO2e/m3 | IPCC 2006 Vol5 |

> **Nigeria waste context:** ~80%+ of MSW is open-dumped. Open dump factor is the most operationally relevant for most Nigerian companies. Waste composition from Nigeria BUR2: food 60%, paper 10%, plastic 8%.

### 6. Water (~2 factors)

| Factor ID | Process | Unit | Primary Source |
|---|---|---|---|
| `ng.water.treatment.supply` | Water supply treatment — per m3 | kgCO2e/m3 | UK DEFRA 2024 (adapted) |
| `ng.water.treatment.wastewater` | Wastewater treatment — per m3 | kgCO2e/m3 | IPCC 2006 Vol5 + UK DEFRA 2024 |

**Total v1.0 factor count: ~51**

---

## Repository Structure

```
NEFDB/
├── PLAN.md                          <- This file
├── README.md                        <- Public-facing overview
├── METHODOLOGY.md                   <- Full methodology documentation
├── CHANGELOG.md                     <- Version history
├── LICENSE                          <- CC BY-SA 4.0
|
├── package.json
├── tsconfig.json
├── bun.lockb
|
├── src/
│   ├── index.ts                     <- Public API entry point
│   ├── types.ts                     <- EmissionFactor, SourceReference, enums
│   ├── query.ts                     <- get(), query(), list() functions
│   |
│   ├── factors/
│   │   ├── grid_electricity.ts
│   │   ├── fuel_combustion.ts
│   │   ├── transport.ts
│   │   ├── aviation.ts
│   │   ├── waste.ts
│   │   └── water.ts
│   |
│   └── sources/
│       └── index.ts                 <- Canonical SourceReference registry
|
├── data/
│   ├── nefdb_v1.json                <- Flat JSON (all languages/tools)
│   └── nefdb_v1.csv                 <- Flat CSV (Excel/spreadsheet users)
|
├── scripts/
│   ├── build_csv.ts
│   ├── build_json.ts
│   └── validate.ts
|
├── methodology/
│   ├── NEFDB_Methodology_v1.0.pdf
│   ├── progressive/
│   │   ├── phase_00_bootstrap.md
│   │   ├── phase_01_grid_electricity.md
│   │   ├── phase_02_fuel_combustion.md
│   │   ├── phase_03_aviation.md
│   │   ├── phase_04_waste_water.md
│   │   ├── phase_05_export_docs.md
│   │   ├── phase_06_testing.md
│   │   └── phase_07_publication.md
│   ├── grid_electricity.md
│   ├── fuel_combustion.md
│   ├── transport.md
│   ├── aviation.md
│   └── waste_water.md
|
├── datasets/                        <- gitignored (raw data, kept locally)
└── docs/                            <- gitignored (source documents, kept locally)
```

---

## API Design

```typescript
import { nefdb } from "@palmgrove/nefdb";

// ---- GET a single factor ----

// Minimal
nefdb.get("ng.grid.national.cm.2021");
// -> { id, value: 0.573, unit: "kgCO2e_per_kWh" }

// With source citation (optional arg)
nefdb.get("ng.grid.national.cm.2021", { withSource: true });
// -> { id, value: 0.573, unit: "kgCO2e_per_kWh", source: { title, publisher, url, year, page } }

// Full record
nefdb.get("ng.grid.national.cm.2021", { full: true });
// -> EmissionFactor (all fields)

// ---- QUERY / FILTER ----
nefdb.query({ category: "grid_electricity" });
nefdb.query({ category: "grid_electricity", disco: "IEDC" });
nefdb.query({ scope: 1 });

// ---- ERGONOMIC HELPERS ----
nefdb.grid.national();            // -> Combined Margin (default)
nefdb.grid.national("om");        // -> Operating Margin
nefdb.grid.disco("AEDC");         // -> Abuja DisCo EF
nefdb.fuel.diesel();              // -> { per_litre, per_kwh: { rated, field } }
nefdb.fuel.lpg();                 // -> { per_litre, per_kg }
nefdb.transport.road("petrol", "car");    // -> EF per km
nefdb.aviation.route("LOS", "ABV");       // -> EF per passenger-km
nefdb.aviation.route("LOS", "ABV", { rf: true }); // -> with radiative forcing

// ---- LIST ALL ----
nefdb.list();                     // -> EmissionFactor[] (minimal fields)
nefdb.list({ withSource: true }); // -> with source on each record

// ---- METADATA ----
nefdb.version();                  // -> "1.0.0"
nefdb.sources();                  // -> SourceReference[] all unique sources used
```

### CSV Column Schema

`id, category, subcategory, description, value, unit, gwp_basis, scope, data_year, country, disco, confidence, uncertainty_pct, source_id, source_title, source_publisher, source_year, source_url, source_page, methodology_note`

Every row has a populated `source_title`. The CSV is the primary deliverable for sustainability officers, consultants, regulators, and journalists — no code required.

---

## Implementation Phases

### Phase 0 — Repository Bootstrap (Day 1)

**Goal:** Working npm package scaffold, types, validation, tests passing, zero factors yet.

- [ ] `bun init` with package name `@palmgrove/nefdb`
- [ ] Define `src/types.ts`: EmissionFactor, SourceReference, FactorCategory, FactorUnit, DisCo enum
- [ ] Define `src/sources/index.ts`: all 35+ SourceReference objects keyed by ID
- [ ] Write `src/query.ts`: get(), query(), list() against empty array (no factors yet)
- [ ] Write ergonomic helper API: nefdb.grid.*, nefdb.fuel.*, nefdb.transport.*, nefdb.aviation.*
- [ ] Write `scripts/validate.ts`: checks every factor has valid sourceId, all required fields
- [ ] Set up Bun test runner: single passing test ("nefdb.list() returns an array")
- [ ] Write `scripts/build_csv.ts` and `scripts/build_json.ts`
- [ ] GitHub Actions: test + validate on push

**Documentation for this phase:** all bootstrap decisions — type/interface choices, source ID conventions, validation rules, API shape, and CI setup — must be recorded in `methodology/progressive/phase_00_bootstrap.md`.

**Verify:** `bun test` passes, `bun run validate` passes (no factors = no errors), `bun run build:csv` runs without errors.

---

### Phase 1 — Grid Electricity Factors (Days 2–4)

**1a. National Grid EFs — 0.5 day (High confidence)**
- Extract from WAPP ASB0034-2021 directly: OM=0.578, BM=0.556, CM=0.573 tCO2/MWh
- Cross-check with IGES Grid EF v11.7 (March 2026) for Nigeria/West Africa where applicable
- Attach SourceReference for WAPP ASB0034-2021, UNFCCC CDM Tool 07, and IGES_GRID_EF_V11_7_20260309
- Write `methodology/grid_electricity.md` WAPP section (numbered derivation steps)

**1b. Derived Location-Based National EF — 1 day**
- From `datasets/grid_electricity/energy_databank_generation_by_plant.csv` and `datasets/grid_electricity/ELECTRICITY_DATA_2015-Q2_2024.xlsx`:
  1. Aggregate generation by fuel type (gas, hydro, oil, solar) for the most recent full year
  2. Apply IPCC fuel EFs to thermal generation; hydro/solar = 0
  3. Weighted average: sum(emissions_per_type) / sum(total_generation) = location EF
- Populate `ng.grid.national.location.2024`
- Document uncertainty: +/-15% (energy databank gives plant-level granularity, improving confidence)

**1c. DisCo-Level EFs — 1.5 days**
Methodology steps:
1. Pull each DisCo share of national billed energy (GWh) from NBS Q4 2023 table and `ELECTRICITY_DATA_2015-Q2_2024.xlsx`
2. Map each DisCo to its geographic service area and dominant generation sources using `energy_databank_generation_by_plant.csv`:
   - Northern DisCos (AEDC, JEDC, KDEDC, KEDC, YEDC): heavier hydro (Kainji, Jebba, Shiroro)
   - Southern DisCos (EKEDC, EEDC, PEDC): heavier gas (NIPP plants in Delta, Rivers)
   - Western/Central (IBEDC, IEDC, BEDC): mixed
3. Weight generation mix per DisCo from plant-by-plant data
4. Apply IPCC fuel EFs per generation type
5. Divide total DisCo emissions by DisCo billed energy = DisCo EF
6. Apply +/-20% uncertainty, confidence: medium (down from 25% thanks to plant-level data)
- Populate all 11 DisCo EFs

**Documentation for this phase:** everything done in Phase 1 — source extractions, calculation notebooks, intermediate CSVs, and methodology notes — must be saved to `methodology/progressive/phase_01_grid_electricity.md`.

**Verify:** 15 grid factors present and sourced, validation passes, CSV exports.

---

### Phase 2 — Fuel Combustion Factors (Day 5)

**2a. Stationary combustion — 0.5 day**
- Extract NCV + emission factor per fuel from IPCC 2006 Vol2 Ch2 MD (Table 2.2)
- Cross-check with UK DEFRA 2024 XLSX conversion factors
- Agreement within 2%: use IPCC primary, DEFRA as corroboration
- Diesel kWh variants:
  - rated: diesel_EF_per_litre / (0.33 * 3.6) = kgCO2e/kWh
  - field: diesel_EF_per_litre / (0.28 * 3.6) = kgCO2e/kWh [DEFAULT]
  - Source: Somorin et al. 2017 for field efficiency value
- Populate 8 stationary factors

**2b. Mobile combustion — 0.5 day**
- Extract vehicle-type EFs from IPCC 2006 Vol2 Ch3 MD
- Apply ICCT West Africa correction for fleet age/condition
- Populate 8 road transport factors
- Write `methodology/fuel_combustion.md`

**Documentation for this phase:** store extraction tables, NCV/fuel EF reconciliation notes, vehicle correction logic, and `methodology/fuel_combustion.md` draft in `methodology/progressive/phase_02_fuel_combustion.md`.

**Verify:** All 16 fuel/transport factors present, validation passes.

---

### Phase 3 — Aviation Factors (Day 6)

Apply ICAO ICEC v13.1 methodology to Nigeria domestic routes:
1. Calculate great-circle distance per route (LOS-ABV, LOS-PHC, LOS-KAN, ABV-PHC)
2. Add 9% uplift for indirect routing (ICAO standard)
3. Select representative aircraft: Boeing 737-500 (dominant per NCAA 2022 executive summary)
4. Apply ICAO fuel burn coefficients for 737-500
5. Convert: 3.16 kg CO2 per kg jet fuel (IPCC value)
6. Divide by seats x load factor (72% per NCAA data)
7. Result: kgCO2e per passenger-km per route

- RF multiplier from Lee et al. 2021: 1.9x (optional add-on field, not in base value)
- Populate 5 route EFs + RF multiplier
- Write `methodology/aviation.md`

**Documentation for this phase:** route-distance calculations, aircraft/load-factor assumptions, ICAO coefficient sources, and RF multiplier rationale go into `methodology/progressive/phase_03_aviation.md`.

**Verify:** All 6 aviation factors present, methodology documented.

---

### Phase 4 — Waste & Water Factors (Day 7)

**4a. Waste — 0.75 day**
- Use IPCC FOD model (XLS we have) with Nigeria-specific inputs:
  - Waste composition from Nigeria BUR2: food 60%, paper 10%, plastic 8%, other 22%
  - Climate zone: tropical Nigeria
  - Methane correction factor: 0.6 for open dump (unmanaged open site, IPCC default)
- Open burning from IPCC Vol5 Table 5.3 + Nigeria open-burning factsheet
- Cross-check against Nigeria BUR2 reported waste sector emissions per tonne
- Populate 6 waste factors

**4b. Water — 0.25 day**
- IPCC Vol5 Ch6 + UK DEFRA 2024
- Nigeria classified as "developing" → apply IPCC BOD-based calculation
- Populate 2 water factors
- Write `methodology/waste_water.md`

**Documentation for this phase:** IPCC FOD model inputs, Nigeria waste composition sources, BOD/TOW assumptions, and water-treatment methodology go into `methodology/progressive/phase_04_waste_water.md`.

**Verify:** All 8 waste/water factors present, validation passes.

---

### Phase 5 — Data Export + Documentation (Day 8)

- `bun run build:csv` -> `data/nefdb_v1.csv`
- `bun run build:json` -> `data/nefdb_v1.json`
- Write `METHODOLOGY.md` (combines all methodology/*.md sections)
- Convert to PDF using pandoc
- Write `README.md` — public-facing with quickstart examples
- Write `CHANGELOG.md` — v1.0.0 entry with full factor list
- Audit: every factor in CSV has populated source_url or source_title
- **Publish source datasets and docs to Cloudflare R2:** follow `PUBLISH_DATASETS.md`. Start with the stable domains (grid_electricity first), upload via script, deploy the download Worker, and add the public URL to `README.md`.

**Documentation for this phase:** build scripts, export validation results, final `METHODOLOGY.md`/`README.md`/`CHANGELOG.md` drafts, PDF-generation steps, and R2 publication notes are recorded in `methodology/progressive/phase_05_export_docs.md`.

---

### Phase 6 — Testing + Validation (Day 9)

```
tests/
├── schema.test.ts          <- Every factor matches EmissionFactor interface
├── sources.test.ts         <- Every sourceId in factors exists in sources/index.ts
├── completeness.test.ts    <- All ~51 expected factor IDs are present
├── values.test.ts          <- Spot-check known values (WAPP CM = 0.573 +/- 0.001)
├── query.test.ts           <- get(), query(), list() correct behaviour
├── api.test.ts             <- nefdb.grid.national(), nefdb.fuel.diesel() etc.
└── csv.test.ts             <- CSV has correct columns, no empty source fields
```

Manual spot-checks:
- WAPP CM: 0.573 tCO2/MWh — verify against raw WAPP ASB0034-2021 document
- Diesel stationary: ~2.68 kgCO2/litre — verify against IPCC Table 2.2 values
- Diesel kWh field: arithmetic check with Somorin 28% efficiency assumption
- Aviation LOS-ABV: cross-check result against ICAO ICEC online calculator

**Documentation for this phase:** test plans, test outputs, spot-check evidence (screenshots/calculations), and any bug-fix notes go into `methodology/progressive/phase_06_testing.md`.

---

### Phase 7 — npm Publication (Day 10)

- Confirm package.json: name, version, license, exports map correct
- `bun run build` — compile TypeScript to `dist/`
- `npm publish --access public` from Irenium Ltd npm org
- Tag Git release: `v1.0.0`
- GitHub release notes: factor count, source list, methodology PDF attached
- Submit to FRC Nigeria ARWG: methodology PDF + GitHub link
- Submit to NGX Sustainability Team: same package

**Documentation for this phase:** publish commands, npm/GitHub release links, regulator submission receipts, and any post-publish corrections go into `methodology/progressive/phase_07_publication.md`.

---

## Accuracy Strategy (Most Important Section)

NEFDB's credibility is entirely dependent on how we handle accuracy. These five principles are non-negotiable.

### Principle 1: Source Hierarchy (Prefer Closer to Nigeria)
```
Tier 1 (highest): Nigeria official data — WAPP, NERC, NBS, NNPC, Nigeria BUR2/BTR/NIR
Tier 2: West Africa regional — WAPP regional, ECOWAS energy reports
Tier 3: IPCC 2006/2019 defaults for developing countries
Tier 4: DEFRA/EPA with documented applicability note
```
Every factor record includes its source tier.

### Principle 2: Uncertainty Ranges
- Direct government-sourced values: +/-10–15%
- Derived/calculated values: +/-15–25%
- IPCC Tier 1 applied to Nigeria: +/-25–50%

We never publish a factor without its uncertainty range.

### Principle 3: Conservative Defaults
Where two credible values differ and we cannot resolve which is more accurate for Nigeria, we use the higher (more conservative = higher emissions) value. This prevents companies from under-reporting. The alternative value and our rationale are documented.

### Principle 4: Transparent Derivation
Every derived factor has a numbered step-by-step derivation in methodology/*.md. A qualified expert should be able to reproduce every number with access to the cited source documents alone.

### Principle 5: Annual Update Commitment
- v1.0 uses data years 2021–2024
- Grid EF: annual update when NERC publishes new annual report (target: Q1 each year)
- Combustion EFs: biennial review aligned with IPCC/DEFRA update cycles
- Semantic versioning: patch (0.0.x) for data corrections; minor (0.x.0) for new factors; major (x.0.0) for breaking schema changes

---

## Source Registry (v1 Canonical — 32 Sources)

| ID | Title | Publisher | Year | Category |
|---|---|---|---|---|
| `WAPP_ASB0034_2021` | Standardized Baseline for WAPP including Nigeria (ASB0034-2021) | UNFCCC / WAPP | 2021 | Grid EF |
| `WAPP_ASB0034_ASSESSMENT` | Assessment Report ASU006 ASB0034 WAPP | UNFCCC / WAPP | 2021 | Grid EF |
| `NERC_2024_ANNUAL` | NERC 2024 Annual Report | NERC | 2024 | Grid data |
| `NERC_2023_ANNUAL` | NERC 2023 Annual Report | NERC | 2023 | Grid data |
| `NERC_2022_ANNUAL` | NERC 2022 Annual Report | NERC | 2022 | Grid data |
| `NERC_2024_Q4` | NERC Quarterly Report Q4 2024 | NERC | 2024 | Grid data |
| `NBS_ELECTRICITY_Q4_2023` | Nigeria Electricity Report Q4 2023 | NBS | 2024 | DisCo billing |
| `NBS_ELECTRICITY_DATA_2015_Q2_2024` | Nigeria Electricity Data 2015–Q2 2024 | NBS | 2024 | Generation & distribution |
| `ENERGY_DATABANK_GENERATION` | Nigerian Energy Data Bank — Power Plant Generation Statistics | Federal Ministry of Energy / Energy Data Bank | 2024 | Generation-by-plant |
| `IGES_GRID_EF_V11_7_20260309` | IGES List of Grid Emission Factors v11.7 | IGES | 2026 | Grid EF benchmarks |
| `IPCC_2006_VOL2_CH2` | IPCC 2006 Guidelines Vol 2 Ch 2 Stationary Combustion | IPCC | 2006 | Combustion EFs |
| `IPCC_2006_VOL2_CH3` | IPCC 2006 Guidelines Vol 2 Ch 3 Mobile Combustion | IPCC | 2006 | Mobile combustion |
| `IPCC_2006_VOL5` | IPCC 2006 Guidelines Vol 5 Waste | IPCC | 2006 | Waste EFs |
| `IPCC_2019_REFINEMENTS` | 2019 Refinement to IPCC 2006 Guidelines | IPCC | 2019 | All categories |
| `DEFRA_2024_FULL` | UK DESNZ/DEFRA 2024 GHG Conversion Factors Full Set | UK DESNZ | 2024 | Benchmark EFs |
| `DEFRA_2026_METHODOLOGY` | DESNZ 2026 GHG Conversion Factors Methodology | UK DESNZ | 2026 | Methodology |
| `EPA_GHG_HUB_2024` | EPA GHG Emission Factors Hub 2024 | US EPA | 2024 | Benchmark EFs |
| `GHG_PROTOCOL_CORPORATE` | GHG Protocol Corporate Standard (Revised) | WRI / WBCSD | 2015 | Methodology |
| `GHG_PROTOCOL_SCOPE2` | GHG Protocol Scope 2 Guidance | WRI / WBCSD | 2015 | Grid EF methodology |
| `ICAO_ICEC_V13` | ICAO Carbon Emissions Calculator Methodology v13.1 | ICAO | 2023 | Aviation EFs |
| `LEE_ET_AL_2021` | Contribution of global aviation to anthropogenic climate forcing | Atmospheric Environment | 2021 | Aviation RF |
| `NCAA_EXEC_2022` | NCAA Executive Summary Jan-Dec 2022 | NCAA | 2023 | Aviation fleet data |
| `ICCT_SOOTFREE_2019` | Soot-Free Transport for Nigeria | ICCT | 2019 | Road transport |
| `WB_LAGOS_AIR_2021` | Lagos Air Quality Management (World Bank) | World Bank | 2021 | Transport context |
| `NESREA_VEH_2011` | National Environmental (Vehicular) Regulations 2011 | NESREA | 2011 | Regulatory context |
| `NNPC_STATS_2023` | NNPC Annual Statistics Bulletin S3 | NNPC | 2023 | Fuel consumption |
| `SOMORIN_2017` | Life cycle assessment of self-generated electricity in Nigeria | Somorin et al., Renewable Energy | 2017 | Genset efficiency |
| `NIGERIA_BUR2` | Nigeria Second Biennial Update Report to UNFCCC | Federal Republic of Nigeria | 2022 | Waste, grid context |
| `NIGERIA_BTR1` | Nigeria First Biennial Transparency Report | Federal Republic of Nigeria | 2024 | Grid, emissions |
| `NIGERIA_NIR1` | Nigeria First National Inventory Report 2000-2017 | Federal Republic of Nigeria | 2021 | Baseline emissions |
| `EIA_NIGERIA_2025` | Nigeria Country Analysis Brief | US EIA | 2025 | Grid context |
| `IRENA_REMAP_2023` | Renewable Energy Roadmap: Nigeria (IRENA REMap) | IRENA | 2023 | Grid context |
| `IPCC_WASTE_FOD` | IPCC FOD Model for MSW | IPCC | 2006 | Waste CH4 calculation |
| `NIGERIA_OPEN_BURNING` | Nigeria Open Burning Factsheet | regulatory_mrv datasets | 2021 | Waste combustion |
| `UNFCCC_CDM_TOOL07` | UNFCCC CDM Methodological Tool 07 v7.0 | UNFCCC | 2021 | Grid EF methodology |

---

## What This Does Not Cover (v2+ Scope)

Explicitly out of scope for v1.0:
- **Scope 3** factors (upstream supply chain, purchased goods) — too broad for v1
- **Gas flaring** — O&G sector; global gas flaring database downloaded, staged for v2
- **Refrigerants (F-gases)** — HFC/PFC/SF6; relevant for cold chain industry; v2
- **Industrial process emissions** (cement, steel, fertiliser) — v2
- **Carbon intensity of grid by time of day** — real-time marginal EF; future API product
- **State/regional mix annual updates** — v1 uses 2023-2024 data; refreshed annually

---

## npm Package Configuration

```json
{
  "name": "@palmgrove/nefdb",
  "version": "1.0.0",
  "description": "Nigeria Emission Factor Database — the first open, versioned emission factor database for Nigerian operations",
  "keywords": ["nigeria", "emission-factors", "ghg", "carbon", "sustainability", "ESG", "scope1", "scope2"],
  "homepage": "https://github.com/IreniumLtd/nefdb",
  "repository": { "type": "git", "url": "https://github.com/IreniumLtd/nefdb" },
  "license": "CC-BY-SA-4.0",
  "author": "Irenium Ltd <hello@palmgrove.ng>",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./data/json": "./data/nefdb_v1.json",
    "./data/csv": "./data/nefdb_v1.csv"
  },
  "files": ["dist/", "data/", "README.md", "METHODOLOGY.md", "CHANGELOG.md"],
  "scripts": {
    "build": "bun build src/index.ts --outdir dist --format esm",
    "build:csv": "bun run scripts/build_csv.ts",
    "build:json": "bun run scripts/build_json.ts",
    "validate": "bun run scripts/validate.ts",
    "test": "bun test",
    "prepublishOnly": "bun run validate && bun run test && bun run build && bun run build:csv && bun run build:json"
  }
}
```

---

## Timeline Summary

| Day | Phase | Deliverable |
|---|---|---|
| 1 | Phase 0 — Bootstrap | Scaffold, types, source registry, validation, CI |
| 2–4 | Phase 1 — Grid Electricity | 15 grid EFs (national + location-based + 11 DisCos) |
| 5 | Phase 2 — Fuel Combustion | 16 combustion EFs (stationary + mobile) |
| 6 | Phase 3 — Aviation | 6 domestic aviation EFs + RF multiplier |
| 7 | Phase 4 — Waste & Water | 8 waste/water EFs |
| 8 | Phase 5 — Export + Docs | CSV, JSON, methodology PDF, README |
| 9 | Phase 6 — Testing | Full test suite, spot-checks, validation pass |
| 10 | Phase 7 — Publish | `@palmgrove/nefdb@1.0.0` live on npm + GitHub release + FRC/NGX outreach |

**Total factors: ~51 | Sources cited: 35+ | Implementation: 10 working days**

---

## Gap Fill — Extract Before Coding

Before Phase 0 begins, extract these values from documents we already have:

| Value Needed | Source File | Action |
|---|---|---|
| Nigeria generation by fuel type (2005–2024, plant-level) | `datasets/grid_electricity/energy_databank_generation_by_plant.csv` + `datasets/grid_electricity/ELECTRICITY_DATA_2015-Q2_2024.xlsx` | **[RESOLVED — Phase 1 enrichment]** Reconciled 2020–2024 generation-by-fuel; corrected 2020 hydro unit errors using NEDB plant records; adopted 2024 NERC/Guardian total and hydro. Values used in `ng.grid.national.location.2024` and all `ng.grid.disco.*.2024` factors. |
| IPCC 2006 NCVs — diesel, petrol, LPG, CNG, natural gas | `docs/international_ef_databases/IPCC2006_Vol2_V2_2_Ch2_Stationary_Combustion.md` | Table 2.2 |
| NCAA 2022 domestic fleet type distribution | `datasets/transport_aviation/ncaa_executive_summary_2022.pptx` | Manual review of slides |
| Nigeria waste composition (food/paper/plastic %) | `docs/waste_water/NIGERIA BUR 2 - Second Biennial Update Report (BUR2).md` | Waste chapter |
| Nigeria genset efficiency in field | `docs/fuel_combustion/rank15_Somorin_etal_RE2017_Life_cycle_assessment_of_self_generated_electricity_in_Nigeria.md` | Results section |
| ICCT fuel efficiency for West Africa vehicles | `docs/fuel_combustion/rank6_ICCT_Sootfree_transport_20190826.md` | Nigeria section |
| Road VKT / annual-km defaults | `docs/transport_aviation/vkt_gap_verdict.md` + `docs/transport_aviation/vkt_web_research.md` | Use World Bank (2013) annual-km defaults for optional distance-based factors; flag `confidence=medium` |

These extractions run in parallel with Phase 0 bootstrap; they do not block it.

---

## Distribution Beyond npm

| Channel | Format | Target User |
|---|---|---|
| GitHub Releases | `nefdb_v1.csv` + `METHODOLOGY_v1.0.pdf` | Sustainability officers, consultants |
| npmjs.com | `@palmgrove/nefdb` TypeScript package | Developers, `@palmgrove/calc` users |
| palmgrove.ng/nefdb | Web factor lookup + download | Any user — no code needed |
| Email to FRC/NGX | Methodology PDF + GitHub link | Regulators |
| v2 (future): REST API | `GET /factors?id=...` | Non-JS environments, Excel Power Query |

For v1: focus on **npm + CSV**. The CSV is the great equaliser — any Nigerian consultant with Excel can use it immediately. The methodology PDF is what makes it credible to regulators.

---

## Success Criteria for v1.0

- [ ] ~51 factors published with zero unsourced entries
- [ ] National grid EF reproducible by any qualified engineer from methodology PDF alone
- [ ] All 11 DisCo EFs covered, flagged medium confidence, methodology documented
- [ ] Diesel kWh: two variants (rated/field), Somorin 2017 cited, field is default recommended
- [ ] `bun add @palmgrove/nefdb` works; TypeScript types ship with package
- [ ] CSV download: all columns populated including source_url or source_title per row
- [ ] `bun test` -> 100% pass, validate script -> 0 errors
- [ ] Methodology PDF submitted to FRC Nigeria ARWG within 2 weeks of publish

---

*NEFDB is Nigeria's first open emission factor database. This document is the ground truth for everything that gets built.*  
*Palmgrove by Irenium Ltd — NEFDB Plan v1.0 — June 2026*
