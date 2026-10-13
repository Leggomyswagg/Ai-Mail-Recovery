# EmailRescue

Recovery guidance for Gmail, iCloud, and Yahoo. The current app offers a free
preview checklist; it does not take payment or recover accounts itself. Only
the account provider can verify ownership and restore access.

## Run

Use Node.js 20 or newer:

```bash
npm ci
cp .env.example .env
npm run dev
npm test
npm run build
```

Without a key, all provider/problem combinations use curated guidance. Optional
AI generation runs through the server endpoint `POST /api/recovery-plan`. Set
`ANTHROPIC_API_KEY` in the server's environment to enable it. Never use
`VITE_ANTHROPIC_API_KEY`: Vite exposes `VITE_` values in browser bundles. Rotate
any key previously deployed under that name. `ANTHROPIC_MODEL` is optional.

Vite's development server includes the local API endpoint. The production
endpoint in `api/recovery-plan.js` can run on Vercel with the built Vite app.
`npm run preview` and plain static hosting use the built-in guide fallback.
Configure server secrets in the hosting provider, never in source control.

The email address stays in React state in the user's browser. Provider, problem,
and optional details are sent to the app's API; details are sent to Anthropic
only when a server key is configured. Do not include passwords or verification
codes. Neither account credentials nor a live account-recovery flow are needed
to test this app. Tests mock all AI requests.

## Remaining release work

Paid access is unavailable. The previous button labelled as a Stripe payment
simply changed pages and is now an explicit free preview. Paid launch requires
real checkout, server-verified payment/webhooks, access control, a shared durable
rate limit, and actual terms/privacy/refund policies. No Stripe credentials or
merchant policies are configured. The API's in-memory request limit is for
development and does not enforce a shared quota across serverless instances.

The existing scaffold pull request is
[PR #1](https://github.com/Leggomyswagg/Ai-Mail-Recovery/pull/1); this work builds
on its branch instead of recreating the application.
