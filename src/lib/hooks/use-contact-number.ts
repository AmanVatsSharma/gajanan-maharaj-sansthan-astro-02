/**
 * File: src/lib/hooks/use-contact-number.ts
 * Module: lib/hooks
 * Purpose: React hook returning the per-visitor contact number for the
 * primary/secondary split.
 *
 * Backed by the shared singleton store in src/lib/contact-number.ts and
 * consumed via React's `useSyncExternalStore`. Guarantees:
 *   - SSR/build + first client render return the PRIMARY (matches prerendered
 *     HTML, no hydration mismatch / no content flash warnings).
 *   - Exactly ONE dice roll per visitor, shared by every component on every
 *     page, so all Call/WhatsApp CTAs show the same number for a given user.
 *   - When the split config (primary/secondary/weight) changes, returning
 *     visitors re-roll instead of being locked into a stale stored number.
 */

import { useSyncExternalStore } from "react";
import { contactNumberStore, toTelHref, toWhatsAppHref } from "@/lib/contact-number";

export interface ContactNumber {
  /** The phone number string to display (e.g. "+917070604312"). */
  number: string;
  /** `tel:` href for the current number. */
  telHref: string;
  /** `https://wa.me/...` href for the current number. */
  whatsappHref: string;
}

export function useContactNumber(): ContactNumber {
  // Single shared decision across the whole site; getServerSnapshot = PRIMARY.
  const number = useSyncExternalStore(
    contactNumberStore.subscribe,
    contactNumberStore.getSnapshot,
    contactNumberStore.getServerSnapshot
  );

  return {
    number,
    telHref: toTelHref(number),
    whatsappHref: toWhatsAppHref(number),
  };
}
