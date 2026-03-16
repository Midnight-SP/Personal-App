# Personal App

Personal App is a React Native mobile project with file-based navigation, Android native configuration checked into the repo, and a trimmed-down app shell ready for product work.

## Scripts

```bash
npm install
npm run start
npm run android
npm run check:all
```

Additional commands:

- `npm run android:open` opens the installed Android development build.
- `npm run android:go` starts the app directly in Expo Go.
- `npm run start:stable` starts Metro on a clean LAN port and prints the mobile connection URL.
- `npm run type-check` runs TypeScript without emitting output.

## Android setup

On Windows, make sure Android Studio, the Android SDK, and an emulator are installed before running `npm run android`.

Expected identifiers:

- Android package: `com.midnight-sp.personalapp`
- iOS bundle identifier: `com.midnight-sp.personalapp`
- Deep link scheme: `personalapp`

## Project layout

- `app/` contains routes and navigation layout.
- `components/` contains shared themed UI building blocks.
- `constants/` contains app-wide theme values.
- `hooks/` contains color scheme and theme helpers.
- `scripts/` contains Windows-oriented helper scripts for Android and Metro workflows.

## Current state

The starter tutorial screens and reset-template utilities have been removed. What remains is a neutral application shell that can be shaped around the first real feature set.
