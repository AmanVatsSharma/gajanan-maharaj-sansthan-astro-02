/**
 * File: src/lib/hooks/use-contact-number.ts
 * Module: lib/hooks
 * Purpose: React hook returning the per-visitor contact number for the
 * primary/secondary split.
 *
 * Returns the PRIMARY number during SSR and the first client render (so the
 * server-rendered HTML matches and there is no hydration mismatch), then
 * resolves the real per-visitor number (primary or secondary) in a layout
 * effect and re-renders. This guarantees a stable first paint and a flash-free
 * swap to the chosen number.
 */

import { useEffect, useState } from "react";
import { PRIMARY_NUMBER, resolveContactNumber, toTelHref, toWhatsAppHref } from "@/lib/contact-number";

export interface ContactNumber {
  /** The phone number string to display (e.g. "+918969871378"). */
  number: string;
  /** `tel:` href for the current number. */
  telHref: string;
  /** `https://wa.me/...` href for the current number. */
  whatsappHref: string;
}

export function useContactNumber(): ContactNumber {
  // Start at the primary so SSR and first client render match the prerendered HTML.
  const [number, setNumber] = useState<string>(PRIMARY_NUMBER);

  useEffect(() => {
    setNumber(resolveContactNumber());
  }, []);

  return {
    number,
    telHref: toTelHref(number),
    whatsappHref: toWhatsAppHref(number),
  };
}
