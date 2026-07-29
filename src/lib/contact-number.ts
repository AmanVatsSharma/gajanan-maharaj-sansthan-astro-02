/**
 * File: src/lib/contact-number.ts
 * Module: lib
 * Purpose: Per-visitor primary/secondary contact-number split.
 *
 * The site is prerendered (static HTML), but the number split must be
 * per-visitor. So the pick is made client-side on first visit, persisted in
 * localStorage so a returning visitor keeps the same number, and the chosen
 * number is resolved synchronously on every subsequent load.
 *
 * Config lives in CONTACT_DETAILS.booking (single source of truth):
 *   - mobile          = primary number
 *   - secondary       = secondary number
 *   - secondaryWeight = P(secondary) in [0,1]  (0.65 => 65% secondary)
 *
 * Consumers should read the number via the `useContactNumber()` React hook so
 * the server-rendered HTML stays stable (primary) and the swap happens only
 * after hydration — avoiding React hydration mismatches and content flash.
 */

import { CONTACT_DETAILS } from "@/data/contact";

const STORAGE_KEY = "gms_contact_number";

/** The primary number (also the SSR fallback shown before hydration). */
export const PRIMARY_NUMBER = CONTACT_DETAILS.booking.mobile;

/**
 * Resolve the number for the CURRENT visitor, client-side only.
 * Returns the primary on first paint / SSR, and the persisted (or freshly
 * rolled) number once a localStorage value exists.
 */
export function resolveContactNumber(): string {
  // SSR / build-time guard: always primary so prerendered HTML is stable.
  if (typeof window === "undefined") return PRIMARY_NUMBER;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
  } catch {
    // localStorage may be unavailable (private mode / disabled) — fall through.
  }

  // First visit: roll once based on the configured secondary probability.
  const useSecondary = Math.random() < CONTACT_DETAILS.booking.secondaryWeight;
  const chosen = useSecondary ? CONTACT_DETAILS.booking.secondary : PRIMARY_NUMBER;

  try {
    window.localStorage.setItem(STORAGE_KEY, chosen);
  } catch {
    // Ignore write failures; the in-memory value is still returned below.
  }

  return chosen;
}

/** Convert a `+91...` number into a `tel:` href. */
export function toTelHref(number: string = PRIMARY_NUMBER): string {
  return `tel:${number.replace(/[^0-9+]/g, "")}`;
}

/** Convert a `+91...` number into a `https://wa.me/...` link. */
export function toWhatsAppHref(number: string = PRIMARY_NUMBER): string {
  return `https://wa.me/${number.replace(/[^0-9]/g, "")}`;
}
