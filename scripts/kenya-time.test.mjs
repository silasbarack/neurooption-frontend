// Run: node scripts/kenya-time.test.mjs
// Checks Africa/Nairobi presentation of UTC instants, independent of the
// machine's own time zone (run it under TZ=America/New_York etc. too).
import assert from "node:assert/strict";
import {
  formatKenyaClock,
  formatKenyaDate,
  formatKenyaOffset,
  formatKenyaTime,
  kenyaDayKey,
  kenyaOffsetMs,
} from "../src/utils/kenyaTime.ts";

const utc = (...parts) => Date.UTC(...parts);

// 16:10:35 UTC is 19:10:35 in Kenya.
assert.equal(formatKenyaClock(utc(2026, 9, 8, 16, 10, 35)), "19:10:35");
assert.equal(formatKenyaOffset(utc(2026, 9, 8)), "UTC+3");
assert.equal(kenyaOffsetMs(utc(2026, 0, 15)), 3 * 3600_000);
assert.equal(kenyaOffsetMs(utc(2026, 6, 15)), 3 * 3600_000); // no DST

// Crossing midnight: 20:59:59 UTC is 23:59:59 on the 8th, 21:00 UTC is
// 00:00 on the 9th in Kenya.
assert.equal(formatKenyaClock(utc(2026, 9, 8, 20, 59, 59)), "23:59:59");
assert.equal(formatKenyaClock(utc(2026, 9, 8, 21, 0, 0)), "00:00:00");
assert.equal(formatKenyaDate(utc(2026, 9, 8, 21, 0, 0)), "09 Oct");
assert.notEqual(kenyaDayKey(utc(2026, 9, 8, 20, 59, 59)), kenyaDayKey(utc(2026, 9, 8, 21, 0, 0)));
// Year change.
assert.equal(formatKenyaDate(utc(2026, 11, 31, 21, 0, 0)), "01 Jan");

// Axis labels for genuine UTC buckets.
assert.equal(formatKenyaTime(utc(2026, 9, 8, 16, 15, 0)), "19:15");
assert.equal(formatKenyaTime(utc(2026, 9, 8, 16, 15, 45), true), "19:15:45");

// Bucket boundaries aligned in UTC are also aligned in Kenya for every
// timeframe up to 1 hour (the offset is a whole number of hours).
for (const ms of [5_000, 10_000, 15_000, 30_000, 60_000, 300_000, 900_000, 3_600_000]) {
  const bucket = Math.floor(utc(2026, 9, 8, 16, 13, 27) / ms) * ms;
  assert.equal((bucket + kenyaOffsetMs(bucket)) % ms, 0, `timeframe ${ms}`);
}

console.log("kenya-time: all checks passed");
