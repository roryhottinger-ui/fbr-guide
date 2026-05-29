// ─────────────────────────────────────────────────────────────
// Eligibility engine — PURE functions, no side effects.
// Encodes the routing logic from fbr_eligibility_checker_flow.md.
// Fully unit-tested in __tests__/eligibility.test.ts.
// ─────────────────────────────────────────────────────────────

import type {
  EligibilityAnswerKey,
  EligibilityAnswers,
  EligibilityOutcome,
  EligibilityResult,
  Route,
} from '@/types';

export type Traversal =
  | { type: 'question'; id: EligibilityAnswerKey }
  | { type: 'result'; result: EligibilityResult };

const q = (id: EligibilityAnswerKey): Traversal => ({ type: 'question', id });
const r = (outcome: EligibilityOutcome, route: Route | null): Traversal => ({
  type: 'result',
  result: { outcome, route },
});

/** Has this question been answered with a value that lets us route forward? */
function answered(value: string | undefined, ...accepted: string[]): boolean {
  return value !== undefined && accepted.includes(value);
}

/**
 * Walk the decision tree from the top using the current answers.
 * Returns either the next question to ask, or a terminal result.
 * Short-circuits: changing an earlier answer re-routes correctly because
 * traversal always restarts from Q1.
 */
export function traverse(a: EligibilityAnswers): Traversal {
  // Q1 — born on the island of Ireland?
  if (!answered(a.born_ireland, 'YES', 'NO')) return q('born_ireland');
  if (a.born_ireland === 'YES') return r('AUTO_CITIZEN_BIRTH', null);

  // Q2 — parent born on the island of Ireland? ("UNSURE" re-asks via help)
  if (!answered(a.parent_born_ireland, 'YES', 'NO')) return q('parent_born_ireland');
  if (a.parent_born_ireland === 'YES') return r('AUTO_CITIZEN_PARENT', null);

  // Q3 — grandparent born on the island of Ireland?
  if (!answered(a.grandparent_born_ireland, 'YES', 'NO')) return q('grandparent_born_ireland');
  if (a.grandparent_born_ireland === 'YES') return r('ELIGIBLE', 'ROUTE_A');

  // Q4 — is a parent an Irish citizen?
  if (!answered(a.parent_citizen, 'YES', 'NO', 'UNSURE')) return q('parent_citizen');
  if (a.parent_citizen === 'NO') return r('NOT_ELIGIBLE', null);

  if (a.parent_citizen === 'UNSURE') {
    // Q4b — parent's parent (great-grandparent) born in Ireland?
    if (!answered(a.parent_grandparent_born_ireland, 'YES', 'NO')) {
      return q('parent_grandparent_born_ireland');
    }
    if (a.parent_grandparent_born_ireland === 'NO') return r('NOT_ELIGIBLE', null);
    // YES → parent is an auto citizen → continue to Q5.
  }

  // Q5 — was the parent a citizen BEFORE you were born? ("UNSURE" re-asks)
  if (!answered(a.parent_citizen_before_birth, 'YES', 'NO')) {
    return q('parent_citizen_before_birth');
  }
  if (a.parent_citizen_before_birth === 'NO') return r('NOT_ELIGIBLE_TIMING', null);

  // Q6 — how did the parent become Irish?
  if (!a.parent_route) return q('parent_route');
  switch (a.parent_route) {
    case 'GRANDPARENT_BIRTH':
    case 'FBR':
      return r('ELIGIBLE', 'ROUTE_B_FBR');
    case 'NATURALISATION':
      return r('ELIGIBLE', 'ROUTE_B_NATURALISATION');
    case 'POSTNUPTIAL':
      return r('ELIGIBLE', 'ROUTE_B_POSTNUPTIAL');
    case 'ADOPTION':
      return r('ELIGIBLE', 'ROUTE_B_ADOPTION');
    case 'UNSURE': {
      // Q6b — which document does the parent hold?
      if (!a.parent_documents) return q('parent_documents');
      switch (a.parent_documents) {
        case 'PASSPORT':
        case 'FBR_CERT':
          return r('ELIGIBLE', 'ROUTE_B_FBR');
        case 'NATURALISATION_CERT':
          return r('ELIGIBLE', 'ROUTE_B_NATURALISATION');
        case 'POSTNUPTIAL_CERT':
          return r('ELIGIBLE', 'ROUTE_B_POSTNUPTIAL');
        case 'NONE':
          return r('NOT_ELIGIBLE_UNCLEAR', null);
        default:
          return q('parent_documents');
      }
    }
    default:
      return q('parent_route');
  }
}

/** The next unanswered question to present, or null if a terminal outcome is reached. */
export function nextEligibilityQuestion(a: EligibilityAnswers): EligibilityAnswerKey | null {
  const t = traverse(a);
  return t.type === 'question' ? t.id : null;
}

/** The terminal eligibility result, or null if more questions remain. */
export function evaluateEligibility(a: EligibilityAnswers): EligibilityResult | null {
  const t = traverse(a);
  return t.type === 'result' ? t.result : null;
}

/** True if this answer set has reached a terminal outcome. */
export function isComplete(a: EligibilityAnswers): boolean {
  return traverse(a).type === 'result';
}

/** Convenience: does this outcome mean the user should proceed to a checklist? */
export function isEligible(result: EligibilityResult | null): boolean {
  return result?.outcome === 'ELIGIBLE';
}
