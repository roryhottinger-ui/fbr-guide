/**
 * FBR fees. Single source of truth — do not hardcode fee amounts elsewhere.
 * Source: irish_fbr_context_document.md §7, §15. Verified May 2026.
 * These values are OTA-updatable via expo-updates.
 */

export const fees = {
  currency: 'EUR',
  symbol: '€',
  adult: 278,
  minor: 153,
  /** Human-readable, used in UI copy. */
  adultLabel: '€278',
  minorLabel: '€153',
  note: 'Paid online during the application. Non-refundable if the application is rejected or withdrawn. Includes registration, certificate, and postage.',
  lastVerified: 'May 2026',
} as const;

export type Fees = typeof fees;
export default fees;
