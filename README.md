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

### Supabase authentication

The `/auth` screen uses Supabase Auth for:

- Email/password sign-up, email verification, sign-in, and password reset
- Phone OTP sign-up and verification
- Google and Apple OAuth
- Anonymous guest sessions

Create a Supabase project, copy its project URL and anon key into `.env.local`,
and enable the providers you want in Supabase Authentication settings. Add
`http://localhost:3000/auth/callback` as an allowed redirect URL (and the
production callback URL when deployed). Email and SMS delivery use the
templates/providers configured in Supabase; no credentials are stored in this
repository.

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

## Data

Guest session and admin board use `localStorage` so you can demonstrate the loop on one machine without accounts. Production would use authenticated APIs, PostgreSQL, and proper retention.
