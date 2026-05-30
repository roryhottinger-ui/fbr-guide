# Handing This Project to Claude Code — Step by Step

A plain-English guide for getting from "I have a spec and some docs" to "Claude Code is building my app." Written assuming you're new to this.

---

## What Claude Code is

Claude Code is a version of Claude that runs in your computer's terminal (the command-line app — Terminal on Mac, or Windows Terminal / PowerShell on Windows). Unlike chatting in a browser, it can read and write files on your machine, run commands, install things, and execute the build. You give it the spec, it does the work, you review.

---

## Step 1 — Install the tools (one-time setup)

You need three things installed. Take them one at a time.

1. **Node.js** — the runtime Expo needs. Download the "LTS" version from [nodejs.org](https://nodejs.org) and run the installer. To check it worked, open your terminal and type `node --version` — you should see a version number.

2. **Claude Code** — install it by following the official instructions at [docs.claude.com](https://docs.claude.com) (search "Claude Code install"). You'll need a Claude account. *(Don't rely on me for the exact command — check the current docs, as install steps change.)*

3. **A code editor** (optional but recommended) — [VS Code](https://code.visualstudio.com) is free and standard. It lets you see the files Claude Code creates and read the code.

---

## Step 2 — Make a project folder and add the docs

1. Create an empty folder somewhere sensible, e.g. `Documents/fbr-guide`.

2. Inside it, create a sub-folder called `docs`.

3. Put these **six files** into `docs/`:
   - `SPEC.md` ← the build spec (this is the main one)
   - `irish_fbr_context_document.md`
   - `irish_fbr_document_guide.md`
   - `fbr_eligibility_checker_flow.md`
   - `fbr_document_checklist_rules.md`
   - `fbr_app_mockup_v3.jsx`

   *(You could put SPEC.md in the top folder instead of docs/ — either works, just tell Claude Code where it is.)*

That's the entire handover package. Everything Claude Code needs to understand the app is in those files.

---

## Step 3 — Open Claude Code in the folder

1. Open your terminal.
2. Navigate into your project folder. Type `cd ` (with a space), then drag the folder from your file explorer onto the terminal window (this pastes the path), then press Enter.
3. Start Claude Code (the command is typically `claude` — confirm from the docs).

Claude Code now has access to that folder and everything in it.

---

## Step 4 — The opening prompt

Don't paste the whole spec into the chat — it's already in the folder. Instead, point Claude Code at it. A good opening message:

> Read `docs/SPEC.md` in full, then read the four context documents and skim the mockup it references. This is the build spec for a mobile app. Once you've read everything, give me a one-paragraph summary of what we're building and your plan for the first session, then wait for me to confirm before writing any code.

This does two things: it forces Claude Code to actually read the spec before acting, and it gives you a checkpoint to confirm it understood before it starts generating files.

---

## Step 5 — Work in phases, not all at once

The spec is deliberately broken into phases and tasks. Don't ask for the whole app in one go — you'll lose track and it's harder to spot mistakes. Instead, go phase by phase. After it reads the spec, say something like:

> Start with Phase 1 only (project setup, theme, types, store). Complete all four tasks, then stop and tell me how to run it on my phone via Expo Go so I can see it working.

Then for the critical logic:

> Now do Phase 3, Tasks 3.1 and 3.2 — the eligibility content and engine — with full unit tests covering every path. Don't build any UI yet. Run the tests and show me they pass before moving on.

The spec's Section 10 ("Suggested First Session") already lays out this order — you can just tell Claude Code to follow it.

---

## Step 6 — Seeing it on your phone (the fun part)

Once Phase 1 is done, Claude Code will have a runnable app. To see it:

1. Install **Expo Go** on your phone (App Store / Play Store).
2. In the project folder, Claude Code (or you) runs `npx expo start`.
3. A QR code appears in the terminal. Scan it with your phone's camera (iPhone) or the Expo Go app (Android).
4. The app loads on your phone. Changes reload automatically.

This costs nothing and needs no developer accounts. You'll be doing this constantly.

---

## Step 7 — When you're ready for real users

Follow the Deployment section in the spec:
1. **PWA on Vercel first** — Claude Code can build the web output and walk you through deploying to Vercel (free, gives you a URL for Reddit).
2. **App stores later** — only once it has traction. Google Play first ($25 one-time), Apple second (€99/year).

---

## Practical tips for working with Claude Code

- **Review as you go.** After each phase, open the files in VS Code and skim them. You don't need to understand every line — just sanity-check that things exist and look reasonable.
- **Commit to git often.** Ask Claude Code to set up git at the start and commit after each task. If something breaks, you can roll back. (Say: "Set up a git repo and commit after each completed task with a clear message.")
- **Trust the tests.** The eligibility and checklist engines have unit tests for a reason — they're the core logic. If the tests pass, that logic is sound. Ask Claude Code to run them whenever it changes engine code.
- **If it goes off track,** stop it and point back to the spec: "That doesn't match Section 7, point 4 of the spec — the expired ID should be a hard blocker, not a warning. Please re-read and fix."
- **One change at a time when debugging.** If something's wrong, fix one thing, re-test, repeat. Don't let it make ten changes at once.
- **Ask it to explain.** You're learning — it's fine to say "explain what this file does in plain English" any time.

---

## What to expect, realistically

- Phase 1 might take one session and get you a running app shell on your phone — a genuine milestone.
- The engine phases (3 and 4) are the most important and most error-prone; the unit tests are your safety net there.
- The UI phases will feel fast and satisfying because the logic underneath is already solid.
- You will hit confusing errors. That's normal. Paste the error back to Claude Code and ask it to diagnose — that's exactly the kind of thing it's good at.

---

## The absolute minimum version of all this

If the above feels like a lot:

1. Install Node.js and Claude Code.
2. Put the six files in a folder.
3. Open Claude Code in that folder.
4. Say: *"Read docs/SPEC.md and the docs it references, then follow the Suggested First Session. Set up git and commit after each task. Stop after the eligibility engine and show me the tests passing."*
5. When it's ready, scan the Expo Go QR code to see your app.

Everything else you can learn as you go.
