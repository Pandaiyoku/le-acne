# Le Acne

A private, single-user debt ledger built with Next.js App Router, Tailwind CSS, Firebase Authentication, and Firestore.

## Local setup

1. Create a Firebase project and enable **Email/Password** under Authentication.
2. Copy `.env.example` to `.env.local`, fill in the Firebase web app values, and set `NEXT_PUBLIC_ALLOWED_EMAIL` to the one permitted address.
3. In `firestore.rules`, replace `REPLACE_WITH_YOUR_ALLOWED_EMAIL` with that exact address, then deploy rules with `firebase deploy --only firestore:rules`.
4. Run `npm install` and `npm run dev`.

For Vercel, add the same `NEXT_PUBLIC_FIREBASE_*` values and `NEXT_PUBLIC_ALLOWED_EMAIL` in Project Settings → Environment Variables. The Firebase web config values are public identifiers; Firestore rules enforce the actual database boundary.

## Data layout

All application data stays in the protected `private/ledger` document tree:

- `balance/current` — official and hypothetical balances
- `items/*` — dynamically fetched shop inventory (there are no source-defined items)
- `history/*` — immutable-style action audit entries
- `settings/severity` — editable pain-scale configuration

Balance writes use a Firestore transaction. Acne incidents subtract from both balances; purchases add their value, with the official balance capped at `$0` and hypothetical balance left uncapped.

## Important security note

Client-side email checks make the gate pleasant, but they are not the security boundary. Deploy the Firestore rule with the allowed email filled in before using the app. Do not deploy the placeholder rule unchanged.
