import * as aviation from "./api/aviation.ts";
import * as fuel from "./api/fuel.ts";
import * as transport from "./api/transport.ts";
import * as waste from "./api/waste.ts";
import * as water from "./api/water.ts";
import { list } from "./query.ts";

export { list } from "./query.ts";
export type * from "./types.ts";
export { aviation, fuel, transport, waste, water };

export const nefdb = { list, aviation, fuel, transport, waste, water };
