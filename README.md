# Loveni ❤️

A premium couples app built with **React Native, Expo Router, TypeScript, and Firebase**.

Version **1.0** includes authentication, secure partner pairing, days-together sync, love notes, mood sharing, and a polished home dashboard — all Expo Go compatible.

## Features

- Email/password auth with persistent sessions (AsyncStorage)
- Profile setup with name + curated avatars
- Invite-code partner pairing (one active partner)
- Shared relationship start date, day counter, anniversary countdown
- Real-time love notes and mood sharing
- Home dashboard with quick actions
- Light / dark / system themes
- In-app alerts only (no Expo Go background push)

## Quick start

1. Put your Firebase Android file at the project root:

```text
google-services.json
```

2. Install and run:

```bash
npm install
npm run android:device          # USB phone (Metro via adb reverse → http://127.0.0.1:8081)
npm run android                 # emulator / default Android target
npm run android:rebuild         # clean prebuild + reinstall on USB device
```

For Expo Go only (no native rebuild):

```bash
npx expo start -c
```

`android:device` reverses Metro on connected USB phones, then opens Expo’s device picker (`expo run:android --device`) so you can choose 🔌 phone or emulator. Packager host is `127.0.0.1` for USB Metro.

Firebase config is read **directly from `google-services.json`**. No Web app and no Firebase keys in `.env` are required.

## Firebase setup

1. Use your existing Firebase project with an **Android app** (`com.loveni.app`).
2. Download `google-services.json` into the project root.
3. Enable **Authentication → Email/Password**.
4. Create a **Cloud Firestore** database.
5. Deploy rules + indexes:

```bash
npx -y firebase-tools@latest login
npx -y firebase-tools@latest use <your-project-id>
npx -y firebase-tools@latest deploy --only firestore:rules,firestore:indexes
```

### Pairing modes

| `EXPO_PUBLIC_PAIRING_MODE` | Behavior |
| --- | --- |
| `client` (default) | Atomic Firestore transactions in the app. Works in Expo Go after rules deploy. |
| `functions` | Uses callable Cloud Functions for pairing. Optional for production. |

Deploy functions (optional):

```bash
cd functions
npm install
npm run build
cd ..
npx -y firebase-tools@latest deploy --only functions
```

## Test plan (two devices / accounts)

1. Sign up User A → complete profile → create invite code.
2. Sign up User B → complete profile → join with code.
3. Confirm both land on Home and see each other.
4. Set relationship start date on one device; confirm the other updates live.
5. Send a love note; confirm realtime delivery + delete by sender.
6. Share a mood; confirm partner mood card updates.
7. Disconnect from Profile → Partner; confirm both return to connect flow.

## Project structure

```
google-services.json   Android Firebase config (source of truth)
app/                   Expo Router screens
src/
  components/          UI + feature components
  contexts/            Auth, Couple, Theme
  lib/firebase.ts      Reads google-services.json
  services/            Firebase feature services
  theme/               Design system
firebase/              Firestore rules + indexes
functions/             Optional pairing backend
```

## Notes

- Keep secrets out of git if needed; `google-services.json` is the Android client config.
- Production Android/iOS release builds are separate from Expo Go development.
- Do not enable unsupported Expo Go background push for v1.0.
