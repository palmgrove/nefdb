# NEFDB - Nigeria Emission Factor Database

NEFDB publishes versioned Scope 1 and Scope 2 emission factors for Nigerian operations.

## What is NEFDB?

The Nigeria Emission Factor Database (NEFDB) is an open, versioned collection of emission factors built specifically for Nigerian grid electricity, fuel combustion, transport, and waste operations. Each factor is traceable to source data and calculation notes so the figures can be audited and reproduced.

It is designed for:

- Researchers studying Nigerian greenhouse gas emissions
- Regulators and auditors reviewing corporate carbon disclosures
- Sustainability teams preparing reports for NGX, FRC, and SEC Nigeria
- Developers building carbon accounting tools for Nigerian companies

## Public datasets

All NEFDB source datasets, documents, and derived calculation outputs are published through the public R2 Worker:

**`https://nefdb-r2-publisher.ugbodagadavid.workers.dev`**

Published domains:

| Domain             | Worker route                                          |
|--------------------|------------------------------------------------------|
| Grid electricity   | `/grid_electricity/`                                 |
| Fuel combustion    | `/fuel_combustion/`                                  |
| Transport aviation | `/transport_aviation/`                               |
| Waste water        | `/waste_water/`                                      |

Each domain contains `main`, `additional`, and `derived` folders for datasets and documentation.

## Installation

Add the package with Bun, npm, pnpm, or Yarn:

```bash
bun add @palmgrove/nefdb
```

```bash
npm install @palmgrove/nefdb
```

## Usage

Import the database API from the package:

```typescript
import { nefdb } from "@palmgrove/nefdb";

// List every factor in the current version
const all = nefdb.list();

// Include source records
const withSources = nefdb.list({ withSource: true });

// Include full factor records
const full = nefdb.list({ full: true });
```

### Fuel combustion

```typescript
import { nefdb } from "@palmgrove/nefdb";

const diesel = nefdb.fuel.diesel();
console.log(diesel?.per_litre.value);  // kgCO2e per litre
console.log(diesel?.per_kwh.field?.value); // recommended for aged generator fleets
```

### Road transport

```typescript
const byFuel = nefdb.transport.road("diesel");
const byVehicle = nefdb.transport.road("diesel", "car");
```

### Domestic aviation

```typescript
const route = nefdb.aviation.route("LOS", "ABV");
const withRf = nefdb.aviation.route("LOS", "ABV", { rf: true });
```

### Waste

```typescript
const landfill = nefdb.waste.msw("landfill_managed");
const domesticWastewater = nefdb.waste.wastewater("domestic");
```

### Raw data files

The current release also ships as JSON and CSV exports:

```typescript
import csv from "@palmgrove/nefdb/data/csv";          // string
import factors from "@palmgrove/nefdb/data/json";     // EmissionFactor[]
```

If you prefer to read the static files directly, you can still resolve them from the package root:

```typescript
import { readFileSync } from "node:fs";

const csv = readFileSync(
  new URL("@palmgrove/nefdb/data/nefdb_v1.csv", import.meta.url),
  "utf8"
);

const json = JSON.parse(
  readFileSync(
    new URL("@palmgrove/nefdb/data/nefdb_v1.json", import.meta.url),
    "utf8"
  )
);
```

## Methodology

Every factor in NEFDB is derived from documented source data and calculation steps. See [`METHODOLOGY.md`](METHODOLOGY.md) for the full derivation methodology and audit trail.

## Changelog

Version history is recorded in [`CHANGELOG.md`](CHANGELOG.md).

## License

NEFDB is released under the [CC-BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/) license.

Copyright (c) Irenium Ltd <hello@palmgrove.ng>.

## Contributing and audit trail

All derived values, figures, tables, and derived data in NEFDB must be supported by documentation that explains how they were calculated.

If you are contributing a new factor or revising an existing one, please:

1. Add the derivation notes and source references under the relevant domain folder.
2. Record the change in [`CHANGELOG.md`](CHANGELOG.md).
3. Run the validation and test suite before publishing:

```bash
bun run validate
bun test
```

## Repository

- GitHub: [https://github.com/palmgrove/nefdb](https://github.com/palmgrove/nefdb)
- Current version: `1.0.2`
