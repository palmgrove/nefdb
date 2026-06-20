import { expect, test } from "bun:test";
import { nefdb } from "../src/index.ts";

test("get() returns minimal view by default", () => {
  const result = nefdb.get("ng.grid.national.cm.2021");
  expect(result).toEqual({
    id: "ng.grid.national.cm.2021",
    value: 0.573,
    unit: "kgCO2e_per_kWh",
  });
});

test("get() withSource includes source", () => {
  const result = nefdb.get("ng.grid.national.cm.2021", { withSource: true });
  expect(result).toBeDefined();
  expect(result).toHaveProperty("source");
  // @ts-expect-error source is present in withSource variant
  expect(result.source.title).toBeDefined();
  // @ts-expect-error source is present in withSource variant
  expect(result.source.publisher).toBeDefined();
});

test("get() full returns complete EmissionFactor", () => {
  const result = nefdb.get("ng.grid.national.cm.2021", { full: true });
  expect(result).toBeDefined();
  expect(result).toHaveProperty("methodology_note");
  expect(result).toHaveProperty("confidence");
});

test("get() returns undefined for unknown id", () => {
  expect(nefdb.get("ng.does.not.exist")).toBeUndefined();
});

test("query() filters by category", () => {
  const grid = nefdb.query({ category: "grid_electricity" });
  expect(grid).toHaveLength(15);
  const transport = nefdb.query({ category: "transport" });
  expect(transport).toHaveLength(8);
});

test("query() filters by scope", () => {
  const scope1 = nefdb.query({ scope: 1 });
  expect(scope1).toHaveLength(28);
  const scope2 = nefdb.query({ scope: 2 });
  expect(scope2).toHaveLength(17);
});

test("query() filters by disco", () => {
  const results = nefdb.query({ disco: "AEDC" });
  expect(results).toHaveLength(1);
  expect(results[0]!.id).toBe("ng.grid.disco.aedc.2024");
});

test("list() returns 45 minimal factors by default", () => {
  const results = nefdb.list();
  expect(results).toHaveLength(45);
  const first = results[0]!;
  expect(Object.keys(first).sort()).toEqual(["id", "unit", "value"]);
});

test("list() withSource returns factors with source", () => {
  const results = nefdb.list({ withSource: true });
  expect(results).toHaveLength(45);
  const first = results[0]!;
  expect(first).toHaveProperty("source");
});

test("list() full returns complete EmissionFactor records", () => {
  const results = nefdb.list({ full: true });
  expect(results).toHaveLength(45);
  const first = results[0]!;
  expect(first).toHaveProperty("methodology_note");
  expect(first).toHaveProperty("nefdb_version");
});
