/**
 * Usage limits. There is no login, so the whole site is capped by volume with atomic counters in DynamoDB
 * (same idea as the previous project): per visitor (hashed), per minute and per day for the whole site.
 */
import { createHash } from 'node:crypto';

export const CAPS = {
  perVisitorPerHour: 3,
  perMinute: 10,
  perDay: 300,
} as const;

/** The minimal slice of the DynamoDB document client the limiter needs (so tests can fake it). */
export interface CounterStore {
  /** Atomically adds 1 to the counter `key` only if it is still below `max`. Returns false when the cap is already reached. */
  increment(key: string, max: number, expiresAtEpochSec: number): Promise<boolean>;
}

export type LimitResult = { ok: true } | { ok: false; scope: 'visitor' | 'minute' | 'day'; retryAfterSec: number };

const pad = (n: number): string => String(n).padStart(2, '0');

/** One-way fingerprint of the visitor. The IP is never stored, only this hash, and only for an hour. */
export function visitorHash(ip: string, salt: string): string {
  return createHash('sha256').update(`${salt}|${ip}`).digest('hex').slice(0, 24);
}

export async function checkLimits(store: CounterStore, visitor: string, now: Date): Promise<LimitResult> {
  const y = now.getUTCFullYear(), mo = pad(now.getUTCMonth() + 1), d = pad(now.getUTCDate()), h = pad(now.getUTCHours()), mi = pad(now.getUTCMinutes());
  const sec = Math.floor(now.getTime() / 1000);
  const toNextHour = 3600 - (sec % 3600), toNextMinute = 60 - (sec % 60), toNextDay = 86400 - (sec % 86400);

  if (!(await store.increment(`RL#V#${visitor}#${y}${mo}${d}${h}`, CAPS.perVisitorPerHour, sec + 2 * 3600)))
    return { ok: false, scope: 'visitor', retryAfterSec: toNextHour };
  if (!(await store.increment(`RL#M#${y}${mo}${d}${h}${mi}`, CAPS.perMinute, sec + 300)))
    return { ok: false, scope: 'minute', retryAfterSec: toNextMinute };
  if (!(await store.increment(`RL#D#${y}${mo}${d}`, CAPS.perDay, sec + 2 * 86400)))
    return { ok: false, scope: 'day', retryAfterSec: toNextDay };
  return { ok: true };
}
