import * as fuel from "./api/fuel.ts";
import * as transport from "./api/transport.ts";
import { list } from "./query.ts";

export { list } from "./query.ts";
export type * from "./types.ts";
export { fuel, transport };

export const nefdb = { list, fuel, transport };
