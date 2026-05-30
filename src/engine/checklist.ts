// ─────────────────────────────────────────────────────────────
// Checklist engine — PURE function, no side effects.
// Implements fbr_document_checklist_rules.md Phase 2 (Groups 1–7)
// plus the multi-marriage / per-person name-change logic from the
// mockup's buildChecklist. Fully unit-tested.
// ─────────────────────────────────────────────────────────────

import { docTemplates, alertText, type DocTemplate } from '@/content/documentRules';
import { getHowToLink, type LinkKind } from '@/content/links';
import type {
  ChecklistAlert,
  ChecklistAnswers,
  ChecklistItem,
  ChecklistSection,
  CountryCode,
  MarriageCount,
  NameChange,
  Route,
} from '@/types';

export interface ChecklistResult {
  items: ChecklistItem[];
  alerts: ChecklistAlert[];
}

const PERSON_LABEL: Record<ChecklistSection, string> = {
  grandparent: 'Your grandparent (Irish-born)',
  parent: 'Your parent',
  you: 'You',
};

/** How many marriage certificates a marriage-count answer implies. */
function marriageCount(m: MarriageCount | undefined): number {
  switch (m) {
    case '1':
      return 1;
    case '2':
      return 2;
    case '3+':
      return 3; // "3 or more" → at least 3 separate cert line items
    default:
      return 0;
  }
}

export function buildChecklist(
  route: Route | null,
  answers: ChecklistAnswers,
): ChecklistResult {
  const a = answers;
  const items: ChecklistItem[] = [];
  const isRouteA = route === 'ROUTE_A';
  const isMinor = a.applicant_type === 'MINOR';

  // Item factory: resolves the country-specific "how to get it" note.
  const add = (
    idPrefix: string,
    section: ChecklistSection,
    template: DocTemplate,
    opts: {
      docOverride?: string;
      warning?: string;
      type?: 'normal' | 'block';
      country?: CountryCode;
      linkKindOverride?: LinkKind;
      whyOverride?: string;
    } = {},
  ) => {
    const link = getHowToLink(opts.linkKindOverride ?? template.linkKind, opts.country);
    items.push({
      id: `${section}_${idPrefix}`,
      section,
      doc: opts.docOverride ?? template.doc,
      person: PERSON_LABEL[section],
      why: opts.whyOverride ?? template.why,
      warning: opts.warning ?? template.warning,
      type: opts.type ?? 'normal',
      howToGet: link.instruction,
      documentDefId: template.documentDefId,
    });
  };

  // Emit marriage-cert line items for a person (one per marriage).
  const addMarriages = (
    section: ChecklistSection,
    m: MarriageCount | undefined,
    country?: CountryCode,
  ) => {
    const n = marriageCount(m);
    const ordinals = ['1st', '2nd', '3rd'];
    for (let i = 0; i < n; i++) {
      const isThirdPlus = i === 2;
      add(`mc${i + 1}`, section, docTemplates.marriageCert, {
        country,
        docOverride: isThirdPlus
          ? 'Original civil marriage certificate(s) — 3rd marriage and any further'
          : `Original civil marriage certificate — ${ordinals[i]} marriage`,
        warning: isThirdPlus ? 'All marriages required' : docTemplates.marriageCert.warning,
      });
    }
  };

  // Emit a name-change item (deed poll vs anglicisation).
  const addNameChange = (section: ChecklistSection, nc: NameChange | undefined) => {
    if (nc === 'YES_DEED') add('nc', section, docTemplates.nameChangeDeed);
    else if (nc === 'YES_ANGL') add('angl', section, docTemplates.nameChangeAngl);
  };

  // ── Group 4: Grandparent (ROUTE_A only) ─────────────────────
  if (isRouteA) {
    const gpCountry = a.gp_birth_country;
    // 4.1 / 4.2 / 4.3 — birth cert vs baptismal (pre-1864)
    if (a.gp_pre_1864 === 'YES') {
      add('baptism', 'grandparent', docTemplates.baptismal, { country: gpCountry });
    } else if (a.gp_pre_1864 === 'UNKNOWN') {
      add('bc', 'grandparent', docTemplates.birthCert, {
        country: gpCountry,
        docOverride: 'Long-form civil birth certificate OR baptismal certificate',
        whyOverride:
          'If born before 1864, civil registration didn’t exist — a baptismal certificate is accepted instead. Determine which applies.',
      });
    } else {
      add('bc', 'grandparent', docTemplates.birthCert, { country: gpCountry });
    }
    // 4.4 marriages
    addMarriages('grandparent', a.gp_marriages, gpCountry);
    // 4.5 name change
    addNameChange('grandparent', a.gp_name_change);
    // 4.6 / 4.7 ID or death cert (+ expired-ID blocker)
    if (a.gp_alive === 'NO') {
      add('death', 'grandparent', docTemplates.deathCert, { country: gpCountry });
    } else if (a.gp_alive === 'YES' && a.gp_id_valid === 'NO') {
      add('id_block', 'grandparent', docTemplates.photoIdExpiredBlock, { type: 'block' });
    } else if (a.gp_alive === 'YES') {
      add('id', 'grandparent', docTemplates.photoId);
    }
    // 4.8 translation
    if (a.gp_cert_translation) {
      add('translation', 'grandparent', docTemplates.translation, {
        docOverride: 'Certified translation of grandparent’s birth certificate',
      });
    }
  }

  // ── Group 2: Irish citizen parent (always) ──────────────────
  const pCountry = a.parent_birth_country;
  add('bc', 'parent', docTemplates.birthCert, { country: pCountry });
  addMarriages('parent', a.parent_marriages, pCountry);
  addNameChange('parent', a.parent_name_change);
  if (a.parent_alive === 'NO') {
    add('death', 'parent', docTemplates.deathCert, { country: pCountry });
  } else {
    add('id', 'parent', docTemplates.photoId);
  }
  if (a.parent_cert_translation) {
    add('translation', 'parent', docTemplates.translation, {
      docOverride: 'Certified translation of parent’s birth certificate',
    });
  }

  // ── Group 3: Route-specific parent documents ────────────────
  switch (route) {
    case 'ROUTE_B_FBR':
      add('fbr', 'parent', docTemplates.fbrCert, {
        type: 'normal',
        warning: a.parent_fbr_cert_available === 'NO' ? 'Appears lost — order replacement early' : undefined,
      });
      break;
    case 'ROUTE_B_NATURALISATION':
      add('nat', 'parent', docTemplates.naturalisationCert);
      break;
    case 'ROUTE_B_POSTNUPTIAL':
      add('pnup', 'parent', docTemplates.postnuptialCert);
      break;
    case 'ROUTE_B_ADOPTION':
      add('adopt', 'parent', docTemplates.adoptionCert, { country: pCountry });
      add('adopt_proof', 'parent', docTemplates.adoptionProof);
      break;
    default:
      break;
  }

  // ── Group 1: Your documents (always) ────────────────────────
  const youCountry = a.applicant_birth_country;
  add('form', 'you', docTemplates.applicationForm);
  add('bc', 'you', docTemplates.birthCert, { country: youCountry });
  addMarriages('you', a.applicant_marriages, youCountry);
  addNameChange('you', a.applicant_name_change);
  add('id', 'you', docTemplates.photoId, {
    whyOverride: 'Certified by your application form witness.',
  });
  // Translations (1.9 / 1.10)
  if (a.applicant_cert_translation) {
    add('translation', 'you', docTemplates.translation, {
      docOverride: 'Certified translation of your birth certificate',
    });
    if (marriageCount(a.applicant_marriages) > 0) {
      add('translation_mc', 'you', docTemplates.translation, {
        docOverride: 'Certified translation of your marriage certificate',
      });
    }
  }

  // ── Group 5: Minor additions / Group 1 adult address+photos ─
  if (isMinor) {
    add('school', 'you', docTemplates.schoolLetter);
    add('photos', 'you', docTemplates.childPhotos);
    add('guardian_photos', 'you', docTemplates.guardianPhotos);
    add('guardian_address', 'you', docTemplates.guardianAddress);
    if (a.guardian_type === 'NON_PARENT_GUARDIAN') {
      add('guardianship', 'you', docTemplates.guardianship);
    }
  } else {
    add('addr', 'you', docTemplates.addressProofs);
    add('photos', 'you', docTemplates.photos);
  }

  // ── Group 6: Estrangement affidavit ─────────────────────────
  if (a.estrangement && a.estrangement !== 'NONE') {
    add('affidavit', 'you', docTemplates.affidavit, { country: youCountry });
  }

  return { items, alerts: buildAlerts(route, answers, items) };
}

// ── Group 7: Alerts (shown inline / at top, not documents) ────

function buildAlerts(
  route: Route | null,
  a: ChecklistAnswers,
  items: ChecklistItem[],
): ChecklistAlert[] {
  const alerts: ChecklistAlert[] = [];
  const push = (id: string, level: 'warn' | 'info', text: string) =>
    alerts.push({ id, level, text });

  // 7.1 parent married
  if (marriageCount(a.parent_marriages) > 0) push('parent_marriage', 'warn', alertText.parentMarriage);
  // 7.2 grandparent married (Route A)
  if (route === 'ROUTE_A' && marriageCount(a.gp_marriages) > 0)
    push('gp_marriage', 'warn', alertText.grandparentMarriage);
  // 7.4 FBR cert lost
  if (route === 'ROUTE_B_FBR' && a.parent_fbr_cert_available === 'NO')
    push('fbr_lost', 'warn', alertText.fbrCertLost);
  // 7.5 pre-1864 grandparent
  if (route === 'ROUTE_A' && (a.gp_pre_1864 === 'YES' || a.gp_pre_1864 === 'UNKNOWN'))
    push('pre_1864', 'info', alertText.pre1864);
  // 7.6 estrangement
  if (a.estrangement && a.estrangement !== 'NONE')
    push('estrangement', 'info', alertText.estrangement);
  // 7.3 US applicant
  if (a.applicant_birth_country === 'USA') push('us', 'info', alertText.usApplicant);
  // 7.7 always
  push('original', 'info', alertText.originalMeaning);
  // 7.8 adults only
  if (a.applicant_type !== 'MINOR') push('no_passport', 'info', alertText.noPassportInEnvelope);

  return alerts;
}

// ── Derived helpers used by the UI ────────────────────────────

export function hasBlocker(items: ChecklistItem[]): boolean {
  return items.some((i) => i.type === 'block');
}

export interface ChecklistProgress {
  total: number;
  done: number;
  pct: number;
  hasBlocker: boolean;
}

export function checklistProgress(
  items: ChecklistItem[],
  checked: Record<string, boolean>,
): ChecklistProgress {
  const normal = items.filter((i) => i.type !== 'block');
  const total = normal.length;
  const done = normal.filter((i) => checked[i.id]).length;
  return {
    total,
    done,
    pct: total === 0 ? 0 : Math.round((done / total) * 100),
    hasBlocker: hasBlocker(items),
  };
}

/** Summary counts for the top of the checklist (rules doc "Summary Counts"). */
export function summaryCounts(result: ChecklistResult) {
  const bySection = (s: ChecklistSection) =>
    result.items.filter((i) => i.section === s).length;
  return {
    total: result.items.length,
    you: bySection('you'),
    parent: bySection('parent'),
    grandparent: bySection('grandparent'),
    warnings: result.alerts.length,
  };
}
