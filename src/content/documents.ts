// ─────────────────────────────────────────────────────────────
// Document definitions (the 17 document types).
// Source: irish_fbr_document_guide.md. Country-specific acquisition
// links live in links.ts and are resolved per-person at display time.
// ─────────────────────────────────────────────────────────────

import type { LinkKind } from '@/content/links';

export interface DocumentDef {
  id: string;
  name: string;
  description: string;
  whoNeedsIt: string;
  criticalRules: string[];
  /** Which links.ts table powers the country-specific "how to get it". */
  linkKind: LinkKind;
  commonPitfalls: string[];
}

export const documents: Record<string, DocumentDef> = {
  birth_certificate: {
    id: 'birth_certificate',
    name: 'Civil Birth Certificate',
    description:
      'An official civil registration of birth from the government registry of the country of birth. Must be the long-form / full version showing both parents’ names.',
    whoNeedsIt: 'You, your Irish citizen parent, and (Route A) your Irish-born grandparent — always.',
    criticalRules: [
      'Long-form only — short-form extracts without parental details are rejected.',
      '"Original" means a freshly ordered certified copy from the registry, not a family heirloom or photocopy.',
      'A US Consular Report of Birth Abroad (CBRA) is not accepted.',
      'For pre-1864 Irish births, a baptismal certificate is used instead.',
    ],
    linkKind: 'birth',
    commonPitfalls: [
      'Receiving a short-form certificate from VitalChek — always specify "long form with parental details and raised seal".',
      'New York State copies can take 6+ months — order early.',
    ],
  },
  marriage_certificate: {
    id: 'marriage_certificate',
    name: 'Civil Marriage Certificate',
    description:
      'An official civil registration of marriage showing both spouses’ names, dates, and typically parents’ names.',
    whoNeedsIt: 'Any person in the chain who was married — regardless of whether their name changed.',
    criticalRules: [
      'Required for EVERY marriage, even with no name change. This is the #1 cause of delays.',
      'Include certificates for all marriages where there were multiple.',
      'Marriage certificates corroborate lineage (ages, birthplaces, parents’ names).',
    ],
    linkKind: 'marriage',
    commonPitfalls: [
      'Believing the DFA’s "if applicable" wording means optional — it is not.',
      'US marriages are registered at COUNTY level, not state.',
    ],
  },
  name_change: {
    id: 'name_change',
    name: 'Change of Name Document',
    description:
      'An official record of a legal name change other than by marriage — deed poll, statutory declaration, or court order.',
    whoNeedsIt: 'Anyone whose current name differs from their birth certificate (other than via marriage).',
    criticalRules: [
      'Required to bridge any break in the name chain across documents.',
      'For anglicised/informal changes, a sworn statutory declaration explaining the difference is used.',
    ],
    linkKind: 'name_change',
    commonPitfalls: ['Unenrolled UK deed polls are generally accepted — you don’t always need an enrolled one.'],
  },
  death_certificate: {
    id: 'death_certificate',
    name: 'Civil Death Certificate',
    description: 'An official civil registration of death showing name, date, and place of death.',
    whoNeedsIt: 'Any deceased person in the chain — it replaces their photo ID requirement.',
    criticalRules: [
      'Replaces photo ID for a deceased relative.',
      'A living relative needs current photo ID, not a death certificate.',
    ],
    linkKind: 'death',
    commonPitfalls: ['US death certificates are issued at STATE level (unlike marriage certs).'],
  },
  photo_id: {
    id: 'photo_id',
    name: 'Photo Identification (certified copy)',
    description:
      'A certified photocopy of a current, valid government photo ID (passport, national ID card, or driving licence).',
    whoNeedsIt: 'You (always), and each living relative in the chain.',
    criticalRules: [
      'The ID must be CURRENT and not expired — an expired ID gets the whole application returned.',
      'Must be certified: "Certified to be a true copy of the original seen by me", signed, dated, with the certifier’s details and stamp.',
      'Your own ID is certified by your application-form witness.',
    ],
    linkKind: 'witness',
    commonPitfalls: [
      'Sending a copy of an expired passport.',
      'Some US notaries can’t certify documents they also signed — use a different notary or profession.',
    ],
  },
  proof_of_address: {
    id: 'proof_of_address',
    name: 'Proof of Address',
    description: 'Two separate original documents confirming your current residential address.',
    whoNeedsIt: 'You (always). For a minor application, the parent/guardian provides these.',
    criticalRules: [
      'Both must be ORIGINALS — photocopies are not accepted.',
      'Use two different issuers (e.g. a utility bill and a bank statement).',
    ],
    linkKind: 'witness',
    commonPitfalls: ['Using two documents from the same issuer.'],
  },
  passport_photos: {
    id: 'passport_photos',
    name: 'Passport Photographs',
    description: 'Four passport-sized colour photographs of the applicant.',
    whoNeedsIt: 'You. For a minor: 4 of the child AND 4 of the parent/guardian.',
    criticalRules: [
      '2 of the 4 must be signed and dated by your witness.',
      'Do NOT attach the photos to the form — submit them loose.',
      'Standard 35mm × 45mm, plain background, taken within the last 6 months.',
    ],
    linkKind: 'witness',
    commonPitfalls: ['Stapling photos to the application form.'],
  },
  application_form: {
    id: 'application_form',
    name: 'Application Form (witnessed)',
    description: 'The online FBR form, completed, printed, and signed in front of a qualified witness.',
    whoNeedsIt: 'You — the core of the application.',
    criticalRules: [
      'Complete every section online at fbr.dfa.ie — do not leave any blank.',
      'Sign in the physical presence of your witness, who stamps it and certifies your ID.',
      'When asked how your PARENT acquired citizenship, choose "Born abroad to a parent born in Ireland" to unlock the grandparent tab.',
    ],
    linkKind: 'witness',
    commonPitfalls: ['Selecting the wrong parent-citizenship option, leaving the grandparent tab greyed out.'],
  },
  fbr_certificate: {
    id: 'fbr_certificate',
    name: "Foreign Birth Registration Certificate (parent's)",
    description: "Your parent's A4 FBR certificate proving their Irish citizenship by descent.",
    whoNeedsIt: 'Route B — when your parent is Irish through their own FBR registration.',
    criticalRules: [
      'Your parent must have been registered BEFORE you were born.',
      'If lost or stolen, order a replacement — there is currently a backlog.',
    ],
    linkKind: 'fbr_replacement',
    commonPitfalls: ['Not checking the issue date pre-dates your birth.'],
  },
  naturalisation_certificate: {
    id: 'naturalisation_certificate',
    name: 'Irish Naturalisation Certificate',
    description: 'The certificate issued when your parent became Irish through naturalisation.',
    whoNeedsIt: 'Route B — when your parent naturalised.',
    criticalRules: ['Original required.', 'If lost, contact INIS for a replacement.'],
    linkKind: 'naturalisation_replacement',
    commonPitfalls: [],
  },
  postnuptial_certificate: {
    id: 'postnuptial_certificate',
    name: 'Post-Nuptial Citizenship Certificate',
    description:
      'A certificate issued under older Irish law to foreign nationals who married Irish citizens and declared citizenship.',
    whoNeedsIt: 'Route B — when your parent acquired citizenship by post-nuptial declaration.',
    criticalRules: ['Original required.', 'If lost, contact the DFA Customer Service Hub.'],
    linkKind: 'postnuptial_replacement',
    commonPitfalls: ['This route is no longer available for new applicants, but existing certificates remain valid.'],
  },
  adoption_certificate: {
    id: 'adoption_certificate',
    name: 'Adoption Certificate and Adoption Order',
    description: 'The official legal documentation of an adoption.',
    whoNeedsIt: 'Route B (adoption) — when your parent was adopted by an Irish citizen.',
    criticalRules: [
      'Must be issued by the central adoption authority of the country where the adoption took place.',
      'Also include proof of Irish citizenship held at the date of adoption.',
      'Adoption cases should be confirmed with the DFA directly before applying.',
    ],
    linkKind: 'name_change',
    commonPitfalls: ['Assuming any adoption qualifies — recognition under Irish law is required.'],
  },
  certified_translation: {
    id: 'certified_translation',
    name: 'Certified Translation',
    description: 'A professional translation of any document not in English or Irish, with a signed certification.',
    whoNeedsIt: 'Anyone whose certificates are in another language.',
    criticalRules: [
      'Must be by a qualified translator with a signed statement of accuracy.',
      'Applies to birth, marriage, and death certificates alike.',
    ],
    linkKind: 'translation',
    commonPitfalls: ['Some EU registries can issue a bilingual certificate — ask when ordering.'],
  },
  baptismal_certificate: {
    id: 'baptismal_certificate',
    name: 'Baptismal Certificate (pre-1864 births only)',
    description: 'A church record of baptism, used when a civil birth certificate cannot exist (pre-1864).',
    whoNeedsIt: 'An Irish-born ancestor born before 1864.',
    criticalRules: [
      'Only accepted for births before 1864 (civil registration began that year).',
      'Include a cover note explaining the birth predates civil registration.',
    ],
    linkKind: 'baptismal',
    commonPitfalls: ['Submitting a baptismal certificate for a post-1864 birth — it will be rejected.'],
  },
  school_letter: {
    id: 'school_letter',
    name: 'School / Doctor Letter (minor applicants)',
    description: "A letter on official headed paper confirming a minor's address.",
    whoNeedsIt: 'All minor (under 18) applicants.',
    criticalRules: [
      "Must include the child's full name and address on headed paper, signed by the issuer.",
      'No standard form — a simple covering letter is sufficient.',
    ],
    linkKind: 'witness',
    commonPitfalls: [],
  },
  guardianship: {
    id: 'guardianship',
    name: 'Proof of Guardianship (minor applicants)',
    description: 'Legal documentation that the applicant has guardianship or parental responsibility for the child.',
    whoNeedsIt: 'When the applicant is not the child’s parent.',
    criticalRules: ['Court order, guardianship certificate, adoption order, or equivalent.'],
    linkKind: 'witness',
    commonPitfalls: [],
  },
  affidavit: {
    id: 'affidavit',
    name: 'Affidavit / Statutory Declaration (estrangement or missing docs)',
    description:
      'A signed, witnessed statement explaining why a normally required document cannot be obtained.',
    whoNeedsIt: 'When estranged from a living relative whose ID is needed, or a document is genuinely impossible to obtain.',
    criticalRules: [
      'Explain the situation fully and factually: how long estranged, why contact isn’t possible, what you’ve tried.',
      'Sworn before a notary, commissioner for oaths, or solicitor.',
      'Include it in your original application proactively — don’t wait to be asked.',
    ],
    linkKind: 'affidavit',
    commonPitfalls: ['Waiting for the DFA to request it ~9 months in instead of including it upfront.'],
  },
};

export function getDocument(id: string | undefined): DocumentDef | undefined {
  return id ? documents[id] : undefined;
}
