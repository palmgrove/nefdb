import * as aviation from "./api/aviation.ts";
import * as fuel from "./api/fuel.ts";
import * as transport from "./api/transport.ts";
import { list } from "./query.ts";

export { list } from "./query.ts";
export type * from "./types.ts";
export { aviation, fuel, transport };

export const nefdb = { list, aviation, fuel, transport };
