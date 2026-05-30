// ─────────────────────────────────────────────────────────────
// Document-rule text catalog + Group 7 alert definitions.
// Source: fbr_document_checklist_rules.md Phase 2 (Groups 1–7).
// The conditional logic that applies these lives in
// src/engine/checklist.ts. This module is pure data (OTA-updatable).
// ─────────────────────────────────────────────────────────────

import type { LinkKind } from '@/content/links';

/** A reusable template for a generated checklist item. */
export interface DocTemplate {
  doc: string;
  why: string;
  /** Links to documents.ts for the full detail screen. */
  documentDefId: string;
  /** Which country link table to use for "how to get it". */
  linkKind: LinkKind;
  /** Inline amber warning tag, if always applicable to this template. */
  warning?: string;
}

export const MARRIAGE_WARNING = 'Required even with no name change';

export const docTemplates = {
  applicationForm: {
    doc: 'Completed, signed & witnessed application form',
    why: 'The core application. Complete it online, print it, and sign it in front of your witness.',
    documentDefId: 'application_form',
    linkKind: 'witness',
  },
  birthCert: {
    doc: 'Original long-form civil birth certificate',
    why: 'Always required. Must be the long form showing both parents’ names — short-form extracts are rejected.',
    documentDefId: 'birth_certificate',
    linkKind: 'birth',
  },
  marriageCert: {
    doc: 'Original civil marriage certificate',
    why: 'Required for every marriage in the chain — even if the person’s name did not change.',
    documentDefId: 'marriage_certificate',
    linkKind: 'marriage',
    warning: MARRIAGE_WARNING,
  },
  nameChangeDeed: {
    doc: 'Change of name document (deed poll / statutory declaration)',
    why: 'Bridges the name on the birth certificate to the current name.',
    documentDefId: 'name_change',
    linkKind: 'name_change',
  },
  nameChangeAngl: {
    doc: 'Statutory declaration explaining the name difference',
    why: 'Explains an anglicised or informal name change so the document chain reads as one person.',
    documentDefId: 'name_change',
    linkKind: 'affidavit',
    warning: 'Declaration needed to bridge name',
  },
  photoId: {
    doc: 'Certified photocopy of current photo ID',
    why: 'Confirms identity. Must be current and unexpired, certified by a professional from the witness list.',
    documentDefId: 'photo_id',
    linkKind: 'witness',
  },
  photoIdExpiredBlock: {
    doc: 'Valid photo ID — must be renewed first',
    why: 'Their current ID is expired. The DFA will not accept it and will return the whole application.',
    documentDefId: 'photo_id',
    linkKind: 'witness',
    warning: 'Expired ID — renew before submitting',
  },
  deathCert: {
    doc: 'Original civil death certificate',
    why: 'Replaces the photo ID requirement for a deceased person.',
    documentDefId: 'death_certificate',
    linkKind: 'death',
  },
  addressProofs: {
    doc: '2 separate original proofs of address',
    why: 'Originals only — photocopies are not accepted. Use two different issuers.',
    documentDefId: 'proof_of_address',
    linkKind: 'witness',
  },
  photos: {
    doc: '4 passport-sized colour photographs',
    why: '2 of the 4 must be signed and dated by your witness. Do not attach them to the form.',
    documentDefId: 'passport_photos',
    linkKind: 'witness',
  },
  translation: {
    doc: 'Certified translation',
    why: 'The DFA only accepts documents in English or Irish.',
    documentDefId: 'certified_translation',
    linkKind: 'translation',
  },
  baptismal: {
    doc: 'Baptismal certificate',
    why: 'Civil registration didn’t exist in Ireland before 1864, so a baptismal certificate is accepted. Include a cover note explaining this.',
    documentDefId: 'baptismal_certificate',
    linkKind: 'baptismal',
  },
  // Route B route-specific parent documents (Group 3)
  fbrCert: {
    doc: 'Original Foreign Birth Registration Certificate',
    why: 'Proves your parent’s Irish citizenship by descent. Must pre-date your birth.',
    documentDefId: 'fbr_certificate',
    linkKind: 'fbr_replacement',
  },
  naturalisationCert: {
    doc: 'Original Irish Naturalisation Certificate',
    why: 'Proves your parent became Irish through naturalisation.',
    documentDefId: 'naturalisation_certificate',
    linkKind: 'naturalisation_replacement',
  },
  postnuptialCert: {
    doc: 'Original Post-Nuptial Citizenship Certificate',
    why: 'Proves your parent acquired citizenship through a post-nuptial declaration.',
    documentDefId: 'postnuptial_certificate',
    linkKind: 'postnuptial_replacement',
  },
  adoptionCert: {
    doc: 'Original adoption certificate and adoption order',
    why: 'Issued by the central adoption authority of the country where the adoption took place.',
    documentDefId: 'adoption_certificate',
    linkKind: 'name_change',
  },
  adoptionProof: {
    doc: 'Original proof of Irish citizenship at date of adoption',
    why: 'E.g. passport, FBR cert, or naturalisation cert held at the time of adoption.',
    documentDefId: 'adoption_certificate',
    linkKind: 'name_change',
  },
  // Minor additions (Group 5)
  schoolLetter: {
    doc: "Letter from school, GP, or relevant source (headed paper, child's address)",
    why: 'Confirms the child’s address. No standard form — any official headed paper.',
    documentDefId: 'school_letter',
    linkKind: 'witness',
  },
  childPhotos: {
    doc: '4 passport photos of the child (2 witnessed)',
    why: 'In addition to the 4 photos of the parent/guardian.',
    documentDefId: 'passport_photos',
    linkKind: 'witness',
  },
  guardianPhotos: {
    doc: '4 passport photos of the parent/guardian (2 witnessed)',
    why: 'For the adult making the application on the child’s behalf.',
    documentDefId: 'passport_photos',
    linkKind: 'witness',
  },
  guardianAddress: {
    doc: '2 separate original proofs of address (parent/guardian)',
    why: 'For the parent/guardian making the application, not the child.',
    documentDefId: 'proof_of_address',
    linkKind: 'witness',
  },
  guardianship: {
    doc: 'Proof of guardianship / parental responsibility',
    why: 'Court order, guardianship certificate, or equivalent — required when the applicant is not the child’s parent.',
    documentDefId: 'guardianship',
    linkKind: 'witness',
  },
  // Estrangement (Group 6)
  affidavit: {
    doc: 'Signed affidavit / statutory declaration explaining estrangement',
    why: 'Explains why a required document cannot be obtained. Include it proactively — the DFA does accept this.',
    documentDefId: 'affidavit',
    linkKind: 'affidavit',
  },
} satisfies Record<string, DocTemplate>;

export type DocTemplateKey = keyof typeof docTemplates;

// ── Group 7 alerts (text only; the engine decides when to show each) ──

export const alertText = {
  parentMarriage:
    '⚠️ Marriage certificates are required even if there was no name change. The DFA website says "if applicable" — this is misleading. Skipping a marriage certificate is the most common cause of 3–6 month delays.',
  grandparentMarriage:
    '⚠️ Your grandparent’s marriage certificate is required if they were married — even with no name change. Skipping it is a top cause of delays.',
  usApplicant:
    'ℹ️ US applicants: order certificates from your local city/county clerk first, not VitalChek. Always request "long form with parental details and raised seal". Send documents by USPS Registered Mail and include Eircode K32 AE72.',
  fbrCertLost:
    '⚠️ Your parent’s FBR certificate is required and appears to be lost. Order a replacement at fbrcertreplacements.dfa.ie — there is a backlog, so do this as early as possible.',
  pre1864:
    'ℹ️ Your grandparent was born before civil registration began in Ireland (1864). A baptismal certificate is accepted — include a note explaining this.',
  estrangement:
    'ℹ️ Estrangement from a required person doesn’t make you ineligible. Include a signed affidavit explaining the situation — the DFA does accept this.',
  originalMeaning:
    'ℹ️ "Original" means a fresh certified copy from the registry — not an old family document. Order new official copies for anything you’d hate to lose.',
  noPassportInEnvelope:
    'ℹ️ Do not include a passport application in the same envelope. They are processed in different offices and your whole package will be returned.',
} as const;
