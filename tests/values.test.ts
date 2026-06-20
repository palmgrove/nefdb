import { expect, test } from "bun:test";
import { nefdb } from "../src/index.ts";

function factor(id: string) {
  const f = nefdb.get(id);
  if (!f) throw new Error(`Missing factor ${id}`);
  return f;
}

test("WAPP combined margin is 0.573", () => {
  expect(factor("ng.grid.national.cm.2021").value).toBeCloseTo(0.573, 3);
});

test("WAPP operating margin is 0.578", () => {
  expect(factor("ng.grid.national.om.2021").value).toBeCloseTo(0.578, 3);
});

test("WAPP build margin is 0.556", () => {
  expect(factor("ng.grid.national.bm.2021").value).toBeCloseTo(0.556, 3);
});

test("national grid location-based factor is 0.138611", () => {
  expect(factor("ng.grid.national.location.2024").value).toBe(0.138611);
});

test("diesel stationary combustion is 2.662 kgCO2e/litre", () => {
  expect(factor("ng.fuel.diesel.stationary").value).toBeCloseTo(2.662, 3);
});

test("diesel kWh field efficiency is 0.958 kgCO2e/kWh", () => {
  expect(factor("ng.fuel.diesel.stationary.kwh.field").value).toBeCloseTo(
    0.958,
    3
  );
});

test("petrol stationary combustion is 2.354 kgCO2e/litre", () => {
  expect(factor("ng.fuel.petrol.stationary").value).toBeCloseTo(2.354, 3);
});

test("LPG stationary combustion is 1.557 kgCO2e/litre", () => {
  expect(factor("ng.fuel.lpg.stationary").value).toBeCloseTo(1.557, 3);
});

test("aviation LOS-ABV is 0.1962 kgCO2e/passenger-km", () => {
  expect(factor("ng.aviation.domestic.los_abv").value).toBeCloseTo(0.1962, 4);
});

test("generic domestic aviation is 0.194 kgCO2e/passenger-km", () => {
  expect(factor("ng.aviation.domestic.generic").value).toBeCloseTo(0.194, 4);
});

test("radiative forcing multiplier is 1.9", () => {
  expect(factor("ng.aviation.domestic.rf_multiplier").value).toBe(1.9);
});

test("managed landfill waste factor is 1260 kgCO2e/tonne", () => {
  expect(factor("ng.waste.msw.landfill.managed").value).toBeCloseTo(1260, 0);
});

test("open dump waste factor is 561 kgCO2e/tonne", () => {
  expect(factor("ng.waste.msw.open_dump").value).toBeCloseTo(561, 0);
});

test("domestic wastewater factor is 0.758 kgCO2e/m3", () => {
  expect(factor("ng.waste.wastewater.domestic").value).toBeCloseTo(0.758, 3);
});

test("water supply treatment factor is 0.103 kgCO2e/m3", () => {
  expect(factor("ng.water.treatment.supply").value).toBeCloseTo(0.103, 3);
});
