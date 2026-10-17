# BMI & Wellness Tracker

A Progressive Web App (PWA) that calculates your Body Mass Index (BMI) and turns it into a personalised wellness plan: nutrition, activity, hydration, a downloadable PDF report, and an interactive salad builder that portions your meal for your goal.

- **Live app:** https://bmi-wellness-tracker.vercel.app
- **Repository:** https://github.com/sivaprasad-a/bmi-wellness-tracker

> BMI is a screening tool, not a diagnosis. This app gives general guidance and is not a substitute for advice from a healthcare professional.

---

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Testing](#testing)
- [Project structure](#project-structure)
- [How the numbers are calculated](#how-the-numbers-are-calculated)
- [PWA and offline support](#pwa-and-offline-support)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Features

### BMI report (`/`)

- **BMI calculator** with metric (cm, kg) and imperial (ft/in, lb) units. Values convert automatically when you switch.
- **Validated numeric inputs**: text fields that accept only digits (plus one decimal place where it makes sense), so scrolling over a field never changes its value.
- **Results at a glance**: a colour gauge, a BMI range bar (Underweight / Normal / Overweight / Obesity), healthy weight range, BMR (calories burned at rest), daily water target and category.
- **Personalised wellness plan** in tabs that adapt to your BMI category:
  - **Nutrition**: what to eat for your goal.
  - **Cut back** (overweight and obesity only): what to remove from your diet, with calorie savings.
  - **Activity**: a daily **step goal scaled to your BMI**, with distance, time and calories.
  - **Hydration** and **Additional tips**.
- **PDF report** generated in the browser. It includes your name, details, BMI scale, metrics and the full plan, and is saved as `<Name>_BMI-Report_<YYYY-MM-DD>.pdf`. If no name was entered, the app asks for one first.
- **Share on WhatsApp** with a summary of your results.

### Salad prep (`/salad`)

- Reads your latest BMI result (saved in the browser) and sets a **per-meal calorie target**, **protein target** and **portion limits** for your goal (gain, maintain or lose weight).
- Starts with a **recommended bowl** sized to your meal target, which you can edit freely.
- Six steps, each a swipeable **carousel**: Greens, Vegetables, Protein, Fibre & grains, Seeds & nuts, Greek yogurt & dressings (37 ingredients).
- **Live portion tips** while you build (e.g. "Seeds: keep it to 1 tbsp for your goal").
- **Evaluate** gives a verdict and concrete **what to drop / reduce / swap** and **what to add** suggestions, each with its calorie change.
- A **congratulations animation** when your bowl reaches the target.
- **Start over** (with Undo) is always available in the sticky top bar.

### App

- Installable PWA with an "Install app" button, offline support and generated app icons.
- Responsive from phones (about 360px wide) to large desktops.

---

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | [Next.js 15](https://nextjs.org/) (App Router) with [React 19](https://react.dev/) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) (strict mode) |
| UI | [MUI (Material UI) 7](https://mui.com/) with Emotion for styling, plus MUI Icons |
| Fonts | Inter via `next/font` |
| PDF | [jsPDF](https://github.com/parallax/jsPDF), loaded on demand when you click Download |
| PWA | Web app manifest (`app/manifest.ts`), hand-written service worker (`public/sw.js`), icons rendered with `next/og` |
| Testing | [Vitest 3](https://vitest.dev/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), `@testing-library/user-event`, `jest-dom`, jsdom |
| Hosting | [Vercel](https://vercel.com/) |

There is no backend or database. All calculations run in the browser, and the only persisted data is your latest BMI result in `localStorage`, used by the salad builder.

---

## Getting started

### Prerequisites

- **Node.js 20 or newer** (developed on Node 24). Check with `node -v`.
- **npm 10+** (comes with Node).
- Git, to clone the repository.

### Install and run

```bash
git clone https://github.com/sivaprasad-a/bmi-wellness-tracker.git
cd bmi-wellness-tracker
npm install
npm run dev
```

Open http://localhost:3000.

If port 3000 is already used by another app, run on a different port:

```bash
npm run dev -- -p 3005
```

### Run a production build locally

```bash
npm run build
npm start          # serves the build on http://localhost:3000
```

The service worker (offline support and install) only registers in production builds, so use `npm run build && npm start` to try the PWA features.

No environment variables are required.

---

## Available scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Create an optimised production build in `.next/` |
| `npm start` | Serve the production build |
| `npm test` | Run the full test suite once |
| `npm run test:watch` | Run tests in watch mode, re-running on file changes |
| `npm run lint` | Type-check the project with TypeScript (`tsc --noEmit`) |

---

## Testing

Tests use **Vitest** with **jsdom** and **React Testing Library**. Configuration is in [`vitest.config.mts`](vitest.config.mts), and global setup (jest-dom matchers, cleanup) is in [`src/test/setup.ts`](src/test/setup.ts).

```bash
npm test                              # run everything once
npm run test:watch                    # watch mode
npx vitest run src/lib/salad.test.ts  # run one file
npx vitest run -t "Cut back"          # run tests whose name matches
npm run lint                          # type-check
```

Test files sit next to the code they test (`*.test.ts` / `*.test.tsx`):

| File | Covers |
| --- | --- |
| `src/lib/bmi.test.ts` | BMI formula, categories and boundaries, BMR, hydration, unit conversion, step goals, gauge and range-bar positions |
| `src/lib/form.test.ts` | Form parsing and validation, name rules, unit switching, the numeric input regex |
| `src/lib/plan.test.ts` | Category-specific plans, the Cut back section, step-goal cards |
| `src/lib/report.test.ts` | PDF content (name, metrics, plan), filename, document metadata, WhatsApp share text |
| `src/lib/salad.test.ts` | Ingredient data, meal targets, live tips, default bowls, evaluation drop/add suggestions |
| `src/lib/storage.test.ts` | Saving and loading the last BMI result |
| `src/components/BmiApp.test.tsx` | Report page: calculating, validation, unit toggle, tabs, PDF name prompt, sharing, salad promo |
| `src/components/salad/SaladBuilder.test.tsx` | Salad page: personalisation, default bowl, Start over and Undo, carousel reset, tips, evaluation, celebration |

---

## Project structure

```
├── public/
│   └── sw.js                     # Service worker (offline caching)
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout: fonts, MUI theme, SW registration
│   │   ├── page.tsx              # "/"  BMI report
│   │   ├── salad/page.tsx        # "/salad"  salad builder
│   │   ├── manifest.ts           # PWA manifest
│   │   └── icons/[size]/route.tsx# Generated PNG app icons
│   ├── components/
│   │   ├── BmiApp.tsx            # Report page container (state, PDF, share)
│   │   ├── DetailsForm.tsx       # Name, units, height, weight, age, gender
│   │   ├── ResultCard.tsx        # Gauge, range bar, stat tiles
│   │   ├── WellnessPlan.tsx      # Plan tabs and detail dialogs
│   │   ├── SaladPromo.tsx        # "Try our salad prep" call to action
│   │   ├── NameDialog.tsx        # Name prompt before PDF download
│   │   └── salad/                # Salad builder UI (carousel, bowl, evaluation, confetti)
│   ├── lib/                      # Pure, framework-free logic (fully unit-tested)
│   │   ├── bmi.ts                # Formulas, categories, step goals, unit conversion
│   │   ├── form.ts               # Form parsing, validation, numeric input regex
│   │   ├── plan.ts               # Wellness plan content per category
│   │   ├── report.ts             # PDF report generation (jsPDF)
│   │   ├── salad.ts              # Ingredients, meal targets, tips, evaluation
│   │   ├── share.ts              # WhatsApp share text
│   │   ├── storage.ts            # localStorage hand-off between pages
│   │   └── format.ts             # Height/weight formatting
│   ├── test/setup.ts             # Vitest setup
│   └── theme.ts                  # MUI theme (brand colours, typography)
├── next.config.ts
├── vitest.config.mts
└── tsconfig.json
```

The business logic lives in `src/lib` as plain TypeScript functions with no React, so it is easy to test and reuse. Components only handle state and presentation.

---

## How the numbers are calculated

| Metric | Formula |
| --- | --- |
| **BMI** | weight (kg) ÷ height (m)², rounded to 1 decimal |
| **Category** | Underweight < 18.5 · Normal 18.5–24.9 · Overweight 25–29.9 · Obesity ≥ 30 |
| **Healthy weight range** | BMI 18.5 to 24.9 at your height |
| **BMR** | Mifflin–St Jeor: 10 × kg + 6.25 × cm − 5 × age, then +5 (male) or −161 (female). Needs age and gender. |
| **Hydration** | 35 ml per kg of body weight per day |
| **Daily step goal** | Underweight 7,000 · Normal 8,000–10,000 · Overweight 10,000–12,000 · Obesity 10,000. Overweight and obesity include a lower starting point that rises each week. |
| **Salad meal target** | 30% of daily calories, where daily = BMR × 1.4, then +400 kcal (underweight), −400 (overweight) or −600 (obesity). The range is ±10%. |
| **Salad protein target** | Body weight × 1.0–1.6 g/kg (depending on category) ÷ 3 meals |

Ingredient nutrition values are approximate reference values per portion, so salad calories are estimates.

---

## PWA and offline support

- The manifest is served at `/manifest.webmanifest`, and icons are generated at `/icons/192`, `/icons/512` and `/icons/maskable-512`.
- `public/sw.js` pre-caches `/` and `/salad`, uses network-first for pages (falling back to cache when offline) and stale-while-revalidate for static assets.
- The service worker registers **only in production**.
- To test installation, run `npm run build && npm start`, open the app in Chrome or Edge, and use the "Install app" button or the browser's install icon.
- When you change `public/sw.js`, bump its `VERSION` constant so browsers drop the old cache.

---

## Deployment

The app is deployed on **Vercel** and needs no configuration or environment variables. The GitHub repository is connected to the Vercel project, so deployments happen automatically:

| Event | Result |
| --- | --- |
| Merge (push) to `main` | **Production** deploy to https://bmi-wellness-tracker.vercel.app |
| Push to any other branch / open a PR | **Preview** deploy with its own URL, posted on the PR |

`main` is protected: direct pushes are blocked, so every change reaches production through a pull request.

```
feature branch ──► pull request (Preview deploy) ──► merge to main ──► Production deploy
```

**Manual deploy (Vercel CLI)**, e.g. for a hotfix or if the Git integration is disconnected:

```bash
npx vercel login
npx vercel link            # first time only
npx vercel deploy --prod
```

If automatic deploys stop, check Project → Settings → Git in the Vercel dashboard, or reconnect with `npx vercel git connect` (your Vercel account needs a GitHub login connection under Account Settings → Authentication).

---

## Troubleshooting

**Buttons and tabs don't respond, or the server logs `Cannot find module './vendor-chunks/...'`**
The `.next` folder is corrupted, usually because `next build` ran while `next dev` was running (both write to `.next`). Stop the servers, delete the folder and restart:

```bash
rm -rf .next      # Windows PowerShell: Remove-Item -Recurse -Force .next
npm run dev
```

To build while a dev server is running, write the build to a separate folder:

```bash
NEXT_DIST_DIR=.next-verify npm run build
NEXT_DIST_DIR=.next-verify npm start -- -p 3123
```

**localhost:3000 shows a different app**
Another project is using the port. Run this one on its own port with `npm run dev -- -p 3005`.

**Old version still showing after an update**
The service worker may be serving cached files. Hard-refresh (Ctrl+Shift+R), or in DevTools go to Application → Service Workers → Unregister.

**The salad page says "Calculate your BMI first"**
It reads your last result from `localStorage`. Open `/`, calculate your BMI, then return to `/salad`. Private browsing windows may block storage.
