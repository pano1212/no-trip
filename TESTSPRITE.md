# TestSprite Test Brief

## Application

The Fluid Ledger is a responsive trip finance dashboard built with React, TypeScript, and Vite. It helps users create trip or monthly funds, add payments/expenses, track total spending, view remaining budget, and review recent expenses.

## Test URL

Use the public preview/deployment URL for TestSprite cloud testing.

For local manual preview:

```text
http://localhost:5175/
```

## Authentication

The current login screen uses mock local authentication.

- Username/email: any valid email, for example `tester@example.com`
- Password: any non-empty value, for example `Test1234`
- Expected result: after clicking `Sign in`, the dashboard home view appears.

## Core User Flows

1. Login flow
   - Open the app.
   - Verify the login page loads with the app name, finance preview, email field, password field, remember-me checkbox, forgot button, and sign-in button.
   - Confirm the sign-in button is disabled when either email or password is empty.
   - Enter a valid email and password.
   - Click Sign in.
   - Verify the dashboard loads.

2. Dashboard overview
   - Verify the header displays `The Fluid Ledger`.
   - Verify the home dashboard shows amount remaining, total budget, spent amount, category breakdown, recent expenses, daily allowance, and the floating add button.
   - Click `View All` or the floating add button.
   - Verify the app switches to the Expenses view.

3. Fund creation
   - Navigate to Budget.
   - Choose Month and create a fund named `May 2026` with target amount `1200`.
   - Verify the new fund appears in the fund list.
   - Choose Trip and create a fund named `Bangkok trip` with target amount `2500`.
   - Verify the trip fund appears and can be selected.

4. Payment creation
   - Navigate to Expenses.
   - Select or use an existing fund.
   - Add a payment with:
     - Payment name: `Hotel deposit`
     - Amount: `250`
     - Paid by: `Alex`
     - Date: any valid date
     - Note: `Reservation`
   - Verify the payment appears in the payment list.
   - Verify saved/spent totals update.

5. Payment deletion
   - In Expenses, delete the `Hotel deposit` payment.
   - Verify it disappears from the payment list.
   - Verify totals update.

6. Navigation
   - Use the bottom navigation to switch between Home, Expenses, Budget, and Trips.
   - Verify each tab changes the visible content and the active nav state.

7. Responsive layout
   - Test at mobile width around 390px.
   - Test at desktop/tablet width around 1024px.
   - Verify form fields, bottom navigation, cards, and text do not overlap or overflow.

## Important Notes

- If Firebase environment variables are not configured, data is stored in localStorage demo mode.
- TestSprite should treat the login as a mock login, not a real backend-auth flow.
- The app has no API endpoints to test directly; focus on UI/browser testing.
