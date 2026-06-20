import { expect, test } from "bun:test";
import { nefdb } from "../src/index.ts";

test("nefdb.grid.national() defaults to combined margin", () => {
  const factor = nefdb.grid.national();
  expect(factor).toBeDefined();
  expect(factor!.value).toBeCloseTo(0.573, 3);
  expect(factor!.unit).toBe("kgCO2e_per_kWh");
});

test("nefdb.grid.national('om') returns operating margin", () => {
  const factor = nefdb.grid.national("om");
  expect(factor).toBeDefined();
  expect(factor!.value).toBeCloseTo(0.578, 3);
  expect(factor!.unit).toBe("kgCO2e_per_kWh");
});

test("nefdb.grid.disco('AEDC') returns AEDC factor", () => {
  const factor = nefdb.grid.disco("AEDC");
  expect(factor).toBeDefined();
  expect(factor!.id).toBe("ng.grid.disco.aedc.2024");
});

test("nefdb.fuel.diesel() returns litre and kWh variants", () => {
  const diesel = nefdb.fuel.diesel();
  expect(diesel).toBeDefined();
  expect(diesel!.per_litre).toBeDefined();
  expect(diesel!.per_litre!.value).toBeCloseTo(2.662, 3);
  expect(diesel!.per_kwh).toBeDefined();
  expect(diesel!.per_kwh!.rated).toBeDefined();
  expect(diesel!.per_kwh!.field).toBeDefined();
  expect(diesel!.per_kwh!.field!.value).toBeCloseTo(0.958, 3);
});

test("nefdb.fuel.lpg() returns LPG stationary factor", () => {
  const factor = nefdb.fuel.lpg();
  expect(factor).toBeDefined();
  expect(factor!.value).toBeCloseTo(1.557, 3);
  expect(factor!.unit).toBe("kgCO2e_per_litre");
});

test("nefdb.transport.road('diesel') returns fuel-based factor", () => {
  const factor = nefdb.transport.road("diesel");
  expect(factor).toBeDefined();
  expect(factor!.value).toBeCloseTo(2.662, 3);
  expect(factor!.unit).toBe("kgCO2e_per_litre");
});

test("nefdb.transport.road('diesel', 'car') returns distance-based factor", () => {
  const factor = nefdb.transport.road("diesel", "car");
  expect(factor).toBeDefined();
  expect(factor!.unit).toBe("kgCO2e_per_km");
});

test("nefdb.aviation.route('LOS', 'ABV') returns forward route", () => {
  const factor = nefdb.aviation.route("LOS", "ABV");
  expect(factor).toBeDefined();
  expect(factor!.value).toBeCloseTo(0.1962, 4);
});

test("nefdb.aviation.route('ABV', 'LOS') returns reverse route", () => {
  const factor = nefdb.aviation.route("ABV", "LOS");
  expect(factor).toBeDefined();
  expect(factor!.value).toBeCloseTo(0.1962, 4);
});

test("nefdb.aviation.route('LOS', 'ABV', { rf: true }) applies RF multiplier", () => {
  const factor = nefdb.aviation.route("LOS", "ABV", { rf: true });
  expect(factor).toBeDefined();
  expect(factor!.value).toBeCloseTo(0.1962 * 1.9, 4);
});

test("nefdb.waste.msw helpers return expected values", () => {
  expect(nefdb.waste.msw("landfill_managed")!.value).toBeCloseTo(1260, 0);
  expect(nefdb.waste.msw("open_dump")!.value).toBeCloseTo(561, 0);
  expect(nefdb.waste.msw("open_burning")!.value).toBeCloseTo(268, 0);
});

test("nefdb.waste.composting() returns composting factor", () => {
  expect(nefdb.waste.composting()!.value).toBeCloseTo(176, 0);
});

test("nefdb.waste.wastewater() returns domestic and industrial variants", () => {
  expect(nefdb.waste.wastewater("domestic")!.value).toBeCloseTo(0.758, 3);
  expect(nefdb.waste.wastewater("industrial")!.value).toBeCloseTo(2.1, 2);
});

test("nefdb.water helpers return expected values", () => {
  expect(nefdb.water.supply()!.value).toBeCloseTo(0.103, 3);
  expect(nefdb.water.wastewater()!.value).toBeCloseTo(0.124, 3);
});

test("invalid API inputs return undefined", () => {
  expect(nefdb.grid.national("foo" as "om")).toBeUndefined();
  expect(nefdb.grid.disco("FOO" as "AEDC")).toBeUndefined();
  expect(nefdb.transport.road("electric" as "diesel")).toBeUndefined();
  expect(nefdb.aviation.route("LOS", "JFK")).toBeUndefined();
  expect(nefdb.waste.msw("recycling" as "landfill_managed")).toBeUndefined();
  expect(nefdb.waste.wastewater("pharma" as "domestic")).toBeUndefined();
});
