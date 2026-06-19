# Publish NEFDB Datasets and Documentation to Cloudflare R2

## Goal
Make all NEFDB source datasets and documentation publicly downloadable via a Cloudflare R2 bucket and a Cloudflare Worker. This is separate from the npm package: it lets researchers, regulators, and auditors inspect the raw data and source documents behind every emission factor.

## When to do this
Phase 5 (Data Export + Documentation). Do not block Phase 2–4 with this task; it can run in parallel once a domain's data is stable.

## Prerequisites
- Cloudflare account with R2 enabled
- R2 bucket created: `nefdb`
- Credentials stored in `C:\Users\HP\palmgrove\.env.local`:
  - `CLOUDFLARE_ACCOUNT_ID`
  - `CLOUDFLARE_API_TOKEN`
  - `R2_ACCESS_KEY`
  - `R2_SECRET_ACCESS_KEY`

## R2 key hierarchy

```
nefdb/
├── grid_electricity/
│   ├── main/
│   │   ├── datasets/     <- primary datasets cited in factor records
│   │   └── docs/         <- primary source docs cited in methodology
│   ├── additional/
│   │   ├── datasets/     <- supporting/corroborating datasets
│   │   └── docs/         <- supporting/corroborating docs
│   └── derived/
│       ├── datasets/     <- intermediate calculation outputs
│       └── docs/         <- calculation notes, verdicts, logs
├── fuel_combustion/
│   ├── main/
│   ├── additional/
│   └── derived/
├── transport_aviation/
│   ├── main/
│   ├── additional/
│   └── derived/
├── waste_water/
│   ├── main/
│   ├── additional/
│   └── derived/
├── regulatory_mrv/
│   ├── main/
│   ├── additional/
│   └── derived/
└── international_ef_databases/
    ├── main/
    ├── additional/
    └── derived/
```

### Classification rules
- **main** — files explicitly cited in `src/factors/*.ts` records or in `methodology/progressive/phase_*.md`.
- **additional** — everything else downloaded for that domain, including alternatives not used in final factors.
- **derived** — calculation outputs, intermediate CSVs, reconciliation tables, validation reports, gap verdicts.

## Deliverables

1. **Upload script**
   - Suggested: Python or Bun/Node script using `@aws-sdk/client-s3` or `rclone`.
   - Reads `C:\Users\HP\palmgrove\NEFDB\datasets\` and `C:\Users\HP\palmgrove\NEFDB\docs\`.
   - Maps local paths to the R2 key hierarchy above.
   - Handles large files, retries, content-type detection.

2. **Cloudflare Worker**
   - Public URL for browsing and downloading files.
   - Routes:
     - `/` — list domains
     - `/<domain>/` — list main / additional / derived
     - `/<domain>/<subfolder>/` — list datasets / docs
     - `/<domain>/<subfolder>/<type>/<file>` — serve file with `Content-Disposition: attachment`
   - Deploy with Wrangler.

3. **Manifest approach (recommended)**
   - Upload script also writes a `manifest.json` to the bucket root.
   - Worker reads `manifest.json` to render dynamic indexes instead of listing the bucket on every request.
   - Manifest makes it easier to add new domains/files without redeploying the Worker.

4. **Documentation link**
   - Add the Worker URL to `README.md` and to `methodology/progressive/phase_05_export_docs.md`.

## Suggested starting domain
Grid electricity is the first stable domain. Start with just `grid_electricity/`, validate the upload and Worker behavior, then extend to other domains in Phase 5.

## Notes
- Do not commit R2 credentials.
- Do not commit raw datasets/docs; they remain gitignored.
- The Worker is stateless; the bucket is the single source of truth.
