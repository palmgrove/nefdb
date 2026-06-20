# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-20

### Added

- Grid electricity emission factors (15 factors): national grid margin factors from WAPP ASB0034-2021, national location-based factor from reconciled 2024 generation mix, and 11 DisCo-level location-based factors.
- Stationary fuel combustion emission factors.
- Road transport and aviation emission factors.
- Waste and wastewater emission factors.
- Published NEFDB datasets and documentation to Cloudflare R2 Worker at https://nefdb-r2-publisher.ugbodagadavid.workers.dev.

### Methodology

- See [METHODOLOGY.md](METHODOLOGY.md) for derivation details and audit trail.

### Data

- 45 emission factors in total across grid electricity, fuel combustion, transport, aviation, waste, and water.
- Major datasets: WAPP ASB0034-2021 and reconciled 2024 Nigerian generation mix.
