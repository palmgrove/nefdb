import { expect, test } from "bun:test";
import { nefdb } from "../src/index.ts";

test("nefdb.list() returns an array", () => {
  const result = nefdb.list();
  expect(Array.isArray(result)).toBe(true);
});
