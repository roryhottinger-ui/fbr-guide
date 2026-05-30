// ─────────────────────────────────────────────────────────────
// Shared TypeScript types. Everything depends on these.
// See docs/SPEC.md §5.
// ─────────────────────────────────────────────────────────────

// ── Eligibility ───────────────────────────────────────────────

export type EligibilityAnswerKey =
  | 'born_ireland'
  | 'parent_born_ireland'
  | 'grandparent_born_ireland'
  | 'parent_citizen'
  | 'parent_grandparent_born_ireland' // Q4b
  | 'parent_citizen_before_birth'
  | 'parent_route' // Q6
  | 'parent_documents'; // Q6b

export type EligibilityOutcome =
  | 'AUTO_CITIZEN_BIRTH'
  | 'AUTO_CITIZEN_PARENT'
  | 'ELIGIBLE'
  | 'NOT_ELIGIBLE'
  | 'NOT_ELIGIBLE_TIMING'
  | 'NOT_ELIGIBLE_UNCLEAR';

export type Route =
  | 'ROUTE_A'
  | 'ROUTE_B_FBR'
  | 'ROUTE_B_NATURALISATION'
  | 'ROUTE_B_POSTNUPTIAL'
  | 'ROUTE_B_ADOPTION';

/** Raw answer values keyed by question id. Values are option `value` strings. */
export type EligibilityAnswers = Partial<Record<EligibilityAnswerKey, string>>;

export interface EligibilityResult {
  outcome: EligibilityOutcome;
  route: Route | null;
}

// ── Checklist context answers ─────────────────────────────────

export type CountryCode = 'ROI' | 'NI' | 'EW' | 'SCO' | 'USA' | 'AUS' | 'CAN' | 'OTHER';

export type YesNo = 'YES' | 'NO';
export type MarriageCount = '0' | '1' | '2' | '3+';
export type NameChange = 'NO' | 'YES_DEED' | 'YES_ANGL';

export interface ChecklistAnswers {
  applicant_type: 'ADULT' | 'MINOR';
  guardian_type?: 'PARENT' | 'NON_PARENT_GUARDIAN';

  // Grandparent (ROUTE_A only)
  gp_alive?: YesNo;
  gp_id_valid?: YesNo;
  gp_marriages?: MarriageCount;
  gp_name_change?: NameChange;
  gp_birth_country?: CountryCode;
  gp_pre_1864?: 'YES' | 'NO' | 'UNKNOWN';
  gp_cert_translation?: boolean;

  // Irish citizen parent
  parent_alive?: YesNo;
  parent_marriages?: MarriageCount;
  parent_name_change?: NameChange;
  parent_birth_country?: CountryCode;
  parent_cert_translation?: boolean;
  parent_fbr_cert_available?: 'YES' | 'NO' | 'UNKNOWN';

  // Applicant
  applicant_marriages?: MarriageCount;
  applicant_name_change?: NameChange;
  applicant_birth_country?: CountryCode;
  applicant_cert_translation?: boolean;

  // Cross-cutting
  estrangement?: 'NONE' | 'PARENT' | 'GRANDPARENT' | 'BOTH';
  expecting_child?: YesNo;
}

// ── Generated checklist item ──────────────────────────────────

export type ChecklistSection = 'you' | 'parent' | 'grandparent';
export type ChecklistItemType = 'normal' | 'block';

export interface ChecklistItem {
  id: string;
  section: ChecklistSection;
  doc: string;
  person: string;
  why?: string;
  /** Inline amber warning tag. */
  warning?: string;
  /** `block` = hard blocker (e.g. expired ID). */
  type?: ChecklistItemType;
  /** Detail text shown when the item is expanded ("How to get this"). */
  howToGet?: string;
  /** Links to a documents.ts definition for the full detail screen. */
  documentDefId?: string;
}

// ── Alerts (Group 7 warnings/flags) ───────────────────────────

export type AlertLevel = 'warn' | 'info';

export interface ChecklistAlert {
  id: string;
  level: AlertLevel;
  text: string;
}
