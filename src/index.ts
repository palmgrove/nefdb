import * as aviation from "./api/aviation.ts";
import * as fuel from "./api/fuel.ts";
import * as grid from "./api/grid.ts";
import * as transport from "./api/transport.ts";
import * as waste from "./api/waste.ts";
import * as water from "./api/water.ts";
import { allFactors } from "./factors/index.ts";
import type { SourceReference } from "./types.ts";
import { get, list, query } from "./query.ts";

export { get, list, query };
export type * from "./types.ts";
export { aviation, fuel, grid, transport, waste, water };

function usedSources(): SourceReference[] {
  const seen = new Map<string, SourceReference>();
  for (const factor of allFactors) {
    seen.set(factor.source.id, factor.source);
    for (const source of factor.additional_sources ?? []) {
      seen.set(source.id, source);
    }
  }
  return Array.from(seen.values());
}

export const nefdb = {
  list,
  get,
  query,
  aviation,
  fuel,
  grid,
  transport,
  waste,
  water,
  version: () => "1.0.0",
  sources: usedSources,
};
