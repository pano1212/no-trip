# Trip Finance

A mobile-friendly TypeScript finance website for saving payments by month or by trip. Data is stored in Firebase Firestore when Firebase environment variables are configured. Without Firebase keys, the app runs in local demo mode using `localStorage`.

## Features

- Create a new monthly fund or trip fund
- Save payments against the selected month or trip
- View total saved, active fund total, and remaining target amount
- Delete saved payments
- Responsive layout for desktop and mobile

## File Structure

```text
src/
  App.tsx                     Main page composition
  main.tsx                    React entry point
  components/                 Reusable UI sections
    AppHeader.tsx
    FundPanel.tsx             Create/select month or trip funds
    PaymentPanel.tsx          Add/delete payments
    StatCard.tsx
    SummaryStats.tsx
  hooks/
    useFinance.ts             Screen state and finance calculations
  lib/
    firebase.ts               Firebase app and Firestore setup
    localStore.ts             Local demo-mode storage helpers
  services/
    paymentService.ts         Firebase/local CRUD functions
  types/
    finance.ts                Shared TypeScript data types
  utils/
    currency.ts               Currency formatter
    date.ts                   Date helpers
  styles.css                  Global responsive styles
```

## Firebase Setup

1. Create a Firebase project.
2. Enable Firestore Database.
3. Copy `.env.example` to `.env`.
4. Fill in your Firebase web app config values:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Run

```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal.
