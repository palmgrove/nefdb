import { expect, test } from "bun:test";
import csv from "../src/data/csv.ts";
import json from "../src/data/json.ts";

test("csv default export is a string with expected headers", () => {
  expect(typeof csv).toBe("string");
  expect(csv.length).toBeGreaterThan(0);
  expect(csv).toContain("id");
  expect(csv).toContain("category");
});

test("json default export is an array of 45 factors", () => {
  expect(Array.isArray(json)).toBe(true);
  expect(json.length).toBe(45);
  expect(json[0]).toHaveProperty("id");
});
