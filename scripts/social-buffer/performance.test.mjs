import assert from "node:assert/strict";
import test from "node:test";

import { buildStrategy, dueAtFor } from "./performance.mjs";

function post(category, dueAt, score) {
  return { category, dueAt, score, excerpt: "example", metrics: {} };
}

test("実績ゼロでは朝7:30・午後15:30を使う", () => {
  const strategy = buildStrategy([]);
  assert.equal(strategy.times.morning, "07:30");
  assert.equal(strategy.times.afternoon, "15:30");
});

test("未検証の時間帯を順番に探索する", () => {
  const strategy = buildStrategy([
    post("AIニュース", "2026-09-10T22:30:00.000Z", 20),
  ]);
  assert.equal(strategy.times.morning, "08:30");
});

test("全時間帯の検証後は成績の良い時間を優先する", () => {
  const strategy = buildStrategy([
    post("AIニュース", "2026-09-10T22:30:00.000Z", 10),
    post("AIニュース", "2026-09-11T23:30:00.000Z", 20),
    post("AIニュース", "2026-09-13T00:30:00.000Z", 80),
    post("AIニュース", "2026-09-14T01:30:00.000Z", 30),
  ]);
  assert.equal(strategy.times.morning, "09:30");
});

test("日本時間をBuffer用UTCへ変換する", () => {
  assert.equal(
    dueAtFor("2026-09-11", "afternoon", { times: { afternoon: "17:00" } }),
    "2026-09-11T08:00:00.000Z",
  );
});
