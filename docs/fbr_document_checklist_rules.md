# FBR Dynamic Document Checklist — Rules Engine Specification

**Purpose:** Defines the questions asked after eligibility is confirmed, and the conditional logic that maps answers to the precise list of required documents. Designed to drive checklist generation in the app.

**Reads from:** Eligibility checker output (route tag: ROUTE_A, ROUTE_B_FBR, ROUTE_B_NATURALISATION, ROUTE_B_POSTNUPTIAL, ROUTE_B_ADOPTION)

---

## Phase 1: Context Questions

These questions are asked after eligibility is established. Answers are stored as variables used in Phase 2 to generate the checklist.

---

### Section A — About You (the applicant)

---

**A1 — Applicant type**

*"Are you applying for yourself, or on behalf of a child?"*

| Answer | Variable set |
|---|---|
| For myself (I'm 18 or over) | `applicant_type = ADULT` |
| On behalf of a child (under 18) | `applicant_type = MINOR` |

---

**A2 — [If MINOR] Who is making this application?**

*"What is your relationship to the child?"*

| Answer | Variable set |
|---|---|
| I am the child's parent | `guardian_type = PARENT` |
| I am the child's legal guardian (not the parent) | `guardian_type = NON_PARENT_GUARDIAN` |

---

**A3 — Are you currently married or in a civil partnership?**

*"Are you currently married or in a civil partnership?"*

| Answer | Variable set |
|---|---|
| Yes | `applicant_married = TRUE` |
| No | `applicant_married = FALSE` |
| Previously but divorced/widowed | `applicant_prev_married = TRUE` |

> **Note:** Even if previously married and now divorced, a marriage cert may still be needed to bridge a name change. Capture this.

---

**A4 — Have you changed your name since birth (other than by marriage)?**

*"Have you legally changed your name since birth, other than through marriage?"*

| Answer | Variable set |
|---|---|
| Yes | `applicant_name_change = TRUE` |
| No | `applicant_name_change = FALSE` |

---

**A5 — Where were you born?**

*"Which country were you born in?"*

Options (determine which GRO link to surface in checklist):

| Answer | Variable set |
|---|---|
| Republic of Ireland | `applicant_birth_country = ROI` |
| Northern Ireland | `applicant_birth_country = NI` |
| England or Wales | `applicant_birth_country = EW` |
| Scotland | `applicant_birth_country = SCO` |
| USA | `applicant_birth_country = USA` |
| Australia | `applicant_birth_country = AUS` |
| Canada | `applicant_birth_country = CAN` |
| Other | `applicant_birth_country = OTHER` |

---

**A6 — Is your birth certificate in English or Irish?**

*"Is your birth certificate in English or Irish?"*

| Answer | Variable set |
|---|---|
| Yes, it's in English or Irish | `applicant_cert_translation = FALSE` |
| No, it's in another language | `applicant_cert_translation = TRUE` |

---

### Section B — About Your Irish Citizen Parent

---

**B1 — Is your parent alive?**

*"Is your [mother/father] currently alive?"*

| Answer | Variable set |
|---|---|
| Yes | `parent_alive = TRUE` |
| No | `parent_alive = FALSE` |

---

**B2 — Was your parent ever married?**

*"Was your [parent] ever married or in a civil partnership?"*

| Answer | Variable set |
|---|---|
| Yes, once | `parent_married = TRUE`, `parent_marriage_count = 1` |
| Yes, more than once | `parent_married = TRUE`, `parent_marriage_count = MULTIPLE` |
| No | `parent_married = FALSE` |

---

**B3 — Has your parent ever changed their name other than by marriage?**

*"Has your [parent] legally changed their name, other than through marriage?"*

| Answer | Variable set |
|---|---|
| Yes | `parent_name_change = TRUE` |
| No | `parent_name_change = FALSE` |

---

**B4 — Where was your parent born?**

*"Which country was your [parent] born in?"*

Same options as A5. Variable: `parent_birth_country`

---

**B5 — Is your parent's birth certificate in English or Irish?**

| Answer | Variable set |
|---|---|
| Yes | `parent_cert_translation = FALSE` |
| No | `parent_cert_translation = TRUE` |

---

**B6 — [ROUTE_B_FBR only] Does your parent have their FBR certificate?**

*"Does your parent have their Foreign Birth Registration Certificate?"*

| Answer | Variable set |
|---|---|
| Yes | `parent_fbr_cert_available = TRUE` |
| No — it's been lost or stolen | `parent_fbr_cert_available = FALSE` |
| I'm not sure | `parent_fbr_cert_available = UNKNOWN` |

> If FALSE or UNKNOWN: show note that a replacement can be ordered at [fbrcertreplacements.dfa.ie](https://fbrcertreplacements.dfa.ie/) before flagging it in the checklist.

---

### Section C — About Your Irish-Born Grandparent (ROUTE_A only)

---

**C1 — Which grandparent was born in Ireland?**

*"Which grandparent was born on the island of Ireland?"*

| Answer | Variable set |
|---|---|
| My mother's mother | `grandparent_line = MATERNAL_GRANDMOTHER` |
| My mother's father | `grandparent_line = MATERNAL_GRANDFATHER` |
| My father's mother | `grandparent_line = PATERNAL_GRANDMOTHER` |
| My father's father | `grandparent_line = PATERNAL_GRANDFATHER` |
| More than one | `grandparent_line = MULTIPLE` (use one chain — simplest) |

---

**C2 — Was the grandparent born in the Republic of Ireland or Northern Ireland?**

*"Was your grandparent born in the Republic of Ireland or Northern Ireland?"*

| Answer | Variable set |
|---|---|
| Republic of Ireland | `grandparent_birth_country = ROI` |
| Northern Ireland | `grandparent_birth_country = NI` |
| Not sure | `grandparent_birth_country = UNKNOWN` |

> If UNKNOWN: show note that both GRO Ireland and GRONI can be searched; link both.

---

**C3 — Is your grandparent alive?**

*"Is your grandparent currently alive?"*

| Answer | Variable set |
|---|---|
| Yes | `grandparent_alive = TRUE` |
| No | `grandparent_alive = FALSE` |

---

**C4 — Was your grandparent ever married?**

*"Was your grandparent ever married or in a civil partnership?"*

| Answer | Variable set |
|---|---|
| Yes, once | `grandparent_married = TRUE`, `grandparent_marriage_count = 1` |
| Yes, more than once | `grandparent_married = TRUE`, `grandparent_marriage_count = MULTIPLE` |
| No | `grandparent_married = FALSE` |

---

**C5 — Has your grandparent ever changed their name other than by marriage?**

| Answer | Variable set |
|---|---|
| Yes | `grandparent_name_change = TRUE` |
| No | `grandparent_name_change = FALSE` |

---

**C6 — Is your grandparent's birth certificate in English or Irish?**

| Answer | Variable set |
|---|---|
| Yes | `grandparent_cert_translation = FALSE` |
| No | `grandparent_cert_translation = TRUE` |

---

**C7 — Do you know your grandparent's date of birth?**

*"Roughly when was your grandparent born?"*

| Answer | Variable set |
|---|---|
| Before 1864 | `grandparent_pre_1864 = TRUE` |
| 1864 or later | `grandparent_pre_1864 = FALSE` |
| Not sure | `grandparent_pre_1864 = UNKNOWN` |

> If TRUE or UNKNOWN: flag baptismal certificate option in checklist.

---

### Section D — Access to People and Documents

---

**D1 — Do you have access to all required people?**

*"Are you in contact with all the people whose documents you need?"*

| Answer | Variable set |
|---|---|
| Yes, I can get everything I need | `estrangement_issue = FALSE` |
| No — I'm estranged from or unable to contact someone | `estrangement_issue = TRUE` |

> If TRUE: ask D2.

---

**D2 — [If estranged] Which person can you not contact?**

*"Who are you unable to get documents from?"*

| Answer | Variable set |
|---|---|
| My parent | `estranged_from = PARENT` |
| My grandparent | `estranged_from = GRANDPARENT` |
| Both | `estranged_from = BOTH` |

> Flag affidavit requirement in checklist. Link to [Document Guide Section 17].

---

## Phase 2: Checklist Generation Rules

The following rules define exactly which documents appear on the checklist. Rules are evaluated top to bottom. Multiple rules can add items for the same person.

---

### Group 1: Your Documents (always required)

| # | Rule | Document added | Person | Notes |
|---|---|---|---|---|
| 1.1 | Always | Completed, signed and witnessed application form | You | Link: [fbr.dfa.ie](https://fbr.dfa.ie/) |
| 1.2 | Always | Original long-form civil birth certificate | You | Must show parental details |
| 1.3 | `applicant_married = TRUE` | Original civil marriage certificate | You | All marriages if `marriage_count = MULTIPLE` |
| 1.4 | `applicant_prev_married = TRUE` | Original civil marriage certificate(s) from previous marriage(s) | You | To bridge any name changes |
| 1.5 | `applicant_name_change = TRUE` | Change of name document (deed poll / statutory declaration) | You | — |
| 1.6 | Always | Certified photocopy of current photo ID | You | Certified by your witness |
| 1.7 | Always | 2 separate original proofs of address | You | Originals only, not photocopies |
| 1.8 | Always | 4 passport-sized colour photographs | You | 2 must be witnessed |
| 1.9 | `applicant_cert_translation = TRUE` | Certified translation of your birth certificate | You | — |
| 1.10 | `applicant_married = TRUE` AND `applicant_cert_translation = TRUE` | Certified translation of your marriage certificate | You | — |

---

### Group 2: Your Irish Citizen Parent's Documents (always required)

| # | Rule | Document added | Person | Notes |
|---|---|---|---|---|
| 2.1 | Always | Original long-form civil birth certificate | Irish citizen parent | Must show parental details |
| 2.2 | `parent_married = TRUE` | Original civil marriage certificate | Irish citizen parent | All if `parent_marriage_count = MULTIPLE`. Do NOT skip even if no name change. |
| 2.3 | `parent_name_change = TRUE` | Change of name document | Irish citizen parent | — |
| 2.4 | `parent_alive = TRUE` | Certified photocopy of current photo ID | Irish citizen parent | Certified by a professional from the witness list |
| 2.5 | `parent_alive = FALSE` | Original civil death certificate | Irish citizen parent | Replaces photo ID |
| 2.6 | `parent_cert_translation = TRUE` | Certified translation of parent's birth certificate | Irish citizen parent | — |

---

### Group 3: Route-Specific Parent Documents

| # | Rule | Document added | Person | Notes |
|---|---|---|---|---|
| 3.1 | `route = ROUTE_B_FBR` | Original Foreign Birth Registration Certificate | Irish citizen parent | If lost: [fbrcertreplacements.dfa.ie](https://fbrcertreplacements.dfa.ie/) |
| 3.2 | `route = ROUTE_B_NATURALISATION` | Original Irish Naturalisation Certificate | Irish citizen parent | If lost: contact [INIS](https://www.irishimmigration.ie/) |
| 3.3 | `route = ROUTE_B_POSTNUPTIAL` | Original Post-Nuptial Citizenship Certificate | Irish citizen parent | If lost: contact DFA |
| 3.4 | `route = ROUTE_B_ADOPTION` | Original adoption certificate and adoption order | Irish citizen parent | Issued by central adoption authority of the country where adoption took place |
| 3.5 | `route = ROUTE_B_ADOPTION` | Original proof of Irish citizenship at date of adoption | Irish citizen parent | E.g. passport, FBR cert, or naturalisation cert held at time of adoption |

---

### Group 4: Your Irish-Born Grandparent's Documents (ROUTE_A only)

| # | Rule | Document added | Person | Notes |
|---|---|---|---|---|
| 4.1 | `route = ROUTE_A` AND `grandparent_pre_1864 = FALSE` | Original long-form civil birth certificate | Irish-born grandparent | Must show parental details |
| 4.2 | `route = ROUTE_A` AND `grandparent_pre_1864 = TRUE` | Baptismal certificate | Irish-born grandparent | Civil registration didn't exist before 1864. Include cover note explaining this. |
| 4.3 | `route = ROUTE_A` AND `grandparent_pre_1864 = UNKNOWN` | Original long-form civil birth certificate **or** baptismal certificate | Irish-born grandparent | Show both options; user to determine which applies |
| 4.4 | `route = ROUTE_A` AND `grandparent_married = TRUE` | Original civil marriage certificate | Irish-born grandparent | All if `grandparent_marriage_count = MULTIPLE`. Do NOT skip even if no name change. |
| 4.5 | `route = ROUTE_A` AND `grandparent_name_change = TRUE` | Change of name document | Irish-born grandparent | — |
| 4.6 | `route = ROUTE_A` AND `grandparent_alive = TRUE` | Certified photocopy of current photo ID | Irish-born grandparent | Certified by a professional from the witness list |
| 4.7 | `route = ROUTE_A` AND `grandparent_alive = FALSE` | Original civil death certificate | Irish-born grandparent | Replaces photo ID |
| 4.8 | `route = ROUTE_A` AND `grandparent_cert_translation = TRUE` | Certified translation of grandparent's birth certificate | Irish-born grandparent | — |

---

### Group 5: Minor Applicant Additional Documents

| # | Rule | Document added | Person | Notes |
|---|---|---|---|---|
| 5.1 | `applicant_type = MINOR` | Letter from school, GP, or relevant source on headed paper including child's address | Child | No standard form — any official headed paper |
| 5.2 | `applicant_type = MINOR` | 4 passport photos of the child (2 witnessed) | Child | In addition to the 4 photos of the parent/guardian |
| 5.3 | `applicant_type = MINOR` | 4 passport photos of the parent/guardian (2 witnessed) | Parent/guardian | — |
| 5.4 | `applicant_type = MINOR` | 2 separate original proofs of address | Parent/guardian | For the parent/guardian, not the child |
| 5.5 | `applicant_type = MINOR` AND `guardian_type = NON_PARENT_GUARDIAN` | Proof of guardianship / parental responsibility | Guardian | Court order, guardianship certificate, or equivalent |

---

### Group 6: Estrangement / Missing Documents

| # | Rule | Document added | Person | Notes |
|---|---|---|---|---|
| 6.1 | `estrangement_issue = TRUE` | Signed affidavit / statutory declaration explaining estrangement and inability to obtain required document | You | Must explain the situation fully. Include in original application proactively. |

---

### Group 7: Warnings and Flags (not documents — shown as alerts on checklist)

| # | Rule | Alert shown |
|---|---|---|
| 7.1 | `parent_married = TRUE` AND any answer suggests it might be skipped | ⚠️ **Marriage certificates are required even if there was no name change.** The DFA website says "if applicable" — this is misleading. If your parent was married, include the certificate. Skipping it is the most common cause of 3–6 month delays. |
| 7.2 | `grandparent_married = TRUE` | ⚠️ Same as 7.1 — grandparent's marriage cert is required if they were married. |
| 7.3 | `applicant_birth_country = USA` | ℹ️ **US applicants:** Order certificates from your local city/county clerk first, not VitalChek. Always request "long form with parental details." See shipping guide for how to send documents to Ireland. |
| 7.4 | `route = ROUTE_B_FBR` AND `parent_fbr_cert_available = FALSE` | ⚠️ **Your parent's FBR certificate is required and appears to be lost.** Order a replacement at [fbrcertreplacements.dfa.ie](https://fbrcertreplacements.dfa.ie/) — note there is currently a backlog for replacements, so do this as early as possible. |
| 7.5 | `grandparent_pre_1864 = TRUE` | ℹ️ **Your grandparent was born before civil registration began in Ireland (1864).** A baptismal certificate is accepted in this case. Include a note with your application explaining this. |
| 7.6 | `estrangement_issue = TRUE` | ℹ️ **Estrangement from a required person doesn't make you ineligible.** Include a signed affidavit with your application explaining the situation. Community experience confirms the DFA does accept this — see the guidance. |
| 7.7 | Always | ℹ️ **"Original" means a fresh certified copy from the registry — not an old family document.** Order new official copies for anything you'd hate to lose. |
| 7.8 | `applicant_type = ADULT` | ℹ️ **Do not include a passport application in the same envelope.** They are processed in different offices and your whole package will be returned. |

---

## Phase 3: Checklist Output Format

Each checklist item should display:

```
[ ] Document name
    For: [person — You / Your parent / Your grandparent]
    Why: [one-line explanation of why it's needed]
    How to get it: [country-specific link or instruction]
    ⚠️ [any relevant warning, if applicable]
```

**Example item — grandparent's marriage certificate:**
```
[ ] Original civil marriage certificate
    For: Your grandparent (Irish-born)
    Why: Required for all married persons in the chain, regardless of name change.
    How to get it: [GRO Ireland →] or [GRONI →] depending on where they married
    ⚠️ This is required even if your grandparent's name didn't change. 
       Not including it typically causes a 3–6 month delay.
```

**Example item — translation:**
```
[ ] Certified translation of your birth certificate
    For: You
    Why: The DFA only accepts documents in English or Irish.
    How to get it: [Find a certified translator →]
```

---

## How-To-Get Links by Document Type and Country

Used to populate the "How to get it" field dynamically based on `*_birth_country` and `*_marriage_country` variables.

| Document | Country | Link |
|---|---|---|
| Birth certificate | ROI | [irishgenealogy.ie](https://www.irishgenealogy.ie/) / [groireland.ie](https://www.groireland.ie/) |
| Birth certificate | NI | [nidirect.gov.uk — GRONI](https://www.nidirect.gov.uk/articles/general-register-office) |
| Birth certificate | Scotland | [mygov.scot](https://www.mygov.scot/order-a-birth-certificate) |
| Birth certificate | England/Wales | [gro.gov.uk](https://www.gro.gov.uk/gro/content/certificates/login.asp) |
| Birth certificate | USA | [vitalchek.com](https://www.vitalchek.com/) (or local county clerk — recommended first) |
| Birth certificate | Australia | State BDM office (e.g. [NSW](https://www.nsw.gov.au/topics/births-deaths-marriages-and-civil-partnerships/births)) |
| Birth certificate | Canada | Provincial vital statistics office |
| Birth certificate | Other | Contact the national civil registration authority of the country |
| Marriage certificate | ROI | [irishgenealogy.ie](https://www.irishgenealogy.ie/) / [HSE](https://www2.hse.ie/services/births-deaths-and-marriages/get-certificates/marriage-certificates/) |
| Marriage certificate | NI | [nidirect.gov.uk — GRONI](https://www.nidirect.gov.uk/articles/general-register-office) |
| Marriage certificate | Scotland | [mygov.scot](https://www.mygov.scot/order-a-marriage-certificate) |
| Marriage certificate | England/Wales | [gro.gov.uk](https://www.gro.gov.uk/gro/content/certificates/login.asp) |
| Marriage certificate | USA | Local county clerk where marriage was registered |
| Death certificate | ROI | [irishgenealogy.ie](https://www.irishgenealogy.ie/) / [HSE](https://www2.hse.ie/services/births-deaths-and-marriages/get-certificates/death-certificates/) |
| Death certificate | NI | [nidirect.gov.uk — GRONI](https://www.nidirect.gov.uk/articles/general-register-office) |
| Death certificate | Scotland | [mygov.scot](https://www.mygov.scot/order-a-death-certificate) |
| Death certificate | England/Wales | [gro.gov.uk](https://www.gro.gov.uk/gro/content/certificates/login.asp) |
| Death certificate | USA | State vital records office / [vitalchek.com](https://www.vitalchek.com/) |
| Baptismal cert | ROI | [NLI Catholic Parish Registers](https://registers.nli.ie/) / [irishgenealogy.ie](https://www.irishgenealogy.ie/) |
| Baptismal cert | NI | [PRONI](https://www.nidirect.gov.uk/proni) |
| FBR cert (replacement) | — | [fbrcertreplacements.dfa.ie](https://fbrcertreplacements.dfa.ie/) |
| Naturalisation cert (replacement) | — | [INIS — irishimmigration.ie](https://www.irishimmigration.ie/) |
| Certified translation | — | [ITI directory](https://www.iti.org.uk/discover/find-a-language-professional.html) / [ATA directory](https://www.atanet.org/directory/) |
| Affidavit (sworn) | Ireland | [Law Society solicitor finder](https://www.lawsociety.ie/Find-a-Solicitor/) |
| Affidavit (sworn) | UK | [Law Society solicitor finder (E&W)](https://solicitors.lawsociety.org.uk/) |
| Affidavit (sworn) | USA | Local notary public (banks, UPS Store, libraries) |
| Witness help | Everywhere | [Irish cultural centres](https://www.irishcentres.com/) |

---

## Completeness Check

Before the user finishes, run these validation checks and surface any gaps:

| Check | Error shown if failed |
|---|---|
| At least one birth cert per person in chain | "You haven't confirmed a birth certificate for [person] — this is always required." |
| Marriage cert for any married person | "Your [parent/grandparent] appears to have been married — their marriage certificate is required. This is one of the most common reasons applications are delayed." |
| Photo ID or death cert for all living/deceased relatives | "You'll need either a photo ID copy or death certificate for [person]." |
| Signed application form included | "Don't forget to include the completed, signed and witnessed application form from fbr.dfa.ie." |
| Translations flagged | "One or more documents are in a non-English/Irish language — certified translations are required for each." |

---

## Summary Counts

At the top of the final checklist, show:

- **Total documents:** [n]
- **For you:** [n]
- **For your parent:** [n]
- **For your grandparent:** [n] *(Route A only)*
- **⚠️ Warnings to review:** [n]

---

## Notes for Development

- All checklist state should be serialisable so users can save progress and return
- "How to get it" links should be surfaced **in context** (when the user taps a checklist item), not buried in a separate reference section
- Warnings (Group 7) should appear inline on relevant checklist items, not just at the top
- Consider a "documents received" toggle so users can track what they've gathered vs. what's still outstanding
- The marriage certificate warning (7.1 and 7.2) is the single most impactful thing in the app — make it prominent and impossible to ignore
