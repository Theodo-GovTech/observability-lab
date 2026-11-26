# frontend-expo

React Native app built with [Expo](https://docs.expo.dev). New to mobile? Read this first.

## How it works

- **Metro** is the JS bundler (the Vite of React Native). `bun run start` launches it; the app downloads its JS from it.
- The JS runs inside a **native app shell** installed on a phone or simulator. Two options:
  - **Expo Go**: a generic shell from the App Store / Play Store. No Xcode or Android Studio needed.
  - **Development build**: our own shell, compiled locally from `ios/` and `android/`. Needed for native code
    that Expo Go doesn't ship.
- `ios/` and `android/` are generated from `app.config.ts` by `bun run prebuild` and are not committed.

## Set up your environment

Follow the official guide and pick your target (Android/iOS, emulator/device, Expo Go/development build):
https://docs.expo.dev/get-started/set-up-your-environment/

In short:

| Target                         | You need                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------- |
| Physical phone with Expo Go    | Expo Go installed on the phone, same Wi-Fi as your computer                  |
| iOS simulator (macOS only)     | Xcode + its iOS simulator runtime, CocoaPods for development builds          |
| Android emulator               | Android Studio (SDK + an emulator), `ANDROID_HOME` set, JDK 17               |

## Run

Start the backend first (`cd ../backend-express && bun run dev`), then:

```sh
bun install
bun run start     # Expo Go: scan the QR code, or press i (iOS sim) / a (Android emulator)
bun run ios       # development build on the iOS simulator
bun run android   # development build on the Android emulator
```

The app calls the backend on port 3000 of the machine running Metro, so a physical phone must be on the same
network as your computer.

## Troubleshooting

- Weird cache issues: `bun run start --clear`.
- Native build out of sync after changing `app.config.ts` or adding a native package: `bun run prebuild`.
