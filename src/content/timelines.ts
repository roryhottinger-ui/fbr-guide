/**
 * FBR processing-time estimates. Single source of truth — OTA-updatable.
 * Source: irish_fbr_context_document.md §12, §21.1, §21.2.
 */

export const timelines = {
  /** DFA's officially advertised figure. */
  officialMonths: 12,
  /** Community-reported real-world range (2025–2026). */
  typicalRangeMonths: [9, 11] as const,
  typicalRangeLabel: '9–11 months',
  /** Community statistical average. */
  averageDays: 307,
  averageLabel: '~10 months',
  /** Certificate print + post after approval. */
  certPrintWeeks: [2, 8] as const,
  /** When it becomes reasonable to check status via webchat. */
  statusCheckAfterMonths: 9,
  note: 'Applications are processed in strict date order. There is no way to expedite unless you are an expectant parent or stateless. The DFA does not acknowledge receipt — send by recorded post.',
  lastVerified: 'May 2026',
} as const;

export type Timelines = typeof timelines;
export default timelines;
