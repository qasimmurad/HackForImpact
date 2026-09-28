import type { RequestHandler } from "express";

/**
 * Injected latency for the local data sources.
 *
 * `pages` is served straight out of local SQLite, so it would otherwise return
 * in microseconds and the menu would never have to cope with a slow source.
 * The delay below makes it behave like a real remote service, which is what
 * gives debouncing, request cancellation, and out-of-order responses something
 * to actually solve.
 *
 * People are not in here on purpose: they come from the hosted directory, which
 * has real latency of its own. Add a profile here if you want to simulate a
 * source you control.
 *
 * Turn `errorRate` up (0–1) to make a service fail intermittently and exercise
 * your error handling.
 */
export type ChaosProfile = {
  minDelayMs: number;
  maxDelayMs: number;
  errorRate: number;
};

export const chaosConfig: Record<"pages", ChaosProfile> = {
  pages: { minDelayMs: 120, maxDelayMs: 400, errorRate: 0 },
};

/** Express middleware that injects the configured latency and error rate. */
export function chaos(service: keyof typeof chaosConfig): RequestHandler {
  return (_req, res, next) => {
    const profile = chaosConfig[service];
    if (profile.errorRate > 0 && Math.random() < profile.errorRate) {
      res.status(503).json({ error: `Injected failure in ${service} service` });
      return;
    }
    const delay = profile.minDelayMs + Math.random() * (profile.maxDelayMs - profile.minDelayMs);
    setTimeout(next, delay);
  };
}
