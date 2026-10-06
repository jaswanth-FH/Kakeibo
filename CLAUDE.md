# Scan & Pay Expense Tracker

An Android-first expense tracker for India. The user scans any UPI QR code, tags the payment with a category, and pays through their own UPI app (Google Pay, PhonePe, Paytm, BHIM) via an Android UPI intent. Every payment is saved locally, and the saved data powers monthly statistics, month-vs-month comparison and history.

We never hold or move money. We build a `upi://pay` link, hand it to the user's UPI app, and record what happened.

Read these before writing code:

- `docs/spec.md`: every screen, its states and its route
- `docs/design-tokens.md`: colors, type, radii, and the Tailwind theme
- `docs/data-model.md`: SQLite schema (Drizzle), categories, auto-tagging rules
- `docs/upi-native-module.md`: the Kotlin Expo module that launches UPI apps and returns the result
- `docs/build-plan.md`: milestones in order, with acceptance criteria
- `docs/design/`: PNG exports of every screen. Match them closely.

## Stack

- **Expo** (latest SDK) with **expo-router**, TypeScript strict mode
- **Development build** (`expo-dev-client`). Expo Go cannot run the custom UPI module.
- **NativeWind** + **React Native Reusables** (shadcn-style components for RN). Components are copied into `src/components/ui/` and restyled to our tokens.
- **expo-camera** for QR scanning (`CameraView` with `barcodeScannerSettings`), and `scanFromURLAsync` for QR images picked with **expo-image-picker**
- **expo-sqlite** with SQLCipher enabled + **drizzle-orm** (`useLiveQuery` for reactive screens)
- **expo-secure-store** holds the database encryption key
- **expo-local-authentication** for the optional app lock
- **react-native-svg** for the donut chart and icons. Charts are hand-built, not from a chart library.
- **@expo-google-fonts/figtree** for the Figtree typeface
- **zustand** for the in-progress payment draft (scan → tag → pay)
- **expo-notifications** for "ask me later" reminders on pending payments
- Local Expo module `modules/upi-intent` (Kotlin) for UPI app discovery and launch

## Project layout

```
src/app/                 expo-router routes (see docs/spec.md for the route table)
src/components/ui/       React Native Reusables components, restyled
src/components/          app components (TxnRow, CategoryDot, Donut, CompareBar, PillButton…)
src/features/pay/        payment draft store, UPI link parse/build, status handling
src/features/insights/   aggregation queries (monthly totals, comparisons)
src/db/                  drizzle schema, migrations, client, seed categories
src/lib/                 money formatting, dates, tokens
modules/upi-intent/      local Expo module (Kotlin + TS bindings, stays at root)
docs/                    specs (this kit)
```

## Commands

```
npx expo run:android      build and run the dev client on a device or emulator
npx expo start --dev-client
npx drizzle-kit generate  create a migration after a schema change
npm test                  jest unit tests
```

## Rules

1. **Money is integer paise.** Store and calculate in paise (`590000` = ₹5,900.00). Format only at the edge with `src/lib/money.ts` (Indian grouping: ₹1,00,000).
2. **Never trust the UPI app's status alone.** It can be missing or wrong. Show `/pay/confirm` whenever the status is anything other than an unambiguous `SUCCESS`, and let the user mark the result.
3. **Save before paying.** Insert the transaction as `pending` before launching the UPI app, then update it. A user who never comes back must still have a record.
4. **Do not rewrite merchant QR links.** If the scanned QR already contains `am` or `sign`, pass the original `upi://` string to the UPI app unchanged; editing it can break the merchant's signature. Only build a fresh link for QRs without an amount (personal QRs).
5. **Android only for payments.** On iOS, scanning, tagging and insights still work, but the Pay button explains that payments need Android. Guard with `Platform.OS`.
6. **Match the design.** Dark and light themes; colors live once in `src/lib/theme.js` (classNames via `tailwind.config.js`, JS props via `useTokens()`), never raw hex in components. The Scan screen is always dark. Touch targets at least 44 px. Every icon-only button gets an `accessibilityLabel`.
7. **Category colors are fixed** and come from the `categories` table, so a category looks the same on every screen.
8. **Tests:** the UPI link parser, the UPI response parser, money formatting and the monthly aggregation queries must have unit tests.
9. Keep components small and typed. No `any`. No new dependencies without saying why in the PR or commit message.
