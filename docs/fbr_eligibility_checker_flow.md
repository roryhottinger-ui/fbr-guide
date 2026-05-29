# FBR Eligibility Checker — Flow Specification

**Purpose:** Question-by-question spec for building the eligibility checker. Covers all routing logic, UX copy, help text, and outcome states.

**How to read this doc:**
- Each question has an ID (Q1, Q2 etc.)
- Each answer routes to either the next question or an OUTCOME
- OUTCOMES are terminal states — the checker ends here
- Help text appears as an expandable tooltip or info drawer
- Progress: show a progress bar (approximate steps remaining)

---

## Flow Overview

```
Q1 (born in Ireland?)
├─ Yes → OUTCOME: AUTO_CITIZEN_BIRTH
└─ No → Q2

Q2 (parent born in Ireland?)
├─ Yes → OUTCOME: AUTO_CITIZEN_PARENT
└─ No → Q3

Q3 (grandparent born in Ireland?)
├─ Yes → ELIGIBLE: ROUTE_A
└─ No → Q4

Q4 (is a parent an Irish citizen?)
├─ Yes → Q5
├─ Not sure → Q4b
└─ No → OUTCOME: NOT_ELIGIBLE

Q4b (parent's parent born in Ireland?)
├─ Yes → explain parent is auto citizen → Q5
└─ No → OUTCOME: NOT_ELIGIBLE

Q5 (was parent a citizen BEFORE you were born?)
├─ Yes → Q6
└─ No → OUTCOME: NOT_ELIGIBLE_TIMING

Q6 (how did parent become Irish?)
├─ FBR → ELIGIBLE: ROUTE_B_FBR
├─ Naturalisation → ELIGIBLE: ROUTE_B_NATURALISATION
├─ Post-Nuptial → ELIGIBLE: ROUTE_B_POSTNUPTIAL
├─ Adoption → ELIGIBLE: ROUTE_B_ADOPTION
└─ Not sure → Q6b
```

---

## Questions

---

### Q1 — Were you born on the island of Ireland?

**Question text:**  
*"Were you born on the island of Ireland?"*

**Subtitle / context:**  
*"This includes both the Republic of Ireland and Northern Ireland."*

**Answer options:**
| Option | Label | Routes to |
|---|---|---|
| A | Yes | OUTCOME: AUTO_CITIZEN_BIRTH |
| B | No | Q2 |

**Help text (expandable):**
> The island of Ireland includes the Republic of Ireland and all 32 counties — including the six counties of Northern Ireland (Antrim, Armagh, Down, Fermanagh, Derry/Londonderry, Tyrone). Being born anywhere on the island counts.

---

### Q2 — Was either of your parents born on the island of Ireland?

**Question text:**  
*"Was either of your parents born on the island of Ireland?"*

**Answer options:**
| Option | Label | Routes to |
|---|---|---|
| A | Yes | OUTCOME: AUTO_CITIZEN_PARENT |
| B | No | Q3 |
| C | I'm not sure | Q2_HELP (inline help, then re-ask) |

**Help text (expandable):**
> If either parent was born anywhere in Ireland — Republic or Northern Ireland — you are automatically an Irish citizen from birth, regardless of where you were born. You don't need FBR; you can apply directly for an Irish passport. If you're unsure where your parents were born, check birth certificates or ask family members.

---

### Q3 — Was either of your grandparents born on the island of Ireland?

**Question text:**  
*"Was either of your grandparents born on the island of Ireland?"*

**Subtitle:**  
*"This means your mother's or father's parents."*

**Answer options:**
| Option | Label | Routes to |
|---|---|---|
| A | Yes | ELIGIBLE: ROUTE_A |
| B | No | Q4 |
| C | I'm not sure | Q3_HELP (inline help, then re-ask) |

**Help text (expandable):**
> You have four grandparents. If any one of them was born on the island of Ireland (Republic or Northern Ireland), you qualify for this route — known as the grandparent route. If you're unsure, try checking family records, old documents, or genealogy sites like [irishgenealogy.ie](https://www.irishgenealogy.ie/) or [FamilySearch](https://www.familysearch.org/).

---

### Q4 — Is either of your parents an Irish citizen?

**Question text:**  
*"Is either of your parents an Irish citizen?"*

**Subtitle:**  
*"Even if they've never had an Irish passport, they may still be a citizen."*

**Answer options:**
| Option | Label | Routes to |
|---|---|---|
| A | Yes | Q5 |
| B | No | OUTCOME: NOT_ELIGIBLE |
| C | I'm not sure | Q4b |

**Help text (expandable):**
> Irish citizenship doesn't require a passport. Your parent may be an Irish citizen without ever having claimed it. This is most common when a grandparent was born in Ireland — your parent became a citizen automatically at birth even if they've never done anything about it. If your parent's parent (your grandparent) was born in Ireland, select "I'm not sure" and we'll check.

---

### Q4b — Was your parent's parent (your grandparent) born in Ireland?

**Question text:**  
*"Was one of your parent's parents born on the island of Ireland?"*

**Subtitle:**  
*"In other words — do you have an Irish-born great-grandparent?"*

**Answer options:**
| Option | Label | Routes to |
|---|---|---|
| A | Yes | Q4b_EXPLAIN → Q5 |
| B | No | OUTCOME: NOT_ELIGIBLE |

**Q4b_EXPLAIN (shown before routing to Q5):**
> If your parent's parent was born in Ireland, your parent is automatically an Irish citizen — even if they don't have an Irish passport and have never applied for one. That means you may be eligible. We'll continue to check.

---

### Q5 — Was your parent an Irish citizen before you were born?

**Question text:**  
*"Was your parent an Irish citizen at the time you were born?"*

**Subtitle:**  
*"The timing matters — they need to have been a citizen before your birth, not after."*

**Answer options:**
| Option | Label | Routes to |
|---|---|---|
| A | Yes | Q6 |
| B | No | OUTCOME: NOT_ELIGIBLE_TIMING |
| C | I'm not sure | Q5_HELP (inline help, then re-ask) |

**Help text (expandable):**
> There are two ways your parent could have been a citizen before your birth:
> 1. **Automatically** — if their own parent (your grandparent) was born in Ireland, they were a citizen from their own birth. Since this predates your birth, you're eligible.
> 2. **By registration** — if they themselves registered on the Foreign Births Register (FBR) before you were born.
> If your parent only registered on the FBR *after* you were born, you are unfortunately not eligible through them — the registration must predate your birth.

---

### Q6 — How did your parent become an Irish citizen?

**Question text:**  
*"How did your parent become an Irish citizen?"*

**Subtitle:**  
*"This affects which documents you'll need."*

**Answer options:**
| Option | Label | Routes to |
|---|---|---|
| A | Their parent (your grandparent) was born in Ireland — they were a citizen by birth | ELIGIBLE: ROUTE_B_FBR |
| B | They registered on the Foreign Births Register (FBR) | ELIGIBLE: ROUTE_B_FBR |
| C | They were naturalised as an Irish citizen | ELIGIBLE: ROUTE_B_NATURALISATION |
| D | They made a Post-Nuptial Citizenship Declaration | ELIGIBLE: ROUTE_B_POSTNUPTIAL |
| E | They were adopted by an Irish citizen | ELIGIBLE: ROUTE_B_ADOPTION |
| F | I'm not sure | Q6b |

**Help text (expandable):**
> - **Grandparent born in Ireland / FBR:** Your parent's Irish citizenship comes from their own Irish-born parent. They may or may not have an Irish passport, but they are a citizen.
> - **Naturalised:** They applied to become Irish after living in Ireland for a number of years. They will have a Naturalisation Certificate.
> - **Post-Nuptial Declaration:** An older route, no longer available for new applicants, where a foreign national married an Irish citizen and then declared Irish citizenship.
> - **Adopted:** They were born abroad and adopted by an Irish citizen.
> - **Not sure:** We'll ask a couple more questions to figure it out.

---

### Q6b — Does your parent have any of these documents?

**Question text:**  
*"Does your parent have any of the following documents?"*

**Answer options (multi-select, pick first that applies):**
| Option | Label | Routes to |
|---|---|---|
| A | An Irish passport or Irish passport card | ELIGIBLE: ROUTE_B_FBR (note: may be any route, passport confirms citizenship) |
| B | A Foreign Birth Registration Certificate | ELIGIBLE: ROUTE_B_FBR |
| C | An Irish Naturalisation Certificate | ELIGIBLE: ROUTE_B_NATURALISATION |
| D | A Post-Nuptial Citizenship Certificate | ELIGIBLE: ROUTE_B_POSTNUPTIAL |
| E | None of these / I don't know | OUTCOME: NOT_ELIGIBLE_UNCLEAR |

---

## Outcomes

---

### OUTCOME: AUTO_CITIZEN_BIRTH

**Headline:** 🎉 You're already an Irish citizen!

**Body:**
> You were born on the island of Ireland, which means you are already an Irish citizen by birth. You don't need to go through the Foreign Births Register.
>
> You can apply directly for an Irish passport.

**CTA:** [How to apply for an Irish passport →](https://www.ireland.ie/en/dfa/passports/passport-online/)

**Note for app:** Consider offering a passport checklist as a next step.

---

### OUTCOME: AUTO_CITIZEN_PARENT

**Headline:** 🎉 You're already an Irish citizen!

**Body:**
> Because one of your parents was born on the island of Ireland, you are automatically an Irish citizen — regardless of where you were born. You don't need to go through the Foreign Births Register.
>
> You can apply directly for an Irish passport.

**CTA:** [How to apply for an Irish passport →](https://www.ireland.ie/en/dfa/passports/passport-online/)

---

### ELIGIBLE: ROUTE_A

**Headline:** ✅ You're eligible for Foreign Birth Registration

**Body:**
> Because one of your grandparents was born on the island of Ireland, you can apply to be entered on the Foreign Births Register. Once registered, you'll be an Irish citizen and can apply for an Irish passport.
>
> This is the **grandparent route** (the most common route).
>
> **What happens next:** We'll build your personalised document checklist based on your specific circumstances.

**Route tag stored:** `ROUTE_A`

**CTA:** [Build my document checklist →] (routes to Document Checklist Flow)

---

### ELIGIBLE: ROUTE_B_FBR

**Headline:** ✅ You're eligible for Foreign Birth Registration

**Body:**
> Because one of your parents is an Irish citizen — through their own Irish-born parent — you can apply to be entered on the Foreign Births Register. Once registered, you'll be an Irish citizen and can apply for an Irish passport.
>
> **What happens next:** We'll build your personalised document checklist based on your specific circumstances.

**Route tag stored:** `ROUTE_B_FBR`

**Important note shown:**
> ⚠️ Your parent must have been an Irish citizen *before* you were born for this to work. If your grandparent was born in Ireland, your parent was a citizen from their own birth — so this timing condition is automatically met.

**CTA:** [Build my document checklist →]

---

### ELIGIBLE: ROUTE_B_NATURALISATION

**Headline:** ✅ You're eligible for Foreign Birth Registration

**Body:**
> Because one of your parents became an Irish citizen through naturalisation before you were born, you can apply to be entered on the Foreign Births Register.
>
> **You'll need** your parent's original Irish Naturalisation Certificate as part of your application.

**Route tag stored:** `ROUTE_B_NATURALISATION`

**CTA:** [Build my document checklist →]

---

### ELIGIBLE: ROUTE_B_POSTNUPTIAL

**Headline:** ✅ You're eligible for Foreign Birth Registration

**Body:**
> Because one of your parents became an Irish citizen through a Post-Nuptial Citizenship Declaration before you were born, you can apply to be entered on the Foreign Births Register.
>
> **You'll need** your parent's original Post-Nuptial Citizenship Certificate as part of your application.

**Route tag stored:** `ROUTE_B_POSTNUPTIAL`

**CTA:** [Build my document checklist →]

---

### ELIGIBLE: ROUTE_B_ADOPTION

**Headline:** ✅ You may be eligible — but this route needs careful checking

**Body:**
> Your situation involves adoption, which adds some complexity. You may still be eligible, but the rules depend on whether the adoption is recognised under Irish law.
>
> We recommend contacting the DFA directly before proceeding to ensure you're on the right track.

**Contact info shown:**
> 📞 DFA Customer Service Hub: +353 1 568 3331 (Mon–Fri 9am–4:30pm)  
> 💬 [WebChat on ireland.ie](https://www.ireland.ie/en/dfa/citizenship/born-abroad/registering-a-foreign-birth/#Contact%20Foreign%20Birth%20Registration)

**Route tag stored:** `ROUTE_B_ADOPTION`

**CTA:** [Build my document checklist anyway →] *(with disclaimer that adoption cases need DFA confirmation)*

---

### OUTCOME: NOT_ELIGIBLE

**Headline:** ❌ Unfortunately you're not eligible through this route

**Body:**
> Based on what you've told us, you don't qualify for Irish citizenship through the Foreign Births Register. FBR requires either:
> - A grandparent born on the island of Ireland, or
> - A parent who was an Irish citizen at the time of your birth
>
> Neither of these applies in your case.

**Softener / alternatives shown:**
> **Other routes to Irish citizenship exist:**
> - [Naturalisation](https://www.irishimmigration.ie/how-to-become-a-citizen/) — if you have lived legally in Ireland for 5 years
> - [Association with Ireland](https://www.irishimmigration.ie/how-to-become-a-citizen/) — for those with strong Irish connections
>
> A DNA test showing Irish ancestry does not create eligibility.

---

### OUTCOME: NOT_ELIGIBLE_TIMING

**Headline:** ❌ Unfortunately you're not eligible through this route

**Body:**
> For you to claim citizenship through a parent, that parent needed to be an Irish citizen *before you were born*.
>
> If your parent only became an Irish citizen after you were born — for example, by registering on the FBR after your birth — this unfortunately doesn't pass citizenship to you.

**Softener / alternatives shown:**
> **However:** If your parent registers on the FBR *now*, any children they have *in the future* would be eligible. If you are planning to have children, this is worth considering.
>
> **Other routes:** [Naturalisation](https://www.irishimmigration.ie/how-to-become-a-citizen/) may be an option if you have lived in Ireland for 5 years.

---

### OUTCOME: NOT_ELIGIBLE_UNCLEAR

**Headline:** ⚠️ We can't confirm your eligibility

**Body:**
> Based on your answers, we can't confirm whether you're eligible. This usually means more information is needed about how your parent became (or didn't become) an Irish citizen.
>
> We recommend contacting the DFA directly — they can tell you definitively whether you qualify.

**Contact info shown:**
> 📞 DFA Customer Service Hub: +353 1 568 3331 (Mon–Fri 9am–4:30pm)  
> 💬 [WebChat on ireland.ie](https://www.ireland.ie/en/dfa/citizenship/born-abroad/registering-a-foreign-birth/#Contact%20Foreign%20Birth%20Registration)

---

## UI/UX Notes

**Progress bar:** Show approximate step count. Eligibility check is 3–6 questions depending on route. Don't show exact step numbers — use a soft progress bar only.

**Back button:** Always allow the user to go back and change answers. Store answers in state so changing Q3 re-routes correctly.

**Save state:** Store eligibility result and route tag in app state — the document checklist flow reads this to pre-populate.

**Tone:** Warm and direct. Not bureaucratic. Avoid phrases like "you may wish to consider" — be clear. Use "you" throughout.

**Not sure options:** Always include a "not sure" option for questions where people commonly get stuck. Don't let the checker dead-end — always route somewhere useful even on uncertainty.

**Mobile-first:** These are single-question screens, not a form. One question per screen, large touch targets for answers.
