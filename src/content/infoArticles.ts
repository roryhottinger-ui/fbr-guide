// ─────────────────────────────────────────────────────────────
// Info / FAQ content. Source: irish_fbr_context_document.md
// (gotchas §18, community tips §20–21) + document guide. OTA-updatable.
// ─────────────────────────────────────────────────────────────

import { fees } from '@/content/fees';
import { timelines } from '@/content/timelines';

export interface InfoArticle {
  id: string;
  title: string;
  /** One-line summary shown in the hub list. */
  summary: string;
  /** Body paragraphs (rendered with spacing). */
  body: string[];
  /** Optional related external links. */
  links?: { label: string; url: string }[];
  /** Highlight critical articles at the top of the hub. */
  priority?: boolean;
}

export const infoArticles: InfoArticle[] = [
  {
    id: 'marriage_certs',
    title: 'Marriage certificates are (almost) never optional',
    summary: 'The #1 cause of delays. Required for every marriage, even with no name change.',
    priority: true,
    body: [
      'The DFA website says marriage certificates are required "if applicable" — this misleads thousands of applicants into thinking they are optional or only needed for a name change. They are not.',
      'If a person in your chain was married, their marriage certificate is required — always, regardless of gender or name change. Marriage certificates contain corroborating information (ages, birthplaces, parents’ names) that the DFA uses to verify lineage.',
      'If you skip one, you will typically be asked for it around 9 months in, which places you in a slower "additional documents" queue and adds several months. Include all marriage certificates up front — for every marriage of every person.',
    ],
  },
  {
    id: 'expired_id',
    title: 'Expired ID will get your application returned',
    summary: 'A living relative’s photo ID must be current. Renew before submitting.',
    priority: true,
    body: [
      'For every living person in the chain, you need a certified copy of a current, valid government photo ID — passport, national ID card, or driving licence.',
      'An expired ID is not accepted and will cause the whole application to be returned. This is a hard blocker, not a warning.',
      'If an elderly relative’s passport has expired, arrange a renewal early (it can take weeks), or use a valid driving licence or EU national ID card instead. A deceased relative’s death certificate replaces the ID requirement.',
    ],
  },
  {
    id: 'witnesses',
    title: 'Choosing a witness',
    summary: 'Must be on the profession list, not a family member, and currently practising.',
    body: [
      'Your witness must be personally known to you (meeting in person and showing ID is enough), must not be a family member, and must currently practise one of the accepted professions: Garda/police, teacher/principal, clergy, doctor, nurse, pharmacist/dentist, lawyer/notary/commissioner for oaths, bank manager, accountant, elected representative, vet, or chartered engineer.',
      'The witness signs your form in their presence, certifies your photo ID copy, signs 2 of your 4 photos, and adds their stamp or business card.',
      'You, your parent, and your grandparent can each use different witnesses. In the US, a notary public is the most accessible option (banks, libraries, UPS Store).',
    ],
    links: [{ label: 'Find an Irish cultural centre (witness help)', url: 'https://www.irishcentres.com/' }],
  },
  {
    id: 'photos',
    title: 'Passport photographs',
    summary: '4 photos, 2 witnessed, submitted loose — never attached to the form.',
    body: [
      'Submit 4 passport-sized colour photographs. 2 of the 4 must be signed and dated on the back by the same witness who witnesses your form.',
      'Do not attach the photographs to the application form — submit them loose.',
      'For a minor: 4 photos of the child AND 4 photos of the parent/guardian (2 of each witnessed).',
    ],
  },
  {
    id: 'fees',
    title: 'Fees',
    summary: `Adult ${fees.adultLabel}, under-18 ${fees.minorLabel}. Paid online, non-refundable.`,
    body: [
      `The fee is ${fees.adultLabel} for adults and ${fees.minorLabel} for under-18s. ${fees.note}`,
      'No prepaid envelope is needed — documents are returned by recorded delivery, which you must sign for.',
    ],
  },
  {
    id: 'timelines',
    title: 'How long it takes',
    summary: `Officially ~${timelines.officialMonths} months; real-world ${timelines.typicalRangeLabel}.`,
    body: [
      `The DFA advertises roughly ${timelines.officialMonths} months. Community-reported data suggests ${timelines.typicalRangeLabel} is more typical (average around ${timelines.averageLabel}).`,
      'Applications are processed in strict date order. There is no way to expedite unless you are an expectant parent or stateless.',
      `The DFA does not proactively update you. Once you are past about ${timelines.statusCheckAfterMonths} months, a webchat check is reasonable. After approval, the certificate takes a further ${timelines.certPrintWeeks[0]}–${timelines.certPrintWeeks[1]} weeks to print and post.`,
    ],
    links: [
      {
        label: 'DFA webchat & contact',
        url: 'https://www.ireland.ie/en/dfa/citizenship/born-abroad/registering-a-foreign-birth/#Contact%20Foreign%20Birth%20Registration',
      },
    ],
  },
  {
    id: 'us_shipping',
    title: 'Sending documents from the USA',
    summary: 'USPS Registered Mail, declare "Non-Negotiable Documents", include Eircode K32 AE72.',
    body: [
      'Use USPS First Class Mail International Large Envelope (Flat) with the Registered Mail add-on, done at a USPS counter (not online).',
      'Tell the clerk: "Non-Negotiable Documents, value $0" — these aren’t subject to customs and need no customs form. Write "Non-Negotiable Documents / Vital Records / No Commercial Value" and your application number on the envelope.',
      'Include the Eircode K32 AE72 — mail has been returned without it. Do not pre-tape the seams; with Registered Mail the clerk tapes them. Avoid FedEx/DHL/UPS — private couriers may misdeclare the package and trigger customs charges in Ireland.',
      'Also order certificates from your local city/county clerk first rather than VitalChek, and always request "long form with parental details and raised seal".',
    ],
  },
  {
    id: 'estrangement',
    title: 'Estrangement is solvable with an affidavit',
    summary: 'Not being able to contact a relative doesn’t make you ineligible.',
    body: [
      'You can still order a relative’s birth, marriage, and death certificates yourself — these are public records.',
      'If a living relative is uncontactable and you can’t get their ID, include a signed affidavit in your original application explaining the estrangement, why contact isn’t possible, and what you’ve tried. The DFA takes your circumstances into account.',
      'Community experience confirms this works: one applicant estranged from their father was approved without ever providing his ID, on the strength of the affidavit.',
    ],
  },
  {
    id: 'original_means',
    title: 'What "original" really means',
    summary: 'A fresh certified copy from the registry — not an old family document.',
    body: [
      'An "original" for FBR purposes is an official certified copy issued directly by the registry — freshly ordered, stamped and signed. It is not the specific paper issued at the time of birth.',
      'Never send irreplaceable family heirlooms. Order new certified copies. You cannot send a plain photocopy.',
      'Avoid the cheapest "research/genealogy" version (not accepted) and don’t overpay for an apostille/Hague version (not needed for FBR). The standard certified copy is what you want.',
    ],
  },
  {
    id: 'long_form',
    title: 'Long-form birth certificates only',
    summary: 'Must show both parents’ names. Short-form extracts are rejected.',
    body: [
      'Birth certificates must be the long-form / full version showing parental details. Short-form extracts that show only the person’s name and date of birth are not accepted.',
      'When ordering, explicitly request the full/long-form version. A US Consular Report of Birth Abroad (CBRA) is not accepted — get the actual birth certificate from the country of birth.',
    ],
  },
  {
    id: 'no_passport_envelope',
    title: 'Don’t mix a passport application in the envelope',
    summary: 'FBR and passport are processed in different offices.',
    body: [
      'Do not include a passport application in the same envelope as your FBR application. They are processed in different offices and the entire package will be returned to you.',
      'You apply for the passport only after your FBR registration is complete and you have your FBR certificate.',
    ],
  },
  {
    id: 'application_form_tab',
    title: 'The greyed-out grandparent tab',
    summary: 'The form asks how your PARENT became Irish — not you.',
    body: [
      'On the online form, the question about how citizenship was acquired refers to your parent, not you.',
      'If your parent was born abroad to an Irish-born grandparent, select "Born abroad to a parent born in Ireland". The grandparent tab then becomes available. Choosing the wrong option here is one of the most common mistakes.',
    ],
    links: [{ label: 'FBR application portal', url: 'https://fbr.dfa.ie/' }],
  },
  {
    id: 'disclaimer',
    title: 'Not legal advice',
    summary: 'This app is an informational guide only.',
    body: [
      'This app is an informational guide compiled from official DFA guidance, Citizens Information, and community experience. It is not legal advice.',
      'Always verify current requirements at ireland.ie and consult a qualified Irish immigration solicitor for your specific situation. Requirements and fees can change.',
      'This app stores all your answers locally on your device. No personal data is collected or sent anywhere.',
    ],
    links: [
      {
        label: 'Official DFA FBR page',
        url: 'https://www.ireland.ie/en/dfa/citizenship/born-abroad/registering-a-foreign-birth/',
      },
    ],
  },
];

export function getInfoArticle(id: string | undefined): InfoArticle | undefined {
  return id ? infoArticles.find((a) => a.id === id) : undefined;
}
