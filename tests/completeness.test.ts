import { expect, test } from "bun:test";
import { nefdb } from "../src/index.ts";

const EXPECTED_IDS = [
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
  // waste (6)
  "ng.waste.msw.landfill.managed",
  "ng.waste.msw.open_dump",
  "ng.waste.msw.open_burning",
  "ng.waste.organic.composting",
  "ng.waste.wastewater.domestic",
  "ng.waste.wastewater.industrial",
  // water (2)
  "ng.water.treatment.supply",
  "ng.water.treatment.wastewater",
];

test("nefdb contains exactly 45 factors", () => {
  expect(nefdb.list()).toHaveLength(45);
});

test("all 45 expected factor IDs are present", () => {
  const ids = new Set(nefdb.list().map((f) => f.id));
  for (const id of EXPECTED_IDS) {
    expect(ids.has(id)).toBe(true);
  }
});

test("factor IDs are unique", () => {
  const ids = nefdb.list().map((f) => f.id);
  expect(new Set(ids).size).toBe(ids.length);
});
