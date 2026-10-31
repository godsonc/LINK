# LINK — Lincolnshire Inclusion & Navigation Network

Phase 1 MVP for the Community Access & Opportunity Platform described in the PRD: a resident describes a situation in ordinary language, LINK classifies needs, ranks verified local services, builds a pathway, and offers human navigator help.

**From need to opportunity.** One person. One problem. One pathway. One successful connection.

## Run locally

Node 20 is enough. If `node` is not on your PATH, this machine also has a copy at `~/.local/node/bin`.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What this MVP includes

- Resident journey: natural-language story, locality, adaptive questions, need confirmation
- Matching engine over a **verified demo directory** (recommendations cannot invent services)
- Personalised pathway and next three steps
- Referral request, follow-up (“did you get the help?”), Community Navigator escalation
- Safeguarding interrupt for crisis language (999 / Samaritans / 111)
- Admin board: referrals, cases, capacity, verification, audit log
- Accessibility: skip link, larger text, high contrast, keyboard-visible focus, simple language
- Optional voice input where the browser supports it

## What it is not

LINK does not replace social workers, statutory assessments, medical diagnosis, legal decisions, benefits guarantees, or emergency response. Provider records in this repo are **demo** organisations for product testing, labelled as such.

## Guest access

From the welcome screen or `/login`, choose **Continue as guest** to use LINK without signing in. Pathway, bookings, profile, documents and messages stay on this device until you create an account. Sign up prefills name and email from your local profile when available.

## Data

Auth uses Supabase. Guest mode, pathways, bookings, messages, profile and the admin board use `localStorage` on this device for the MVP demo. Production would persist these in PostgreSQL with proper retention.

## Supabase

Keys live in `.env.local` (see `.env.example`). Server Components, Server Actions and Route Handlers use `lib/supabase/server.ts`. Browser forms use `lib/supabase/client.ts`. `middleware.ts` refreshes the auth cookie on each request.

In the Supabase dashboard, add these Redirect URLs:

- `http://localhost:3000/auth/callback`
- `http://localhost:3000/auth/confirm`

Email sign-up and password reset work with the default Auth settings. Google, Apple and phone SMS need those providers enabling in Authentication → Providers.

Optional: run `supabase/ migrations/20261025120000_profiles.sql` in the SQL editor if you want a `profiles` table with row-level security.
