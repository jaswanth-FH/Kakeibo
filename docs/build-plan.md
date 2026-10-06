# Build plan

Work through the milestones in order. Finish each one's acceptance checks before starting the next, and commit at the end of each.

## M0: Project setup
- Expo app with TypeScript, expo-router, dev client, NativeWind and React Native Reusables installed and themed per `design-tokens.md`.
- Figtree loaded with expo-font before the splash hides. Status bar light, background `bg`.
- Tab layout with the 4 tabs and placeholder screens; `/pay/*` stack without tabs.
- ESLint, Prettier, Jest configured. `npm test` runs.

**Done when:** `npx expo run:android` shows the 4 tabs in the dark theme with Figtree, and a sample Reusables `Button` renders as our white pill.

## M1: Data layer
- expo-sqlite with SQLCipher enabled (via its config plugin), key from expo-secure-store.
- Drizzle schema, first migration, seed categories on first run.
- `src/lib/money.ts` (paise ↔ display, Indian grouping, compact "₹28.5K").
- Insight queries from `data-model.md` with unit tests against fixtures.
- A dev-only "Seed sample month" action that inserts realistic transactions for two months.

**Done when:** tests pass and the seeded data can be read back.

## M2: Read-only screens on seeded data
- Shared components: `PillButton`, `OutlineButton`, `IconButton`, `CategoryDot`, `Avatar`, `TxnRow`, `SegmentedBar`, `Donut`, `CompareBar`, `TabBar`.
- Home, Statistics, Compare and History built against live queries (`useLiveQuery`).
- Empty states for no data and no previous month.

**Done when:** the four screens match the design PNGs with seeded data, and period switching on Statistics updates the donut.

## M3: Scanning and parsing
- `parseUpiUri` + `amountToPaise` + `buildPayUri` with unit tests (valid, missing `pa`, bad VPA, non-INR, zero amount, upper-case scheme, signed QR).
- Scan screen with expo-camera, flashlight, gallery import via `scanFromURLAsync`, permission handling, invalid-QR message.
- Pay draft store; Details and Amount screens; Enter UPI ID path.

**Done when:** scanning a real merchant QR shows Details with the correct fields, a personal QR goes to Amount, and a random QR shows the error.

## M4: Tagging
- Tag screen: category grid, suggestion order (rule → history → mcc), note, "Always tag" toggle writing `payeeRules`.

**Done when:** a second scan of the same payee preselects the saved category.

## M5: UPI module and payment
- Local Expo module per `upi-native-module.md`, including the manifest `<queries>`.
- Choose app sheet from `getInstalledApps()`, preferred-app setting.
- Save `pending` → `pay()` → Waiting → route by result. Confirm, Success and Failed screens.
- App-resume check that sends a recent pending payment to Confirm.
- "Ask me later" local notification.
- iOS guard on the Pay button.

**Done when:** a ₹1 payment to your own account through Google Pay ends on Success with an approval reference, a cancelled one ends on Confirm, and force-closing the app mid-payment leads back to Confirm on reopen.

## M6: Polish and release prep
- Optional app lock (expo-local-authentication) in a small Settings screen, plus name, preferred app and data export (CSV via expo-sharing).
- Haptics on scan success and payment result. Accessibility labels everywhere; check with TalkBack.
- App icon, splash, Play Store listing assets. Privacy policy (India DPDP Act 2023) and Play's financial-features declaration.
- EAS Build profile for an internal testing track.

**Done when:** an internal-track build installs from Play and passes the M5 checks on two different phones.

## Later (not v1)
- Budgets per category with alerts
- Income tracking (the Expenses dropdown)
- Cloud backup and sync (Supabase)
- Bank transaction reconciliation through an Account Aggregator provider, to confirm statuses automatically
