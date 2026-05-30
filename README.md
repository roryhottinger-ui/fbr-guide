# FBR Guide

A free, offline-first mobile app that guides users through Irish **Foreign Birth Registration (FBR)** — checking eligibility and generating a personalised document checklist.

Built with Expo (SDK 56), TypeScript, Expo Router, and Zustand. iOS, Android, and web (PWA) from one codebase.

- **No backend, no accounts, no tracking.** All state is local on-device via AsyncStorage.
- **Offline-first.** Everything works with no connection; external gov/registry links open in the browser.
- **OTA-updatable content.** All FBR rules, fees, timelines, and document data live in `src/content/` so they can be pushed via Expo Updates without an app-store release.

> ⚠️ **Not legal advice.** This is an informational guide compiled from official DFA guidance, Citizens Information, and community experience. Always verify current requirements at [ireland.ie](https://www.ireland.ie/en/dfa/citizenship/born-abroad/registering-a-foreign-birth/).

---

## Run locally (clone → phone in under 5 minutes)

1. Install [Node.js LTS](https://nodejs.org) and the [Expo Go](https://expo.dev/go) app on your phone.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npx expo start
   ```
4. Scan the QR code with your phone's camera (iOS) or the Expo Go app (Android). The app loads and hot-reloads on save.

Run in a browser instead: `npx expo start --web`.

## Tests

The two engine functions (`src/engine/eligibility.ts`, `src/engine/checklist.ts`) are pure and encode the entire domain logic. They are covered by unit tests, including the three mockup presets.

```bash
npm test          # run all tests (55 tests)
npm run typecheck # tsc --noEmit
```

---

## Project structure

```
app/                     Expo Router screens (file-based routing)
  index.tsx              Home (disclaimer, resume, CTAs)
  eligibility/[step].tsx Dynamic eligibility question screen
  eligibility/result.tsx Outcome screen (all 8 outcomes)
  checklist/questions.tsx Context-gathering questions
  checklist/index.tsx    Generated checklist + chain visualiser
  document/[id].tsx      Document detail (how to get it, by country)
  info/                  Info / FAQ hub
src/
  content/               ALL editable content (OTA-updatable, pure data)
  engine/                Pure, unit-tested logic (eligibility, checklist)
  store/                 Zustand store (+ AsyncStorage persistence)
  components/            Shared UI
  theme/                 Colour / spacing / typography tokens
  types/                 Shared TypeScript types
docs/                    Source-of-truth spec + reference documents
```

**Key principle:** `engine/` functions take answers and return outcomes/documents with no side effects; `content/` is pure data; UI consumes both. This separation is what makes OTA content updates and testing possible.

---

## Deployment

### Web / PWA (launch first — free, no app store)

The app is offline-first and installable to the home screen.

```bash
npx expo export --platform web   # produces ./dist
```

Deploy `./dist` to **Vercel**:
1. Push this repo to GitHub and import it at [vercel.com/new](https://vercel.com/new).
2. Build command: `npx expo export --platform web` · Output directory: `dist`.
3. Deploy. You get a public URL to share (e.g. on Reddit) — no fees, no review.

### Native (later, via EAS)

`eas.json` defines `development`, `preview`, and `production` profiles.

```bash
npm i -g eas-cli && eas login
eas build --platform android      # Google Play first ($25 one-time, faster review)
eas build --platform ios          # Apple App Store second (€99/year)
eas submit --platform android
```

App category: **Reference / Utilities**. Privacy: collects no personal data, no backend.

### OTA content updates (Expo Updates)

Fees, timelines, document rules, and copy live in `src/content/`. To push a content change to installed apps **without** an app-store release:

```bash
eas update --branch production --message "Update FBR fees / timelines"
```

Only JS/content changes can ship via OTA; native config changes require a new build.

---

## Privacy policy

FBR Guide does not collect, transmit, or store any personal data off your device. All answers and checklist progress are saved locally via AsyncStorage and never leave your phone. There is no account, no analytics, and no backend. Deleting the app deletes all data. External links open in your browser; the app itself requires no network connection.
