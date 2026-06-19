import { expect, test } from "bun:test";
import { nefdb } from "../src/index.ts";

test("nefdb.list() returns an array", () => {
  const result = nefdb.list();
  expect(Array.isArray(result)).toBe(true);
});

test("nefdb.list() contains all 37 expected factor IDs", () => {
  const ids = new Set(nefdb.list().map((f) => f.id));
  const expected = [
    // grid electricity (15)
    "ng.grid.national.om.2021",
    "ng.grid.national.bm.2021",
    "ng.grid.national.cm.2021",
    "ng.grid.national.location.2024",
    "ng.grid.disco.aedc.2024",
    "ng.grid.disco.bedc.2024",
    "ng.grid.disco.eedc.2024",
    "ng.grid.disco.ekedc.2024",
    "ng.grid.disco.ibedc.2024",
    "ng.grid.disco.iedc.2024",
    "ng.grid.disco.jedc.2024",
    "ng.grid.disco.kdedc.2024",
    "ng.grid.disco.kedc.2024",
    "ng.grid.disco.pedc.2024",
    "ng.grid.disco.yedc.2024",
    // fuel combustion (8)
    "ng.fuel.diesel.stationary",
    "ng.fuel.diesel.stationary.kwh.rated",
    "ng.fuel.diesel.stationary.kwh.field",
    "ng.fuel.petrol.stationary",
    "ng.fuel.lpg.stationary",
    "ng.fuel.cng.stationary",
    "ng.fuel.naturalgas.stationary",
    "ng.fuel.hfo.stationary",
    // transport (8)
    "ng.transport.road.petrol.per_litre",
    "ng.transport.road.diesel.per_litre",
    "ng.transport.road.petrol.car",
    "ng.transport.road.diesel.car",
    "ng.transport.road.petrol.motorcycle",
    "ng.transport.road.diesel.bus",
    "ng.transport.road.diesel.truck.small",
    "ng.transport.road.diesel.truck.heavy",
    // aviation (6)
    "ng.aviation.domestic.los_abv",
    "ng.aviation.domestic.los_phc",
    "ng.aviation.domestic.los_kan",
    "ng.aviation.domestic.abv_phc",
    "ng.aviation.domestic.generic",
    "ng.aviation.domestic.rf_multiplier",
  ];
  for (const id of expected) {
    expect(ids.has(id)).toBe(true);
  }
  expect(ids.size).toBe(37);
});

test("nefdb.fuel.diesel() returns the correct shape and values", () => {
  const diesel = nefdb.fuel.diesel();
  expect(diesel).toBeDefined();
  expect(diesel!.per_litre.value).toBeCloseTo(2.662);
  expect(diesel!.per_litre.unit).toBe("kgCO2e_per_litre");
  expect(diesel!.per_kwh.field).toBeDefined();
  expect(diesel!.per_kwh.field!.value).toBeCloseTo(0.958);
  expect(diesel!.per_kwh.field!.unit).toBe("kgCO2e_per_kWh");
  expect(diesel!.per_kwh.rated).toBeDefined();
  expect(diesel!.per_kwh.rated!.unit).toBe("kgCO2e_per_kWh");
});

test("nefdb.fuel.lpg() returns a factor with kgCO2e_per_litre unit", () => {
  const lpg = nefdb.fuel.lpg();
  expect(lpg).toBeDefined();
  expect(lpg!.unit).toBe("kgCO2e_per_litre");
});

test("nefdb.transport.road('diesel') returns fuel-based factor", () => {
  const factor = nefdb.transport.road("diesel");
  expect(factor).toBeDefined();
  expect(factor!.unit).toBe("kgCO2e_per_litre");
});

test("nefdb.transport.road('diesel', 'car') returns distance-based factor", () => {
  const factor = nefdb.transport.road("diesel", "car");
  expect(factor).toBeDefined();
  expect(factor!.unit).toBe("kgCO2e_per_km");
});

test("nefdb.transport.road('petrol', 'motorcycle') returns expected value", () => {
  const factor = nefdb.transport.road("petrol", "motorcycle");
  expect(factor).toBeDefined();
  expect(factor!.value).toBeCloseTo(0.114);
  expect(factor!.unit).toBe("kgCO2e_per_km");
});

test("nefdb.aviation.route() returns undefined for unknown routes", () => {
  expect(nefdb.aviation.route("LOS", "JFK")).toBeUndefined();
});

test("nefdb.aviation.route('LOS', 'ABV') returns correct unit and value", () => {
  const factor = nefdb.aviation.route("LOS", "ABV");
  expect(factor).toBeDefined();
  expect(factor!.value).toBeCloseTo(0.1962);
  expect(factor!.unit).toBe("kgCO2e_per_passenger_km");
});

test("nefdb.aviation.route('ABV', 'LOS') works via reverse lookup", () => {
  const factor = nefdb.aviation.route("ABV", "LOS");
  expect(factor).toBeDefined();
  expect(factor!.value).toBeCloseTo(0.1962);
  expect(factor!.unit).toBe("kgCO2e_per_passenger_km");
});

test("nefdb.aviation.route('LOS', 'ABV', { rf: true }) applies radiative forcing multiplier", () => {
  const factor = nefdb.aviation.route("LOS", "ABV", { rf: true });
  expect(factor).toBeDefined();
  expect(factor!.value).toBeCloseTo(0.1962 * 1.9);
  expect(factor!.unit).toBe("kgCO2e_per_passenger_km");
});
