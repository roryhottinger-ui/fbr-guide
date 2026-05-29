import {
  buildChecklist,
  checklistProgress,
  hasBlocker,
  summaryCounts,
} from '@/engine/checklist';
import type { ChecklistAnswers } from '@/types';

const adult = (extra: Partial<ChecklistAnswers> = {}): ChecklistAnswers => ({
  applicant_type: 'ADULT',
  ...extra,
});

const docs = (r: ReturnType<typeof buildChecklist>) => r.items.map((i) => i.doc);
const inSection = (r: ReturnType<typeof buildChecklist>, s: string) =>
  r.items.filter((i) => i.section === s);

describe('checklist engine — core rules', () => {
  it('always includes a birth cert for every person in the chain (Route A)', () => {
    const r = buildChecklist('ROUTE_A', adult({ gp_alive: 'YES', parent_alive: 'YES' }));
    expect(inSection(r, 'grandparent').some((i) => /birth certificate/i.test(i.doc))).toBe(true);
    expect(inSection(r, 'parent').some((i) => /birth certificate/i.test(i.doc))).toBe(true);
    expect(inSection(r, 'you').some((i) => /birth certificate/i.test(i.doc))).toBe(true);
  });

  it('Route B has no grandparent section', () => {
    const r = buildChecklist('ROUTE_B_FBR', adult({ parent_alive: 'YES' }));
    expect(inSection(r, 'grandparent')).toHaveLength(0);
  });

  it('2 marriages → 2 separate marriage cert items', () => {
    const r = buildChecklist('ROUTE_A', adult({ gp_marriages: '2', gp_alive: 'YES' }));
    const gpMarriages = inSection(r, 'grandparent').filter((i) => /marriage certificate/i.test(i.doc));
    expect(gpMarriages).toHaveLength(2);
  });

  it('3+ marriages → 3 marriage cert items, last covers "and any further"', () => {
    const r = buildChecklist('ROUTE_A', adult({ parent_marriages: '3+', parent_alive: 'YES' }));
    const m = inSection(r, 'parent').filter((i) => /marriage certificate/i.test(i.doc));
    expect(m).toHaveLength(3);
    expect(m[2].doc).toMatch(/further/i);
  });

  it('every marriage cert carries the "no name change" warning', () => {
    const r = buildChecklist('ROUTE_A', adult({ parent_marriages: '1', parent_alive: 'YES' }));
    const mc = r.items.find((i) => /marriage certificate/i.test(i.doc));
    expect(mc?.warning).toBeTruthy();
  });

  it('expired ID (living grandparent) → a hard blocker item', () => {
    const r = buildChecklist('ROUTE_A', adult({ gp_alive: 'YES', gp_id_valid: 'NO' }));
    expect(hasBlocker(r.items)).toBe(true);
    const block = r.items.find((i) => i.type === 'block');
    expect(block?.section).toBe('grandparent');
  });

  it('valid ID (living grandparent) → photo ID item, no blocker', () => {
    const r = buildChecklist('ROUTE_A', adult({ gp_alive: 'YES', gp_id_valid: 'YES' }));
    expect(hasBlocker(r.items)).toBe(false);
    expect(inSection(r, 'grandparent').some((i) => /photo id/i.test(i.doc))).toBe(true);
  });

  it('deceased relative → death certificate replaces photo ID', () => {
    const r = buildChecklist('ROUTE_A', adult({ gp_alive: 'NO', parent_alive: 'NO' }));
    expect(inSection(r, 'grandparent').some((i) => /death certificate/i.test(i.doc))).toBe(true);
    expect(inSection(r, 'grandparent').some((i) => /photo id/i.test(i.doc))).toBe(false);
    expect(inSection(r, 'parent').some((i) => /death certificate/i.test(i.doc))).toBe(true);
    expect(inSection(r, 'parent').some((i) => /photo id/i.test(i.doc))).toBe(false);
  });

  it('deed-poll name change → deed poll item', () => {
    const r = buildChecklist('ROUTE_A', adult({ applicant_name_change: 'YES_DEED', gp_alive: 'YES' }));
    expect(inSection(r, 'you').some((i) => /deed poll/i.test(i.doc))).toBe(true);
  });

  it('anglicised name → statutory declaration item', () => {
    const r = buildChecklist('ROUTE_A', adult({ parent_name_change: 'YES_ANGL', parent_alive: 'YES' }));
    const decl = inSection(r, 'parent').find((i) => /statutory declaration/i.test(i.doc));
    expect(decl).toBeTruthy();
  });

  it('pre-1864 grandparent → baptismal certificate instead of birth cert', () => {
    const r = buildChecklist('ROUTE_A', adult({ gp_pre_1864: 'YES', gp_alive: 'NO' }));
    expect(inSection(r, 'grandparent').some((i) => /baptismal/i.test(i.doc))).toBe(true);
    expect(inSection(r, 'grandparent').some((i) => /civil birth certificate/i.test(i.doc))).toBe(false);
  });

  it('non-English certificate → certified translation item', () => {
    const r = buildChecklist('ROUTE_A', adult({ applicant_cert_translation: true, gp_alive: 'YES' }));
    expect(inSection(r, 'you').some((i) => /certified translation/i.test(i.doc))).toBe(true);
  });
});

describe('checklist engine — route-specific parent documents', () => {
  it('ROUTE_B_FBR → FBR certificate item', () => {
    const r = buildChecklist('ROUTE_B_FBR', adult({ parent_alive: 'YES' }));
    expect(docs(r).some((d) => /foreign birth registration certificate/i.test(d))).toBe(true);
  });
  it('ROUTE_B_NATURALISATION → naturalisation certificate item', () => {
    const r = buildChecklist('ROUTE_B_NATURALISATION', adult({ parent_alive: 'YES' }));
    expect(docs(r).some((d) => /naturalisation certificate/i.test(d))).toBe(true);
  });
  it('ROUTE_B_POSTNUPTIAL → post-nuptial certificate item', () => {
    const r = buildChecklist('ROUTE_B_POSTNUPTIAL', adult({ parent_alive: 'YES' }));
    expect(docs(r).some((d) => /post-nuptial citizenship certificate/i.test(d))).toBe(true);
  });
  it('ROUTE_B_ADOPTION → adoption cert + proof of citizenship', () => {
    const r = buildChecklist('ROUTE_B_ADOPTION', adult({ parent_alive: 'YES' }));
    expect(docs(r).some((d) => /adoption certificate/i.test(d))).toBe(true);
    expect(docs(r).some((d) => /proof of irish citizenship/i.test(d))).toBe(true);
  });
});

describe('checklist engine — minor applicant', () => {
  const minor = buildChecklist(
    'ROUTE_A',
    { applicant_type: 'MINOR', guardian_type: 'PARENT', gp_alive: 'YES' } as ChecklistAnswers,
  );

  it('adds school/GP letter + child photos + guardian photos & address', () => {
    expect(docs(minor).some((d) => /school, gp/i.test(d))).toBe(true);
    expect(docs(minor).some((d) => /photos of the child/i.test(d))).toBe(true);
    expect(docs(minor).some((d) => /photos of the parent\/guardian/i.test(d))).toBe(true);
    expect(docs(minor).some((d) => /proofs of address \(parent\/guardian\)/i.test(d))).toBe(true);
  });

  it('non-parent guardian → proof of guardianship', () => {
    const g = buildChecklist(
      'ROUTE_A',
      { applicant_type: 'MINOR', guardian_type: 'NON_PARENT_GUARDIAN', gp_alive: 'YES' } as ChecklistAnswers,
    );
    expect(docs(g).some((d) => /guardianship/i.test(d))).toBe(true);
  });

  it('parent guardian → no proof of guardianship', () => {
    expect(docs(minor).some((d) => /proof of guardianship/i.test(d))).toBe(false);
  });
});

describe('checklist engine — alerts (Group 7)', () => {
  it('always includes the "original means fresh copy" info alert', () => {
    const r = buildChecklist('ROUTE_A', adult({ gp_alive: 'YES' }));
    expect(r.alerts.some((al) => al.id === 'original')).toBe(true);
  });
  it('parent married → marriage warning alert', () => {
    const r = buildChecklist('ROUTE_A', adult({ parent_marriages: '1', parent_alive: 'YES' }));
    expect(r.alerts.some((al) => al.id === 'parent_marriage')).toBe(true);
  });
  it('US applicant → US shipping/ordering alert', () => {
    const r = buildChecklist('ROUTE_A', adult({ applicant_birth_country: 'USA', gp_alive: 'YES' }));
    expect(r.alerts.some((al) => al.id === 'us')).toBe(true);
  });
  it('lost FBR cert → replacement alert', () => {
    const r = buildChecklist('ROUTE_B_FBR', adult({ parent_alive: 'YES', parent_fbr_cert_available: 'NO' }));
    expect(r.alerts.some((al) => al.id === 'fbr_lost')).toBe(true);
  });
  it('estrangement → affidavit info alert + affidavit item', () => {
    const r = buildChecklist('ROUTE_A', adult({ estrangement: 'PARENT', gp_alive: 'YES' }));
    expect(r.alerts.some((al) => al.id === 'estrangement')).toBe(true);
    expect(docs(r).some((d) => /affidavit/i.test(d))).toBe(true);
  });
  it('minor → no "passport in envelope" alert (adults only)', () => {
    const r = buildChecklist('ROUTE_A', { applicant_type: 'MINOR', gp_alive: 'YES' } as ChecklistAnswers);
    expect(r.alerts.some((al) => al.id === 'no_passport')).toBe(false);
  });
});

describe('checklist engine — progress', () => {
  it('blocker items are excluded from progress totals', () => {
    const r = buildChecklist('ROUTE_A', adult({ gp_alive: 'YES', gp_id_valid: 'NO' }));
    const p = checklistProgress(r.items, {});
    expect(p.hasBlocker).toBe(true);
    expect(p.total).toBe(r.items.filter((i) => i.type !== 'block').length);
    expect(p.done).toBe(0);
    expect(p.pct).toBe(0);
  });

  it('checking all normal items reaches 100%', () => {
    const r = buildChecklist('ROUTE_A', adult({ gp_alive: 'NO', parent_alive: 'YES' }));
    const checked = Object.fromEntries(r.items.map((i) => [i.id, true]));
    const p = checklistProgress(r.items, checked);
    expect(p.pct).toBe(100);
    expect(p.done).toBe(p.total);
  });
});

// ── The three mockup presets (SPEC §4.2 acceptance) ───────────

describe('checklist engine — mockup presets', () => {
  it('"Your scenario": gp 2 marriages + expired ID, parent 1 marriage', () => {
    const r = buildChecklist(
      'ROUTE_A',
      adult({
        gp_alive: 'YES',
        gp_id_valid: 'NO',
        gp_marriages: '2',
        gp_name_change: 'NO',
        parent_alive: 'YES',
        parent_marriages: '1',
        parent_name_change: 'NO',
        applicant_marriages: '0',
        applicant_name_change: 'NO',
      }),
    );
    // Grandparent: birth cert + 2 marriage certs + expired-ID blocker
    const gp = inSection(r, 'grandparent');
    expect(gp.filter((i) => /marriage certificate/i.test(i.doc))).toHaveLength(2);
    expect(gp.some((i) => i.type === 'block')).toBe(true);
    // Parent: birth cert + 1 marriage cert + photo ID (alive)
    const parent = inSection(r, 'parent');
    expect(parent.filter((i) => /marriage certificate/i.test(i.doc))).toHaveLength(1);
    expect(parent.some((i) => /photo id/i.test(i.doc))).toBe(true);
    // You: birth cert, id, address, photos, form — no marriage cert
    const you = inSection(r, 'you');
    expect(you.some((i) => /marriage certificate/i.test(i.doc))).toBe(false);
    expect(you.some((i) => /application form/i.test(i.doc))).toBe(true);
    expect(hasBlocker(r.items)).toBe(true);
  });

  it('"Simple case": deceased gp with 1 marriage, living parent, no name changes', () => {
    const r = buildChecklist(
      'ROUTE_A',
      adult({
        gp_alive: 'NO',
        gp_marriages: '1',
        gp_name_change: 'NO',
        parent_alive: 'YES',
        parent_marriages: '0',
        parent_name_change: 'NO',
        applicant_marriages: '0',
        applicant_name_change: 'NO',
      }),
    );
    const gp = inSection(r, 'grandparent');
    expect(gp.some((i) => /death certificate/i.test(i.doc))).toBe(true);
    expect(gp.filter((i) => /marriage certificate/i.test(i.doc))).toHaveLength(1);
    expect(hasBlocker(r.items)).toBe(false);
  });

  it('"Complex case": every edge at once stays internally consistent', () => {
    const r = buildChecklist(
      'ROUTE_A',
      adult({
        gp_alive: 'YES',
        gp_id_valid: 'NO',
        gp_marriages: '3+',
        gp_name_change: 'YES_ANGL',
        parent_alive: 'NO',
        parent_marriages: '2',
        parent_name_change: 'YES_DEED',
        applicant_marriages: '1',
        applicant_name_change: 'YES_ANGL',
      }),
    );
    const gp = inSection(r, 'grandparent');
    expect(gp.filter((i) => /marriage certificate/i.test(i.doc))).toHaveLength(3);
    expect(gp.some((i) => /statutory declaration/i.test(i.doc))).toBe(true); // anglicised
    expect(gp.some((i) => i.type === 'block')).toBe(true); // expired ID
    const parent = inSection(r, 'parent');
    expect(parent.filter((i) => /marriage certificate/i.test(i.doc))).toHaveLength(2);
    expect(parent.some((i) => /death certificate/i.test(i.doc))).toBe(true); // deceased
    expect(parent.some((i) => /deed poll/i.test(i.doc))).toBe(true);
    const you = inSection(r, 'you');
    expect(you.filter((i) => /marriage certificate/i.test(i.doc))).toHaveLength(1);
    expect(you.some((i) => /statutory declaration/i.test(i.doc))).toBe(true);
    // summary counts are coherent
    const s = summaryCounts(r);
    expect(s.total).toBe(r.items.length);
    expect(s.grandparent).toBe(gp.length);
  });
});
