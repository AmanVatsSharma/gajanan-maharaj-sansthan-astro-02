/**
 * File: src/lib/contact-number.ts
 * Module: lib
 * Purpose: Per-visitor primary/secondary contact-number split.
 *
 * The site is prerendered (static HTML), but the number split must be
 * per-visitor. So the decision is made ONCE per visitor, client-side, persisted
 * to localStorage (versioned so changing the numbers/ratio re-rolls), and
 * exposed to all components through a single shared store consumed via
 * `useContactNumber()` (which uses React's `useSyncExternalStore`).
 *
 * Config lives in CONTACT_DETAILS.booking (single source of truth):
 *   - mobile          = primary number
 *   - secondary       = secondary number
 *   - secondaryWeight = P(secondary) in [0,1]  (0.5 => 50% secondary)
 *
 * Why a shared singleton store (not a per-component hook that rolls its own):
 *   1. Exactly ONE dice roll per visitor, shared by every Call/WhatsApp CTA so
 *      the whole page shows the SAME number (consistency matters — you do not
 *      want Navbar showing primary and Footer showing secondary to one user).
 *   2. Versioned persistence: when primary/secondary/weight change in config,
 *      returning visitors re-roll instead of being locked into a stale number.
 */

import { CONTACT_DETAILS } from "@/data/contact";

const STORAGE_KEY = "gms_contact_number";
const VERSION_KEY = "gms_contact_number_v";

/** The primary number (also the SSR fallback shown before hydration). */
export const PRIMARY_NUMBER = CONTACT_DETAILS.booking.mobile;

/** Signature of the current split config; if it changes, stored choices invalidate. */
function splitSignature(): string {
  const b = CONTACT_DETAILS.booking;
  return [b.mobile, b.secondary, b.secondaryWeight].join("|");
}

// ---- Singleton decision store -------------------------------------------------

/** The visitor's chosen number, once decided on the client. `null` = not yet decided. */
let chosenNumber: string | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

/**
 * Decide (and persist) the visitor's number exactly once. Subsequent calls
 * return the cached value. Client-only — must never run during SSR/build.
 */
function decideNumber(): string {
  if (chosenNumber !== null) return chosenNumber;

  const signature = splitSignature();
  let stored: string | null = null;
  let storedVersion: string | null = null;
  try {
    stored = window.localStorage.getItem(STORAGE_KEY);
    storedVersion = window.localStorage.getItem(VERSION_KEY);
  } catch {
    // localStorage unavailable (private mode / disabled) — fall through to roll.
  }

  // Reuse a stored choice ONLY if it was made under the CURRENT split config.
  // Otherwise the config changed (e.g. a number was rotated) -> re-roll.
  if (stored && storedVersion === signature) {
    chosenNumber = stored;
    return chosenNumber;
  }

  // First visit under this config (or stale): roll once.
  const useSecondary = Math.random() < CONTACT_DETAILS.booking.secondaryWeight;
  chosenNumber = useSecondary ? CONTACT_DETAILS.booking.secondary : PRIMARY_NUMBER;

  try {
    window.localStorage.setItem(STORAGE_KEY, chosenNumber);
    window.localStorage.setItem(VERSION_KEY, signature);
  } catch {
    // Ignore write failures; the in-memory value is still returned below.
  }

  return chosenNumber;
}

/** Client snapshot for useSyncExternalStore. Decides once, then stable. */
function getSnapshot(): string {
  return decideNumber();
}

/** Server snapshot: always the primary so prerendered HTML stays stable. */
function getServerSnapshot(): string {
  return PRIMARY_NUMBER;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export const contactNumberStore = {
  subscribe,
  getSnapshot,
  getServerSnapshot,
};

// ---- Link helpers -------------------------------------------------------------

/** Convert a `+91...` number into a `tel:` href. */
export function toTelHref(number: string = PRIMARY_NUMBER): string {
  return `tel:${number.replace(/[^0-9+]/g, "")}`;
}

/** Convert a `+91...` number into a `https://wa.me/...` link. */
export function toWhatsAppHref(number: string = PRIMARY_NUMBER): string {
  return `https://wa.me/${number.replace(/[^0-9]/g, "")}`;
}
