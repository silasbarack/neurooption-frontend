/**
 * Presentation helpers for East Africa Time. Every timestamp in the app is a
 * UTC instant (epoch milliseconds); these only change how it is shown.
 */

export const KENYA_TIME_ZONE = "Africa/Nairobi";
export const KENYA_ZONE_LABEL = "EAT";
// Kenya has kept UTC+3 without daylight saving since 1960; used only if the
// browser has no time-zone data.
const FALLBACK_OFFSET_MS = 3 * 60 * 60 * 1000;

type Parts = { year: number; month: number; day: number; hour: number; minute: number; second: number };

let partsFormatter: Intl.DateTimeFormat | null | undefined;

function getFormatter() {
  if (partsFormatter === undefined) {
    try {
      partsFormatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: KENYA_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      });
    } catch {
      partsFormatter = null;
    }
  }
  return partsFormatter;
}

// The chart asks for the same few instants every frame.
const partsCache = new Map<number, Parts>();

/** Wall-clock fields of a UTC instant in Kenya. */
export function kenyaParts(ms: number): Parts {
  const second = Math.floor(ms / 1000) * 1000;
  const cached = partsCache.get(second);
  if (cached) return cached;

  let parts: Parts;
  const formatter = getFormatter();
  if (formatter) {
    const values: Record<string, number> = {};
    for (const part of formatter.formatToParts(new Date(second))) {
      if (part.type !== "literal") values[part.type] = Number(part.value);
    }
    parts = {
      year: values.year,
      month: values.month,
      day: values.day,
      hour: values.hour % 24,
      minute: values.minute,
      second: values.second,
    };
  } else {
    const shifted = new Date(second + FALLBACK_OFFSET_MS);
    parts = {
      year: shifted.getUTCFullYear(),
      month: shifted.getUTCMonth() + 1,
      day: shifted.getUTCDate(),
      hour: shifted.getUTCHours(),
      minute: shifted.getUTCMinutes(),
      second: shifted.getUTCSeconds(),
    };
  }

  if (partsCache.size > 2000) partsCache.clear();
  partsCache.set(second, parts);
  return parts;
}

/** Kenya's offset from UTC at an instant, in milliseconds. */
export function kenyaOffsetMs(ms: number) {
  const p = kenyaParts(ms);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUtc - Math.floor(ms / 1000) * 1000;
}

const pad = (value: number) => String(value).padStart(2, "0");
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "19:10:35" */
export function formatKenyaClock(ms: number) {
  const p = kenyaParts(ms);
  return `${pad(p.hour)}:${pad(p.minute)}:${pad(p.second)}`;
}

/** "19:10" or, with seconds, "19:10:35". */
export function formatKenyaTime(ms: number, withSeconds = false) {
  const p = kenyaParts(ms);
  return withSeconds ? `${pad(p.hour)}:${pad(p.minute)}:${pad(p.second)}` : `${pad(p.hour)}:${pad(p.minute)}`;
}

/** "09 Oct" */
export function formatKenyaDate(ms: number) {
  const p = kenyaParts(ms);
  return `${pad(p.day)} ${MONTHS[p.month - 1]}`;
}

/** "09 Oct 2026, 19:10:35 EAT" */
export function formatKenyaDateTime(ms: number) {
  const p = kenyaParts(ms);
  return `${formatKenyaDate(ms)} ${p.year}, ${formatKenyaClock(ms)} ${KENYA_ZONE_LABEL}`;
}

/** Calendar day in Kenya, as a comparable number (yyyymmdd). */
export function kenyaDayKey(ms: number) {
  const p = kenyaParts(ms);
  return p.year * 10000 + p.month * 100 + p.day;
}

/** "UTC+3" */
export function formatKenyaOffset(ms: number) {
  const minutes = Math.round(kenyaOffsetMs(ms) / 60000);
  const sign = minutes >= 0 ? "+" : "-";
  const hours = Math.floor(Math.abs(minutes) / 60);
  const rest = Math.abs(minutes) % 60;
  return `UTC${sign}${hours}${rest ? ":" + pad(rest) : ""}`;
}
