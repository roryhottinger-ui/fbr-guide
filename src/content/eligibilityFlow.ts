// ─────────────────────────────────────────────────────────────
// Eligibility checker content (questions, options, help, outcomes).
// Source: fbr_eligibility_checker_flow.md. OTA-updatable.
// Routing logic lives in src/engine/eligibility.ts (pure function).
// ─────────────────────────────────────────────────────────────

import type { EligibilityAnswerKey, EligibilityOutcome, Route } from '@/types';

export interface EligibilityOption {
  value: string;
  label: string;
  sub?: string;
}

export interface EligibilityQuestion {
  id: EligibilityAnswerKey;
  title: string;
  subtitle?: string;
  help?: string;
  options: EligibilityOption[];
}

export const eligibilityQuestions: Record<EligibilityAnswerKey, EligibilityQuestion> = {
  born_ireland: {
    id: 'born_ireland',
    title: 'Were you born on the island of Ireland?',
    subtitle: 'This includes both the Republic of Ireland and Northern Ireland.',
    help: 'The island of Ireland includes the Republic of Ireland and all 32 counties — including the six counties of Northern Ireland (Antrim, Armagh, Down, Fermanagh, Derry/Londonderry, Tyrone). Being born anywhere on the island counts.',
    options: [
      { value: 'YES', label: 'Yes' },
      { value: 'NO', label: 'No' },
    ],
  },
  parent_born_ireland: {
    id: 'parent_born_ireland',
    title: 'Was either of your parents born on the island of Ireland?',
    help: 'If either parent was born anywhere in Ireland — Republic or Northern Ireland — you are automatically an Irish citizen from birth, regardless of where you were born. You don’t need FBR; you can apply directly for an Irish passport. If you’re unsure where your parents were born, check birth certificates or ask family members.',
    options: [
      { value: 'YES', label: 'Yes' },
      { value: 'NO', label: 'No' },
      { value: 'UNSURE', label: "I'm not sure" },
    ],
  },
  grandparent_born_ireland: {
    id: 'grandparent_born_ireland',
    title: 'Was either of your grandparents born on the island of Ireland?',
    subtitle: "This means your mother's or father's parents.",
    help: 'You have four grandparents. If any one of them was born on the island of Ireland (Republic or Northern Ireland), you qualify for this route — known as the grandparent route. If you’re unsure, try checking family records, old documents, or genealogy sites like irishgenealogy.ie or FamilySearch.',
    options: [
      { value: 'YES', label: 'Yes' },
      { value: 'NO', label: 'No' },
      { value: 'UNSURE', label: "I'm not sure" },
    ],
  },
  parent_citizen: {
    id: 'parent_citizen',
    title: 'Is either of your parents an Irish citizen?',
    subtitle: "Even if they've never had an Irish passport, they may still be a citizen.",
    help: 'Irish citizenship doesn’t require a passport. Your parent may be an Irish citizen without ever having claimed it. This is most common when a grandparent was born in Ireland — your parent became a citizen automatically at birth even if they’ve never done anything about it.',
    options: [
      { value: 'YES', label: 'Yes' },
      { value: 'NO', label: 'No' },
      { value: 'UNSURE', label: "I'm not sure" },
    ],
  },
  parent_grandparent_born_ireland: {
    id: 'parent_grandparent_born_ireland',
    title: "Was one of your parent's parents born on the island of Ireland?",
    subtitle: 'In other words — do you have an Irish-born great-grandparent?',
    help: 'If your parent’s parent was born in Ireland, your parent is automatically an Irish citizen — even if they don’t have an Irish passport and have never applied for one. That means you may be eligible. We’ll continue to check.',
    options: [
      { value: 'YES', label: 'Yes' },
      { value: 'NO', label: 'No' },
    ],
  },
  parent_citizen_before_birth: {
    id: 'parent_citizen_before_birth',
    title: 'Was your parent an Irish citizen at the time you were born?',
    subtitle: 'The timing matters — they need to have been a citizen before your birth, not after.',
    help: 'There are two ways your parent could have been a citizen before your birth:\n\n1. Automatically — if their own parent (your grandparent) was born in Ireland, they were a citizen from their own birth.\n2. By registration — if they registered on the Foreign Births Register (FBR) before you were born.\n\nIf your parent only registered on the FBR after you were born, you are unfortunately not eligible through them.',
    options: [
      { value: 'YES', label: 'Yes' },
      { value: 'NO', label: 'No' },
      { value: 'UNSURE', label: "I'm not sure" },
    ],
  },
  parent_route: {
    id: 'parent_route',
    title: 'How did your parent become an Irish citizen?',
    subtitle: "This affects which documents you'll need.",
    help: '• Grandparent born in Ireland / FBR: their citizenship comes from their own Irish-born parent.\n• Naturalised: they applied to become Irish after living in Ireland — they have a Naturalisation Certificate.\n• Post-Nuptial Declaration: an older route where a foreign national married an Irish citizen and declared citizenship.\n• Adopted: born abroad and adopted by an Irish citizen.',
    options: [
      { value: 'GRANDPARENT_BIRTH', label: 'Their parent (your grandparent) was born in Ireland', sub: 'They were a citizen by birth' },
      { value: 'FBR', label: 'They registered on the Foreign Births Register (FBR)' },
      { value: 'NATURALISATION', label: 'They were naturalised as an Irish citizen' },
      { value: 'POSTNUPTIAL', label: 'They made a Post-Nuptial Citizenship Declaration' },
      { value: 'ADOPTION', label: 'They were adopted by an Irish citizen' },
      { value: 'UNSURE', label: "I'm not sure" },
    ],
  },
  parent_documents: {
    id: 'parent_documents',
    title: 'Does your parent have any of these documents?',
    subtitle: 'Pick the first that applies.',
    options: [
      { value: 'PASSPORT', label: 'An Irish passport or passport card' },
      { value: 'FBR_CERT', label: 'A Foreign Birth Registration Certificate' },
      { value: 'NATURALISATION_CERT', label: 'An Irish Naturalisation Certificate' },
      { value: 'POSTNUPTIAL_CERT', label: 'A Post-Nuptial Citizenship Certificate' },
      { value: 'NONE', label: "None of these / I don't know" },
    ],
  },
};

/** The order questions can appear in (for progress estimation only). */
export const eligibilityOrder: EligibilityAnswerKey[] = [
  'born_ireland',
  'parent_born_ireland',
  'grandparent_born_ireland',
  'parent_citizen',
  'parent_grandparent_born_ireland',
  'parent_citizen_before_birth',
  'parent_route',
  'parent_documents',
];

// ── Outcome copy ──────────────────────────────────────────────

export interface OutcomeContent {
  emoji: string;
  headline: string;
  body: string;
  note?: string;
  /** Primary CTA label + intent. */
  cta?: { label: string; kind: 'passport' | 'checklist' };
  contact?: boolean;
  alternatives?: string;
}

export const outcomeContent: Record<EligibilityOutcome | Route, OutcomeContent> = {
  AUTO_CITIZEN_BIRTH: {
    emoji: '🎉',
    headline: "You're already an Irish citizen!",
    body: 'You were born on the island of Ireland, which means you are already an Irish citizen by birth. You don’t need to go through the Foreign Births Register. You can apply directly for an Irish passport.',
    cta: { label: 'How to apply for an Irish passport →', kind: 'passport' },
  },
  AUTO_CITIZEN_PARENT: {
    emoji: '🎉',
    headline: "You're already an Irish citizen!",
    body: 'Because one of your parents was born on the island of Ireland, you are automatically an Irish citizen — regardless of where you were born. You don’t need to go through the Foreign Births Register. You can apply directly for an Irish passport.',
    cta: { label: 'How to apply for an Irish passport →', kind: 'passport' },
  },
  // Generic ELIGIBLE (route-specific copy is keyed by Route below).
  ELIGIBLE: {
    emoji: '✅',
    headline: "You're likely eligible for Foreign Birth Registration",
    body: 'Based on your answers, you appear to qualify. Once registered, you’ll be an Irish citizen and can apply for an Irish passport. We’ll build your personalised document checklist based on your specific circumstances.',
    note: 'This is guidance, not a decision. Only the DFA can confirm your eligibility — verify your situation at ireland.ie before applying.',
    cta: { label: 'Build my document checklist →', kind: 'checklist' },
  },
  ROUTE_A: {
    emoji: '✅',
    headline: "You're likely eligible for Foreign Birth Registration",
    body: 'Because one of your grandparents was born on the island of Ireland, you can usually apply to be entered on the Foreign Births Register. Once registered, you’ll be an Irish citizen and can apply for an Irish passport.\n\nThis is the grandparent route (the most common route).',
    note: 'This is guidance, not a decision. Only the DFA can confirm your eligibility — verify your situation at ireland.ie before applying.',
    cta: { label: 'Build my document checklist →', kind: 'checklist' },
  },
  ROUTE_B_FBR: {
    emoji: '✅',
    headline: "You're likely eligible for Foreign Birth Registration",
    body: 'Because one of your parents is an Irish citizen — through their own Irish-born parent or their own FBR registration — you can usually apply to be entered on the Foreign Births Register.',
    note: 'Your parent must have been an Irish citizen before you were born for this to work. If your grandparent was born in Ireland, your parent was a citizen from their own birth — so this timing condition is automatically met. This is guidance only — confirm your eligibility with the DFA before applying.',
    cta: { label: 'Build my document checklist →', kind: 'checklist' },
  },
  ROUTE_B_NATURALISATION: {
    emoji: '✅',
    headline: "You're likely eligible for Foreign Birth Registration",
    body: 'Because one of your parents became an Irish citizen through naturalisation before you were born, you can usually apply to be entered on the Foreign Births Register.',
    note: "You'll need your parent's original Irish Naturalisation Certificate as part of your application. This is guidance only — confirm your eligibility with the DFA before applying.",
    cta: { label: 'Build my document checklist →', kind: 'checklist' },
  },
  ROUTE_B_POSTNUPTIAL: {
    emoji: '✅',
    headline: "You're likely eligible for Foreign Birth Registration",
    body: 'Because one of your parents became an Irish citizen through a Post-Nuptial Citizenship Declaration before you were born, you can usually apply to be entered on the Foreign Births Register.',
    note: "You'll need your parent's original Post-Nuptial Citizenship Certificate as part of your application. This is guidance only — confirm your eligibility with the DFA before applying.",
    cta: { label: 'Build my document checklist →', kind: 'checklist' },
  },
  ROUTE_B_ADOPTION: {
    emoji: '⚠️',
    headline: 'You may be eligible — but this route needs careful checking',
    body: 'Your situation involves adoption, which adds some complexity. You may still be eligible, but the rules depend on whether the adoption is recognised under Irish law. We recommend contacting the DFA directly before proceeding.',
    contact: true,
    cta: { label: 'Build my checklist anyway →', kind: 'checklist' },
  },
  NOT_ELIGIBLE: {
    emoji: '❌',
    headline: "Unfortunately you're not eligible through this route",
    body: "Based on what you've told us, you don't qualify for Irish citizenship through the Foreign Births Register. FBR requires either a grandparent born on the island of Ireland, or a parent who was an Irish citizen at the time of your birth. Neither of these applies in your case.",
    alternatives:
      'Other routes to Irish citizenship exist:\n• Naturalisation — if you have lived legally in Ireland for 5 years\n• Association with Ireland — for those with strong Irish connections\n\nA DNA test showing Irish ancestry does not create eligibility.',
  },
  NOT_ELIGIBLE_TIMING: {
    emoji: '❌',
    headline: "Unfortunately you're not eligible through this route",
    body: 'For you to claim citizenship through a parent, that parent needed to be an Irish citizen before you were born. If your parent only became an Irish citizen after you were born — for example, by registering on the FBR after your birth — this unfortunately doesn’t pass citizenship to you.',
    alternatives:
      'However: if your parent registers on the FBR now, any children they have in the future would be eligible. Other routes: Naturalisation may be an option if you have lived in Ireland for 5 years.',
  },
  NOT_ELIGIBLE_UNCLEAR: {
    emoji: '⚠️',
    headline: "We can't confirm your eligibility",
    body: "Based on your answers, we can't confirm whether you're eligible. This usually means more information is needed about how your parent became (or didn't become) an Irish citizen. We recommend contacting the DFA directly — they can tell you definitively whether you qualify.",
    contact: true,
  },
};

export const dfaContact = {
  phone: '+353 1 568 3331',
  hours: 'Mon–Fri 9am–4:30pm',
  webchat:
    'https://www.ireland.ie/en/dfa/citizenship/born-abroad/registering-a-foreign-birth/#Contact%20Foreign%20Birth%20Registration',
};

export const passportUrl = 'https://www.ireland.ie/en/dfa/passports/passport-online/';
