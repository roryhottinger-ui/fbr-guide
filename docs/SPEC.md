# FBR Guide App — Build Specification

**For:** Claude Code  
**Project:** A mobile app guiding users through Irish Foreign Birth Registration (FBR) — eligibility checking and dynamic document checklist generation.  
**Platforms:** iOS and Android (single codebase)  
**Last updated:** May 2026

---

## 0. Read These First

This spec references four context documents that contain all domain knowledge. **Read them before starting** — they are the source of truth for all FBR logic. Place them in `/docs` in the repo.

| File | Contains | Use for |
|---|---|---|
| `docs/irish_fbr_context_document.md` | Full FBR knowledge base — eligibility, process, timelines, fees, gotchas, community experience | Static content screens, FAQ, info text |
| `docs/irish_fbr_document_guide.md` | 17 document types, how to obtain each by country, all links | "How to get this document" detail content |
| `docs/fbr_eligibility_checker_flow.md` | Complete eligibility question flow — routing, copy, outcomes | Building the eligibility checker (Phase 3) |
| `docs/fbr_document_checklist_rules.md` | Rules engine — context questions + conditional document generation logic | Building the checklist engine (Phase 4) |

There is also a working UI prototype: `docs/fbr_app_mockup_v3.jsx`. It is a single-file React web mockup demonstrating the eligibility flow, checklist questions, dynamic checklist generation, the chain visualiser, the expired-ID blocker, and multi-marriage handling. **Use it as the visual and interaction reference** — the production app should match its look and behaviour, ported to React Native.

---

## 1. What We're Building

A free, offline-first mobile app that:
1. Checks if a user is eligible for Irish citizenship via FBR (a guided question flow)
2. Generates a personalised document checklist based on their specific situation
3. Lets users track which documents they've gathered
4. Provides reference content on how to obtain each document and what to expect

**Out of scope for v1:** the Irish passport application process (FBR only), user accounts/login, cloud sync, payments, the expectant-parent expedited route (flag it, don't build it).

---

## 2. Architecture Decisions (already made — do not deviate without flagging)

- **No backend, no accounts.** All state is local on-device. No personal data leaves the device. This keeps GDPR/privacy simple and App Store review smooth.
- **Offline-first.** The app must fully function with no network connection. External links open in the browser when tapped, but nothing else requires connectivity.
- **OTA content updates via Expo Updates.** FBR rules change (fees, processing times, document lists). All such values must live in a single editable content/config module (`src/content/`) so they can be updated via an OTA push without an App Store release. Do NOT hardcode fees, processing times, or document rules inline in components.
- **Local-only persistence.** Checklist progress and answers persist between sessions via AsyncStorage. If the user deletes the app, data is lost — this is acceptable for v1.

---

## 3. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Expo SDK (latest stable), managed workflow | Do not eject |
| Language | TypeScript (strict mode) | |
| Navigation | Expo Router | File-based routing |
| State | Zustand | One store for app state; keep it simple |
| Persistence | `@react-native-async-storage/async-storage` | Via Zustand persist middleware |
| OTA updates | `expo-updates` | Configure but don't need to wire a release pipeline yet |
| Notifications | `expo-notifications` | Phase 6 only — timeline reminders |
| Linking | `expo-linking` / `Linking` | Open external gov/registry URLs |
| Icons | `@expo/vector-icons` | |
| Build/submit | EAS Build + EAS Submit | Document config; don't run builds |

---

## 4. Project Structure

```
fbr-guide/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout, theme provider
│   ├── index.tsx                 # Home screen
│   ├── eligibility/
│   │   ├── _layout.tsx
│   │   ├── [step].tsx            # Dynamic eligibility question screen
│   │   └── result.tsx            # Eligibility outcome screen
│   ├── checklist/
│   │   ├── questions.tsx         # Context-gathering questions
│   │   └── index.tsx             # Generated checklist + chain view
│   ├── document/
│   │   └── [id].tsx              # Document detail (how to get it)
│   └── info/
│       ├── index.tsx             # Info/FAQ hub
│       └── [topic].tsx           # Individual info articles
├── src/
│   ├── content/                  # ALL editable content (OTA-updatable)
│   │   ├── fees.ts               # Fee amounts
│   │   ├── timelines.ts          # Processing time estimates
│   │   ├── eligibilityFlow.ts    # Eligibility questions + routing
│   │   ├── checklistQuestions.ts # Context questions
│   │   ├── documentRules.ts      # Document generation rules
│   │   ├── documents.ts          # Document definitions + how-to-get links
│   │   └── infoArticles.ts       # FAQ / info content
│   ├── engine/
│   │   ├── eligibility.ts        # Pure function: answers → outcome + route
│   │   └── checklist.ts          # Pure function: answers + route → document[]
│   ├── store/
│   │   └── useAppStore.ts        # Zustand store
│   ├── components/
│   │   ├── QuestionScreen.tsx
│   │   ├── AnswerOption.tsx
│   │   ├── ChecklistItem.tsx
│   │   ├── ChainVisualiser.tsx
│   │   ├── BlockerBanner.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Button.tsx
│   │   └── ...
│   ├── theme/
│   │   └── theme.ts              # Colours, spacing, typography tokens
│   └── types/
│       └── index.ts              # Shared TypeScript types
├── docs/                         # The 4 context docs + mockup (reference)
├── app.json                      # Expo config
└── package.json
```

**Key principle:** the `engine/` functions are pure and unit-testable — they take answers and return outcomes/documents with no side effects. The `content/` modules are pure data. UI components consume both. This separation is what makes OTA content updates and testing possible.

---

## 5. Core Type Definitions

Define these in `src/types/index.ts` early — everything depends on them.

```typescript
// Eligibility
type EligibilityAnswerKey =
  | "born_ireland" | "parent_born_ireland" | "grandparent_born_ireland"
  | "parent_citizen" | "parent_citizen_before_birth" | "parent_route";

type EligibilityOutcome =
  | "AUTO_CITIZEN_BIRTH" | "AUTO_CITIZEN_PARENT"
  | "ELIGIBLE" | "NOT_ELIGIBLE" | "NOT_ELIGIBLE_TIMING" | "NOT_ELIGIBLE_UNCLEAR";

type Route =
  | "ROUTE_A" | "ROUTE_B_FBR" | "ROUTE_B_NATURALISATION"
  | "ROUTE_B_POSTNUPTIAL" | "ROUTE_B_ADOPTION";

// Checklist context answers (per person where relevant)
interface ChecklistAnswers {
  applicant_type: "ADULT" | "MINOR";
  guardian_type?: "PARENT" | "NON_PARENT_GUARDIAN";
  // For each person: alive status, marriages count, name change, ID validity
  gp_alive?: "YES" | "NO";
  gp_id_valid?: "YES" | "NO";
  gp_marriages?: "0" | "1" | "2" | "3+";
  gp_name_change?: "NO" | "YES_DEED" | "YES_ANGL";
  gp_birth_country?: CountryCode;
  gp_pre_1864?: "YES" | "NO" | "UNKNOWN";
  parent_alive?: "YES" | "NO";
  parent_marriages?: "0" | "1" | "2" | "3+";
  parent_name_change?: "NO" | "YES_DEED" | "YES_ANGL";
  parent_birth_country?: CountryCode;
  applicant_marriages?: "0" | "1" | "2" | "3+";
  applicant_name_change?: "NO" | "YES_DEED" | "YES_ANGL";
  applicant_birth_country?: CountryCode;
  estrangement?: "NONE" | "PARENT" | "GRANDPARENT" | "BOTH";
  expecting_child?: "YES" | "NO";
}

type CountryCode = "ROI" | "NI" | "EW" | "SCO" | "USA" | "AUS" | "CAN" | "OTHER";

// A generated checklist item
interface ChecklistItem {
  id: string;
  section: "you" | "parent" | "grandparent";
  doc: string;
  person: string;
  why?: string;
  warning?: string;          // inline amber warning tag
  type?: "normal" | "block"; // block = hard blocker (e.g. expired ID)
  howToGet?: string;          // detail text / link key
  documentDefId?: string;     // links to documents.ts for full detail
}
```

---

## 6. Phased Task List

Work through phases in order. Each task has acceptance criteria. Commit after each task.

---

### PHASE 1 — Project Setup

**Task 1.1 — Initialise Expo project**
- Create Expo app with TypeScript template, Expo Router, strict TS
- Install dependencies: zustand, async-storage, expo-updates, expo-linking, @expo/vector-icons
- ✅ Acceptance: app runs in Expo Go showing a placeholder home screen

**Task 1.2 — Theme system**
- Port the colour/spacing/typography tokens from `fbr_app_mockup_v3.jsx` (the `G` object) into `src/theme/theme.ts`
- Set up font loading (the mockup uses a Palatino-style serif for headings, sans-serif for body — pick a close free equivalent, e.g. a serif like "Lora" or "Source Serif" for headings, system sans for body)
- ✅ Acceptance: a theme object is importable and a test screen renders with correct colours and fonts

**Task 1.3 — Core types**
- Create `src/types/index.ts` per Section 5
- ✅ Acceptance: types compile, no errors

**Task 1.4 — Zustand store**
- Create `useAppStore` with: eligibility answers, eligibility outcome + route, checklist answers, checklist checked-state map
- Wire AsyncStorage persistence via persist middleware
- ✅ Acceptance: state persists across app restarts (verify by setting a value, reloading)

---

### PHASE 2 — Content Layer

**Task 2.1 — Static content modules**
- Create `src/content/fees.ts` (adult €278, minor €153 — pull current values from `irish_fbr_context_document.md` §7)
- Create `src/content/timelines.ts` (processing time ~9–11 months, source the figures from context doc §12 and §21.1)
- ✅ Acceptance: values importable, single source of truth, no hardcoded fees elsewhere

**Task 2.2 — Document definitions**
- Create `src/content/documents.ts`: one entry per document type from `irish_fbr_document_guide.md` (17 types). Each entry: id, name, description, whoNeedsIt, criticalRules, howToGetByCountry (map of CountryCode → instruction + link), commonPitfalls
- ✅ Acceptance: all 17 documents represented; the document guide's country tables are faithfully encoded

**Task 2.3 — Info articles**
- Create `src/content/infoArticles.ts`: structured FAQ/info content from `irish_fbr_context_document.md` (the gotchas §18, community tips §20–21, witness rules, photo rules, etc.)
- ✅ Acceptance: at least the key topics encoded — witnesses, photos, fees, timelines, marriage cert warning, US shipping, estrangement, expired ID

---

### PHASE 3 — Eligibility Checker

**Task 3.1 — Eligibility flow content**
- Create `src/content/eligibilityFlow.ts` encoding the questions, options, help text, and routing from `fbr_eligibility_checker_flow.md`
- ✅ Acceptance: all questions Q1–Q6b and all outcomes represented as data

**Task 3.2 — Eligibility engine**
- Create `src/engine/eligibility.ts`: a pure function taking answers and returning `{ outcome, route }`
- Implement the full routing logic from the flow doc (the flow overview diagram)
- ✅ Acceptance: unit tests cover every path — born in Ireland → AUTO_CITIZEN_BIRTH; grandparent route → ELIGIBLE/ROUTE_A; all not-eligible branches; all Route B variants

**Task 3.3 — Question screen component**
- Build `QuestionScreen` + `AnswerOption` + `ProgressBar` components matching the mockup
- One question per screen, large touch targets, expandable help text, back button, disabled-until-answered Continue button
- ✅ Acceptance: visually matches mockup; back navigation preserves answers

**Task 3.4 — Eligibility flow wiring**
- Wire `app/eligibility/[step].tsx` to step through questions, calling the engine to determine routing
- Build `app/eligibility/result.tsx` for all outcome states (eligible ×5, not eligible ×3) with the copy from the flow doc
- Store outcome + route in Zustand
- ✅ Acceptance: can complete the full flow for all major paths and reach correct outcomes; eligible outcomes offer a CTA to the checklist

---

### PHASE 4 — Document Checklist Engine

**Task 4.1 — Checklist questions content**
- Create `src/content/checklistQuestions.ts` from `fbr_document_checklist_rules.md` Phase 1 (Sections A–D)
- Include conditional visibility (e.g. `gp_id_valid` only shown if `gp_alive === "YES"`; grandparent questions only for ROUTE_A)
- **Important:** marriage questions are "how many times married?" (0/1/2/3+), NOT yes/no. Name-change questions exist for ALL THREE people (you, parent, grandparent), each with no/deed-poll/anglicisation options. See mockup for exact wording.
- ✅ Acceptance: question set matches the rules doc and the mockup, including conditional visibility

**Task 4.2 — Document rules + checklist engine**
- Create `src/content/documentRules.ts` and `src/engine/checklist.ts`
- Implement all rule groups from `fbr_document_checklist_rules.md` Phase 2 (Groups 1–7), plus the multi-marriage and per-person name-change logic demonstrated in the mockup's `buildChecklist`
- Each marriage generates a separate cert line item. Each name change generates a deed-poll or statutory-declaration item. Expired ID generates a `type: "block"` item.
- ✅ Acceptance: unit tests for: 2 marriages → 2 cert items; expired ID → blocker item; deceased relative → death cert not ID; anglicised name → statutory declaration; minor → school letter + extra photos. Reproduce the mockup's three presets exactly.

**Task 4.3 — Checklist questions screen**
- Build `app/checklist/questions.tsx` reusing `QuestionScreen`, reading route from store to show only relevant questions
- ✅ Acceptance: question flow adapts to route (Route A shows grandparent questions; Route B variants don't)

**Task 4.4 — Checklist display screen**
- Build `app/checklist/index.tsx`: grouped by person (you/parent/grandparent), tappable check-off items, progress bar + percentage, "everything gathered" celebration state
- Persist checked-state to store
- ✅ Acceptance: matches mockup; checking items updates progress; state persists across restarts

**Task 4.5 — Marriage cert warning + blocker banner**
- Implement the always-on marriage certificate warning banner (amber) and the conditional expired-ID `BlockerBanner` (red, shown only when a blocker item exists)
- When a blocker exists, the progress bar turns red and shows "⚠ Blocker" instead of percentage
- ✅ Acceptance: both banners match mockup; blocker state correctly reflects presence of a `type: "block"` item

---

### PHASE 5 — Chain Visualiser & Document Detail

**Task 5.1 — Chain visualiser component**
- Port `ChainVisualiser` from the mockup to React Native: renders a per-person chain (birth cert → bridging docs → current ID/death cert), dynamically built from checklist answers for all three people
- Name changes insert nodes (deed poll = ok/green, anglicisation = warn/amber). Each marriage inserts a node. Expired ID renders the terminal node as a red blocker.
- ✅ Acceptance: matches mockup behaviour across all three presets; collapsible via toggle

**Task 5.2 — Document detail screen**
- Build `app/document/[id].tsx`: tapping a checklist item opens full detail from `documents.ts` — what it is, why needed, how to get it for the relevant country (use the person's `*_birth_country` answer to surface the right link), pitfalls
- External links open in browser via Linking
- ✅ Acceptance: every checklist item links to a populated detail screen with a working country-specific external link

---

### PHASE 6 — Info Hub, Notifications, Polish

**Task 6.1 — Info/FAQ hub**
- Build `app/info/` screens rendering `infoArticles.ts`
- ✅ Acceptance: key topics browsable; marriage cert warning, witnesses, photos, fees, timelines, US shipping all present

**Task 6.2 — Home screen**
- Build `app/index.tsx` matching the mockup home: hero, three-step overview, primary CTA (check eligibility) + secondary (skip to checklist), footer note. Resume-in-progress state if the user has saved answers.
- ✅ Acceptance: matches mockup; correctly resumes a partially completed flow

**Task 6.3 — Timeline reminder notifications**
- Using expo-notifications, let a user optionally set a "documents submitted" date, then schedule local reminders (e.g. at 9 months: "It's been 9 months — you can check your status via the DFA webchat")
- ✅ Acceptance: a scheduled local notification fires at the configured offset (test with a short offset)

**Task 6.4 — OTA config**
- Configure expo-updates in app.json so content modules can be updated OTA. Document the release command in README.
- ✅ Acceptance: app.json correctly configured; README explains how to push a content update

**Task 6.5 — Disclaimers & store prep**
- Add a persistent "Not legal advice" disclaimer (onboarding + footer). Write privacy policy text (local-only, no data collected). Prepare app.json metadata, category (Reference/Utilities), and placeholder store assets.
- ✅ Acceptance: disclaimer visible; privacy policy reads accurately (no PII collected); app.json submission-ready

---

## 7. Critical Implementation Notes (do not miss these)

These are the things that make the app actually useful — they emerged from real applicant experience and are detailed in the context docs.

1. **Marriage certificate warning is the #1 feature.** A marriage cert is required for EVERY marriage of EVERY person in the chain, even with no name change. The DFA website's "if applicable" wording misleads people and is the top cause of multi-month delays. The warning must be prominent and unmissable. (Context doc §20.9, §18.1)

2. **"How many times married?" not "married yes/no."** Multiple marriages each need their own certificate. (Mockup `buildChecklist`)

3. **Name changes apply to all three people**, not just the grandparent — you, your parent, and your grandparent each need name-change handling (deed poll OR statutory declaration for anglicisation/informal changes). (This was an explicit correction during design.)

4. **Expired ID is a hard blocker, not a warning.** A living relative's expired passport/ID is not accepted and returns the whole application. Surface it as a red blocker that must be resolved before submitting, with alternatives (renew / driving licence / EU national ID card). (Explicit design decision; context doc §9 notes ID must be current.)

5. **The document chain concept** (birth cert → bridging docs → current ID/death cert, with lineage links between people) is the core mental model. The chain visualiser makes gaps visible. (Design discussion; not in original gov guidance — this is a differentiator.)

6. **Deceased relative → death certificate replaces photo ID.** Never ask a deceased person for ID. (Rules doc Group 2/4)

7. **Pre-1864 Irish births → baptismal certificate** accepted in place of civil birth cert, with a cover note. (Document guide §14)

8. **US applicants need shipping guidance** — registered post, "non-negotiable documents", Eircode K32 AE72, avoid private couriers. Surface this when `applicant_birth_country === "USA"` or generally in the info hub. (Context doc §21.9)

9. **Estrangement is solvable via affidavit**, not a dead end. (Context doc §20.4, §21.7; document guide §17)

10. **Don't mix passport application in the FBR envelope** — whole package gets returned. (Context doc §18.10)

11. **Adoption route → flag for DFA contact**, don't fully automate. (Eligibility flow ELIGIBLE: ROUTE_B_ADOPTION)

---

## 8. Testing Requirements

- Unit tests for both engine functions (`eligibility.ts`, `checklist.ts`) covering every branch and the three mockup presets ("Your scenario", "Simple case", "Complex case")
- The engines are pure functions — test them thoroughly; they encode the entire domain logic
- Snapshot or render tests for the checklist generation given the three presets
- Manual QA checklist: complete each eligibility path; verify each not-eligible outcome; verify blocker behaviour; verify persistence across restarts

---

## 9. Definition of Done (v1)

- A user can check eligibility and reach a correct outcome for all paths
- An eligible user gets a personalised checklist that correctly handles: multiple marriages, name changes for all three people, deceased relatives, expired ID blocker, minor applicants, estrangement, pre-1864 births
- Checklist progress persists locally
- Each document links to country-specific acquisition guidance with working external links
- The chain visualiser renders correctly
- Marriage cert warning and expired-ID blocker are prominent
- Info hub covers the key topics
- App works fully offline
- "Not legal advice" disclaimer present
- Builds for both iOS and Android via EAS (config ready; actual store submission is a separate step)

---

## 9b. Deployment

The project must support **two output targets from one codebase**: a web build (PWA, for the initial Reddit launch) and native iOS/Android builds (via EAS, later). Set both up from the start so nothing needs retrofitting.

**Web / PWA (launch first):**
- Ensure the app runs via `expo start --web` and builds via `npx expo export --platform web`
- Configure it as an installable PWA: web manifest (name, icons, theme colour matching the green theme), and verify it works offline (the app is already offline-first, so this should mostly follow)
- Target deploy host: **Vercel**. Add a short README section: how to build the web output and deploy to Vercel (connect repo, set build command, done). This produces a public URL for the Reddit launch — no app store, no fees, no review.
- ✅ Acceptance: `expo export --platform web` produces a deployable build; app is installable to home screen as a PWA; works offline

**Native (later, via EAS):**
- Configure `eas.json` with `development`, `preview`, and `production` build profiles
- Document in README the commands: `eas build --platform android` / `--platform ios`, and `eas submit`
- Note in README: Google Play first ($25 one-time, faster review), Apple App Store second (€99/year). App category: Reference or Utilities. Privacy: collects no personal data, no backend — privacy policy reflects this.
- Do NOT run any builds or submissions — just configure and document so the owner can run them when ready
- ✅ Acceptance: `eas.json` present with sensible profiles; README documents the build/submit flow in plain language

**Testing during development:**
- Primary loop is Expo Go (scan QR from `expo start`) — document this as the first thing a new developer does
- ✅ Acceptance: README's "Run locally" section gets someone from clone → running on their phone via Expo Go in under 5 minutes

---

## 10. Suggested First Session for Claude Code

1. Read all four docs in `/docs` and skim the mockup
2. Complete Phase 1 entirely (setup, theme, types, store)
3. Complete Task 2.1 (fees/timelines content)
4. Complete Phase 3 Tasks 3.1 and 3.2 (eligibility content + engine) with full unit tests
5. Stop and report — confirm the eligibility engine passes all tests before building UI on top of it

This front-loads the domain logic (the risky part) and validates it with tests before any UI work.
