import {
  evaluateEligibility,
  nextEligibilityQuestion,
  traverse,
  isComplete,
  isEligible,
} from '@/engine/eligibility';
import type { EligibilityAnswers } from '@/types';

describe('eligibility engine — terminal outcomes', () => {
  it('born in Ireland → AUTO_CITIZEN_BIRTH', () => {
    expect(evaluateEligibility({ born_ireland: 'YES' })).toEqual({
      outcome: 'AUTO_CITIZEN_BIRTH',
      route: null,
    });
  });

  it('parent born in Ireland → AUTO_CITIZEN_PARENT', () => {
    expect(
      evaluateEligibility({ born_ireland: 'NO', parent_born_ireland: 'YES' }),
    ).toEqual({ outcome: 'AUTO_CITIZEN_PARENT', route: null });
  });

  it('grandparent born in Ireland → ELIGIBLE / ROUTE_A', () => {
    expect(
      evaluateEligibility({
        born_ireland: 'NO',
        parent_born_ireland: 'NO',
        grandparent_born_ireland: 'YES',
      }),
    ).toEqual({ outcome: 'ELIGIBLE', route: 'ROUTE_A' });
  });

  it('no grandparent + parent not a citizen → NOT_ELIGIBLE', () => {
    expect(
      evaluateEligibility({
        born_ireland: 'NO',
        parent_born_ireland: 'NO',
        grandparent_born_ireland: 'NO',
        parent_citizen: 'NO',
      }),
    ).toEqual({ outcome: 'NOT_ELIGIBLE', route: null });
  });

  it('parent citizen but not before birth → NOT_ELIGIBLE_TIMING', () => {
    expect(
      evaluateEligibility({
        born_ireland: 'NO',
        parent_born_ireland: 'NO',
        grandparent_born_ireland: 'NO',
        parent_citizen: 'YES',
        parent_citizen_before_birth: 'NO',
      }),
    ).toEqual({ outcome: 'NOT_ELIGIBLE_TIMING', route: null });
  });
});

describe('eligibility engine — Route B variants (Q6)', () => {
  const base: EligibilityAnswers = {
    born_ireland: 'NO',
    parent_born_ireland: 'NO',
    grandparent_born_ireland: 'NO',
    parent_citizen: 'YES',
    parent_citizen_before_birth: 'YES',
  };

  it.each([
    ['GRANDPARENT_BIRTH', 'ROUTE_B_FBR'],
    ['FBR', 'ROUTE_B_FBR'],
    ['NATURALISATION', 'ROUTE_B_NATURALISATION'],
    ['POSTNUPTIAL', 'ROUTE_B_POSTNUPTIAL'],
    ['ADOPTION', 'ROUTE_B_ADOPTION'],
  ])('parent_route=%s → %s', (route, expected) => {
    expect(evaluateEligibility({ ...base, parent_route: route })).toEqual({
      outcome: 'ELIGIBLE',
      route: expected,
    });
  });
});

describe('eligibility engine — Q4b (unsure parent citizen)', () => {
  const base: EligibilityAnswers = {
    born_ireland: 'NO',
    parent_born_ireland: 'NO',
    grandparent_born_ireland: 'NO',
    parent_citizen: 'UNSURE',
  };

  it('asks Q4b when parent_citizen is UNSURE', () => {
    expect(nextEligibilityQuestion(base)).toBe('parent_grandparent_born_ireland');
  });

  it('great-grandparent NO → NOT_ELIGIBLE', () => {
    expect(
      evaluateEligibility({ ...base, parent_grandparent_born_ireland: 'NO' }),
    ).toEqual({ outcome: 'NOT_ELIGIBLE', route: null });
  });

  it('great-grandparent YES → continues to Q5 then Q6', () => {
    expect(
      nextEligibilityQuestion({ ...base, parent_grandparent_born_ireland: 'YES' }),
    ).toBe('parent_citizen_before_birth');
    expect(
      nextEligibilityQuestion({
        ...base,
        parent_grandparent_born_ireland: 'YES',
        parent_citizen_before_birth: 'YES',
      }),
    ).toBe('parent_route');
  });
});

describe('eligibility engine — Q6b (unsure route)', () => {
  const base: EligibilityAnswers = {
    born_ireland: 'NO',
    parent_born_ireland: 'NO',
    grandparent_born_ireland: 'NO',
    parent_citizen: 'YES',
    parent_citizen_before_birth: 'YES',
    parent_route: 'UNSURE',
  };

  it('asks Q6b when route is UNSURE', () => {
    expect(nextEligibilityQuestion(base)).toBe('parent_documents');
  });

  it.each([
    ['PASSPORT', 'ELIGIBLE', 'ROUTE_B_FBR'],
    ['FBR_CERT', 'ELIGIBLE', 'ROUTE_B_FBR'],
    ['NATURALISATION_CERT', 'ELIGIBLE', 'ROUTE_B_NATURALISATION'],
    ['POSTNUPTIAL_CERT', 'ELIGIBLE', 'ROUTE_B_POSTNUPTIAL'],
  ])('parent_documents=%s → %s/%s', (doc, outcome, route) => {
    expect(evaluateEligibility({ ...base, parent_documents: doc })).toEqual({
      outcome,
      route,
    });
  });

  it('parent_documents=NONE → NOT_ELIGIBLE_UNCLEAR', () => {
    expect(
      evaluateEligibility({ ...base, parent_documents: 'NONE' }),
    ).toEqual({ outcome: 'NOT_ELIGIBLE_UNCLEAR', route: null });
  });
});

describe('eligibility engine — navigation & flow', () => {
  it('starts at born_ireland with no answers', () => {
    expect(nextEligibilityQuestion({})).toBe('born_ireland');
    expect(isComplete({})).toBe(false);
  });

  it('walks the full grandparent path question by question', () => {
    const a: EligibilityAnswers = {};
    expect(nextEligibilityQuestion(a)).toBe('born_ireland');
    a.born_ireland = 'NO';
    expect(nextEligibilityQuestion(a)).toBe('parent_born_ireland');
    a.parent_born_ireland = 'NO';
    expect(nextEligibilityQuestion(a)).toBe('grandparent_born_ireland');
    a.grandparent_born_ireland = 'YES';
    expect(nextEligibilityQuestion(a)).toBeNull();
    expect(isComplete(a)).toBe(true);
  });

  it('UNSURE on Q2/Q3 keeps the user on the same question (inline help)', () => {
    expect(nextEligibilityQuestion({ born_ireland: 'NO', parent_born_ireland: 'UNSURE' })).toBe(
      'parent_born_ireland',
    );
    expect(
      nextEligibilityQuestion({
        born_ireland: 'NO',
        parent_born_ireland: 'NO',
        grandparent_born_ireland: 'UNSURE',
      }),
    ).toBe('grandparent_born_ireland');
  });

  it('re-routes correctly when an earlier answer changes (short-circuit)', () => {
    // A fully-answered Route B path...
    const a: EligibilityAnswers = {
      born_ireland: 'NO',
      parent_born_ireland: 'NO',
      grandparent_born_ireland: 'NO',
      parent_citizen: 'YES',
      parent_citizen_before_birth: 'YES',
      parent_route: 'NATURALISATION',
    };
    expect(evaluateEligibility(a)?.route).toBe('ROUTE_B_NATURALISATION');
    // ...user goes back and says a grandparent WAS born in Ireland.
    a.grandparent_born_ireland = 'YES';
    expect(evaluateEligibility(a)).toEqual({ outcome: 'ELIGIBLE', route: 'ROUTE_A' });
  });

  it('traverse returns a question object before completion', () => {
    const t = traverse({});
    expect(t).toEqual({ type: 'question', id: 'born_ireland' });
  });

  it('isEligible helper reflects ELIGIBLE outcome only', () => {
    expect(isEligible({ outcome: 'ELIGIBLE', route: 'ROUTE_A' })).toBe(true);
    expect(isEligible({ outcome: 'AUTO_CITIZEN_BIRTH', route: null })).toBe(false);
    expect(isEligible(null)).toBe(false);
  });
});
