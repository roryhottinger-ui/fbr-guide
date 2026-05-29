// ─────────────────────────────────────────────────────────────
// Checklist context questions (Phase 1, Sections A–D).
// Source: fbr_document_checklist_rules.md + the v3 mockup question set.
// Raw answers are stored as strings; coerceAnswers() maps them to the
// typed ChecklistAnswers consumed by the engine.
// ─────────────────────────────────────────────────────────────

import type { ChecklistAnswers, Route } from '@/types';

export interface ChecklistOption {
  value: string;
  label: string;
  sub?: string;
}

export type RawChecklistAnswers = Record<string, string>;

export interface ChecklistQuestion {
  /** Storage key in the raw answers map. */
  key: string;
  title: string;
  subtitle?: string;
  help?: string;
  options: ChecklistOption[];
  /** Conditional visibility given current answers + route. */
  show?: (a: RawChecklistAnswers, route: Route | null) => boolean;
}

const MARRIAGE_OPTIONS: ChecklistOption[] = [
  { value: '0', label: 'Never married' },
  { value: '1', label: 'Once' },
  { value: '2', label: 'Twice', sub: '2 marriage certificates required' },
  { value: '3+', label: 'Three or more times', sub: 'All marriage certificates required' },
];

const NAME_CHANGE_OPTIONS: ChecklistOption[] = [
  { value: 'NO', label: 'No' },
  { value: 'YES_DEED', label: 'Yes — deed poll or statutory declaration' },
  {
    value: 'YES_ANGL',
    label: 'Yes — name was anglicised or informally changed',
    sub: 'e.g. Séamus → James, Ó Brien → O’Brien',
  },
];

const COUNTRY_OPTIONS: ChecklistOption[] = [
  { value: 'ROI', label: 'Republic of Ireland' },
  { value: 'NI', label: 'Northern Ireland' },
  { value: 'EW', label: 'England or Wales' },
  { value: 'SCO', label: 'Scotland' },
  { value: 'USA', label: 'USA' },
  { value: 'AUS', label: 'Australia' },
  { value: 'CAN', label: 'Canada' },
  { value: 'OTHER', label: 'Another country' },
];

const LANGUAGE_OPTIONS: ChecklistOption[] = [
  { value: 'NO', label: 'English or Irish' },
  { value: 'YES', label: 'Another language', sub: 'A certified translation will be required' },
];

const isRouteA = (_a: RawChecklistAnswers, route: Route | null) => route === 'ROUTE_A';
const isMinor = (a: RawChecklistAnswers) => a.applicant_type === 'MINOR';

export const checklistQuestions: ChecklistQuestion[] = [
  // ── Section A — about you ──
  {
    key: 'applicant_type',
    title: 'Are you applying for yourself, or on behalf of a child?',
    options: [
      { value: 'ADULT', label: "For myself (I'm 18 or over)" },
      { value: 'MINOR', label: 'On behalf of a child (under 18)' },
    ],
  },
  {
    key: 'guardian_type',
    title: 'What is your relationship to the child?',
    show: isMinor,
    options: [
      { value: 'PARENT', label: "I am the child's parent" },
      { value: 'NON_PARENT_GUARDIAN', label: "I am the child's legal guardian (not the parent)" },
    ],
  },

  // ── Section C — grandparent (ROUTE_A only) ──
  {
    key: 'gp_alive',
    title: 'Is your Irish-born grandparent still alive?',
    show: isRouteA,
    options: [
      { value: 'YES', label: "Yes, they're alive" },
      { value: 'NO', label: "No, they've passed away" },
    ],
  },
  {
    key: 'gp_id_valid',
    title: "Is your grandparent's photo ID currently valid?",
    subtitle:
      '⚠️ An expired passport, driving licence, or ID card is NOT accepted by the DFA — one of the most common reasons applications are returned.',
    show: (a, route) => isRouteA(a, route) && a.gp_alive === 'YES',
    options: [
      { value: 'YES', label: 'Yes — valid and unexpired' },
      { value: 'NO', label: 'No — expired or unavailable', sub: "We'll flag this as a blocker" },
    ],
  },
  {
    key: 'gp_marriages',
    title: 'How many times was your grandparent married?',
    subtitle:
      'You need a marriage certificate for every marriage — required even if their name didn’t change.',
    show: isRouteA,
    options: MARRIAGE_OPTIONS,
  },
  {
    key: 'gp_name_change',
    title: 'Did your grandparent change their name other than by marriage?',
    show: isRouteA,
    options: NAME_CHANGE_OPTIONS,
  },
  {
    key: 'gp_birth_country',
    title: 'Where was your grandparent born?',
    show: isRouteA,
    options: COUNTRY_OPTIONS,
  },
  {
    key: 'gp_pre_1864',
    title: 'Roughly when was your grandparent born?',
    subtitle: 'Civil birth registration in Ireland only began in 1864.',
    show: (a, route) => isRouteA(a, route) && (a.gp_birth_country === 'ROI' || a.gp_birth_country === 'NI'),
    options: [
      { value: 'NO', label: '1864 or later' },
      { value: 'YES', label: 'Before 1864', sub: 'A baptismal certificate is accepted' },
      { value: 'UNKNOWN', label: 'Not sure' },
    ],
  },
  {
    key: 'gp_cert_translation',
    title: "What language is your grandparent's birth certificate in?",
    show: (a, route) => isRouteA(a, route) && a.gp_birth_country === 'OTHER',
    options: LANGUAGE_OPTIONS,
  },

  // ── Section B — Irish citizen parent ──
  {
    key: 'parent_alive',
    title: 'Is your Irish citizen parent still alive?',
    options: [
      { value: 'YES', label: "Yes, they're alive" },
      { value: 'NO', label: "No, they've passed away" },
    ],
  },
  {
    key: 'parent_marriages',
    title: 'How many times was your parent married?',
    subtitle: 'Marriage certificates are required for every marriage — even if no name change occurred.',
    options: MARRIAGE_OPTIONS,
  },
  {
    key: 'parent_name_change',
    title: 'Did your parent change their name other than by marriage?',
    options: NAME_CHANGE_OPTIONS,
  },
  {
    key: 'parent_birth_country',
    title: 'Where was your parent born?',
    options: COUNTRY_OPTIONS,
  },
  {
    key: 'parent_cert_translation',
    title: "What language is your parent's birth certificate in?",
    show: (a) => a.parent_birth_country === 'OTHER',
    options: LANGUAGE_OPTIONS,
  },
  {
    key: 'parent_fbr_cert_available',
    title: 'Does your parent have their Foreign Birth Registration Certificate?',
    show: (_a, route) => route === 'ROUTE_B_FBR',
    options: [
      { value: 'YES', label: 'Yes' },
      { value: 'NO', label: "No — it's been lost or stolen" },
      { value: 'UNKNOWN', label: "I'm not sure" },
    ],
  },

  // ── Section A (cont.) — you ──
  {
    key: 'applicant_marriages',
    title: 'How many times have you been married?',
    options: MARRIAGE_OPTIONS,
  },
  {
    key: 'applicant_name_change',
    title: 'Have you changed your name other than by marriage?',
    subtitle:
      'Even a minor change — different spelling, anglicisation, deed poll — causes a discrepancy that needs explaining.',
    options: NAME_CHANGE_OPTIONS,
  },
  {
    key: 'applicant_birth_country',
    title: 'Where were you born?',
    options: COUNTRY_OPTIONS,
  },
  {
    key: 'applicant_cert_translation',
    title: 'What language is your birth certificate in?',
    show: (a) => a.applicant_birth_country === 'OTHER',
    options: LANGUAGE_OPTIONS,
  },

  // ── Section D — access to people & documents ──
  {
    key: 'estrangement',
    title: 'Are you in contact with everyone whose documents you need?',
    help:
      'Estrangement doesn’t make you ineligible. If you can’t obtain a living relative’s ID, you can include a signed affidavit explaining the situation — the DFA accepts this.',
    options: [
      { value: 'NONE', label: 'Yes — I can get everything I need' },
      { value: 'PARENT', label: 'No — I can’t contact my parent' },
      { value: 'GRANDPARENT', label: 'No — I can’t contact my grandparent' },
      { value: 'BOTH', label: 'No — I can’t contact either' },
    ],
  },
];

/** Visible questions for the current answers + route. */
export function visibleChecklistQuestions(
  a: RawChecklistAnswers,
  route: Route | null,
): ChecklistQuestion[] {
  return checklistQuestions.filter((q) => !q.show || q.show(a, route));
}

const BOOLEAN_KEYS = new Set([
  'gp_cert_translation',
  'parent_cert_translation',
  'applicant_cert_translation',
]);

/** Coerce raw string answers into the typed ChecklistAnswers the engine expects. */
export function coerceAnswers(raw: RawChecklistAnswers): ChecklistAnswers {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (value === undefined || value === '') continue;
    out[key] = BOOLEAN_KEYS.has(key) ? value === 'YES' : value;
  }
  // Default applicant_type to ADULT if somehow unset.
  if (!out.applicant_type) out.applicant_type = 'ADULT';
  return out as unknown as ChecklistAnswers;
}
