// ─────────────────────────────────────────────────────────────
// "How to get it" links by document kind and country.
// Source: fbr_document_checklist_rules.md (link tables) +
//         irish_fbr_document_guide.md. OTA-updatable.
// ─────────────────────────────────────────────────────────────

import type { CountryCode } from '@/types';

export interface HowToLink {
  /** Short instruction shown in context. */
  instruction: string;
  /** External URL opened in the browser. */
  url: string;
}

export const COUNTRY_LABELS: Record<CountryCode, string> = {
  ROI: 'Republic of Ireland',
  NI: 'Northern Ireland',
  EW: 'England & Wales',
  SCO: 'Scotland',
  USA: 'United States',
  AUS: 'Australia',
  CAN: 'Canada',
  OTHER: 'Other country',
};

/** Document kinds that have country-specific acquisition links. */
export type LinkKind =
  | 'birth'
  | 'marriage'
  | 'death'
  | 'baptismal'
  | 'name_change'
  | 'translation'
  | 'fbr_replacement'
  | 'naturalisation_replacement'
  | 'postnuptial_replacement'
  | 'affidavit'
  | 'witness';

type CountryMap = Partial<Record<CountryCode, HowToLink>> & { DEFAULT?: HowToLink };

export const links: Record<LinkKind, CountryMap> = {
  birth: {
    ROI: { instruction: 'Order a long-form certified copy from GRO Ireland or search irishgenealogy.ie.', url: 'https://www.groireland.ie/' },
    NI: { instruction: 'Order from GRONI. Births 1864–1921 are also available from GRO Ireland / irishgenealogy.ie.', url: 'https://www.nidirect.gov.uk/articles/general-register-office' },
    EW: { instruction: 'Order the long-form certificate online from the UK GRO.', url: 'https://www.gro.gov.uk/gro/content/certificates/login.asp' },
    SCO: { instruction: 'Order from National Records of Scotland via mygov.scot.', url: 'https://www.mygov.scot/order-a-birth-certificate' },
    USA: { instruction: 'Try your local city/county clerk first. Always request "long form with parental details and raised seal".', url: 'https://www.vitalchek.com/' },
    AUS: { instruction: 'Order from the Births, Deaths & Marriages office of the relevant state/territory.', url: 'https://www.nsw.gov.au/topics/births-deaths-marriages-and-civil-partnerships/births' },
    CAN: { instruction: 'Order from the provincial/territorial Vital Statistics office.', url: 'https://www.canada.ca/en/employment-social-development/services/vital-statistics.html' },
    OTHER: { instruction: 'Contact the national civil registration authority of the country of birth. If not in English/Irish, a certified translation is required.', url: 'https://www.ireland.ie/en/dfa/citizenship/born-abroad/registering-a-foreign-birth/' },
  },
  marriage: {
    ROI: { instruction: 'Order from irishgenealogy.ie or the HSE Civil Registration Service.', url: 'https://www2.hse.ie/services/births-deaths-and-marriages/get-certificates/marriage-certificates/' },
    NI: { instruction: 'Order from GRONI.', url: 'https://www.nidirect.gov.uk/articles/general-register-office' },
    EW: { instruction: 'Order online from the UK GRO.', url: 'https://www.gro.gov.uk/gro/content/certificates/login.asp' },
    SCO: { instruction: 'Order via mygov.scot.', url: 'https://www.mygov.scot/order-a-marriage-certificate' },
    USA: { instruction: 'US marriages are registered at COUNTY level. Order from the county clerk where the marriage took place.', url: 'https://www.vitalchek.com/' },
    AUS: { instruction: 'Contact the state/territory Births, Deaths & Marriages office for where the marriage was registered.', url: 'https://www.nsw.gov.au/topics/births-deaths-marriages-and-civil-partnerships/marriages' },
    CAN: { instruction: 'Order from the provincial Vital Statistics office for where the marriage took place.', url: 'https://www.canada.ca/en/employment-social-development/services/vital-statistics.html' },
    OTHER: { instruction: 'Contact the civil registration authority for the jurisdiction where the marriage was registered.', url: 'https://www.ireland.ie/en/dfa/citizenship/born-abroad/registering-a-foreign-birth/' },
  },
  death: {
    ROI: { instruction: 'Order from irishgenealogy.ie or the HSE Civil Registration Service.', url: 'https://www2.hse.ie/services/births-deaths-and-marriages/get-certificates/death-certificates/' },
    NI: { instruction: 'Order from GRONI.', url: 'https://www.nidirect.gov.uk/articles/general-register-office' },
    EW: { instruction: 'Order online from the UK GRO.', url: 'https://www.gro.gov.uk/gro/content/certificates/login.asp' },
    SCO: { instruction: 'Order via mygov.scot.', url: 'https://www.mygov.scot/order-a-death-certificate' },
    USA: { instruction: 'US death certificates are issued at STATE level. Search "[state] vital records death certificate".', url: 'https://www.vitalchek.com/' },
    AUS: { instruction: 'Contact the state/territory Births, Deaths & Marriages office for the place of death.', url: 'https://www.nsw.gov.au/topics/births-deaths-marriages-and-civil-partnerships/deaths' },
    CAN: { instruction: 'Order from the provincial Vital Statistics office for the place of death.', url: 'https://www.canada.ca/en/employment-social-development/services/vital-statistics.html' },
    OTHER: { instruction: 'Contact the civil registration authority for the jurisdiction of death.', url: 'https://www.ireland.ie/en/dfa/citizenship/born-abroad/registering-a-foreign-birth/' },
  },
  baptismal: {
    ROI: { instruction: 'Search the NLI Catholic Parish Registers or irishgenealogy.ie. Include a cover note explaining the birth predates civil registration (1864).', url: 'https://registers.nli.ie/' },
    NI: { instruction: 'Search PRONI for church records. Include a cover note explaining the pre-1864 birth.', url: 'https://www.nidirect.gov.uk/proni' },
    DEFAULT: { instruction: 'Contact the relevant local parish or church archive. Include a cover note explaining the pre-1864 birth.', url: 'https://www.irishgenealogy.ie/' },
  },
  name_change: {
    ROI: { instruction: 'Deed poll enrolled in the High Court (Central Office), or statutory declaration via a solicitor/notary.', url: 'https://www.courts.ie/offices-and-contacts' },
    EW: { instruction: 'Enrolled or unenrolled deed poll. Unenrolled versions are generally accepted.', url: 'https://www.gov.uk/change-name-deed-poll/enrol-a-deed-poll-with-the-courts' },
    SCO: { instruction: 'Enrolled or unenrolled deed poll.', url: 'https://www.gov.uk/change-name-deed-poll/enrol-a-deed-poll-with-the-courts' },
    NI: { instruction: 'Record the change with GRONI (form GRO231 over 18, GRO230 under 18).', url: 'https://www.nidirect.gov.uk/articles/changing-your-name' },
    USA: { instruction: 'Obtain a certified copy of the court order from the issuing court.', url: 'https://www.usa.gov/legal-name-change' },
    DEFAULT: { instruction: 'Obtain the official deed poll, statutory declaration, or court order recording the change.', url: 'https://www.ireland.ie/en/dfa/citizenship/born-abroad/registering-a-foreign-birth/' },
  },
  translation: {
    DEFAULT: { instruction: 'Use a qualified, certified translator. The translation must include a signed statement of accuracy.', url: 'https://www.iti.org.uk/discover/find-a-language-professional.html' },
    USA: { instruction: 'Use an ATA-certified translator with a signed certification statement.', url: 'https://www.atanet.org/directory/' },
  },
  fbr_replacement: {
    DEFAULT: { instruction: 'Apply for a replacement FBR certificate. Note: there is currently a backlog — do this as early as possible.', url: 'https://fbrcertreplacements.dfa.ie/' },
  },
  naturalisation_replacement: {
    DEFAULT: { instruction: 'Contact INIS (Irish Naturalisation and Immigration Service) for a replacement.', url: 'https://www.irishimmigration.ie/' },
  },
  postnuptial_replacement: {
    DEFAULT: { instruction: 'Contact the DFA Customer Service Hub for a replacement.', url: 'https://www.ireland.ie/en/dfa/citizenship/born-abroad/registering-a-foreign-birth/#Contact%20Foreign%20Birth%20Registration' },
  },
  affidavit: {
    ROI: { instruction: 'Sworn before a Commissioner for Oaths or solicitor — find one via the Law Society of Ireland.', url: 'https://www.lawsociety.ie/Find-a-Solicitor/' },
    EW: { instruction: 'Sworn before a solicitor or notary public.', url: 'https://solicitors.lawsociety.org.uk/' },
    SCO: { instruction: 'Sworn before a solicitor or notary public.', url: 'https://www.lawscot.org.uk/find-a-solicitor/' },
    NI: { instruction: 'Sworn before a solicitor or notary public.', url: 'https://solicitors.lawsociety.org.uk/' },
    USA: { instruction: 'Sworn before a notary public (banks, UPS Store, libraries).', url: 'https://www.irishcentres.com/' },
    DEFAULT: { instruction: 'Sworn before a notary public, commissioner for oaths, or equivalent local legal officer.', url: 'https://www.irishcentres.com/' },
  },
  witness: {
    DEFAULT: { instruction: 'Your witness must be on the DFA profession list and not a family member. Notaries are the most accessible fallback.', url: 'https://www.irishcentres.com/' },
  },
};

/** Resolve the best link for a document kind given a country (falls back sensibly). */
export function getHowToLink(kind: LinkKind, country?: CountryCode): HowToLink {
  const map = links[kind];
  if (country && map[country]) return map[country]!;
  if (map.DEFAULT) return map.DEFAULT;
  // Last resort: ROI, then the DFA page.
  return (
    map.ROI ?? {
      instruction: 'See the official DFA guidance for how to obtain this document.',
      url: 'https://www.ireland.ie/en/dfa/citizenship/born-abroad/registering-a-foreign-birth/',
    }
  );
}

export default links;
