import { expect, test } from "bun:test";
import { allFactors } from "../src/factors/index.ts";
import { sourcesById } from "../src/sources/index.ts";

test("every factor source id resolves to the canonical source registry", () => {
  for (const factor of allFactors) {
    expect(sourcesById[factor.source.id]).toBeDefined();
    for (const source of factor.additional_sources ?? []) {
      expect(sourcesById[source.id]).toBeDefined();
    }
  }
});
