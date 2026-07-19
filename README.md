# Vifoca

An offline-first React Native cat-video player.

## Run it

```bash
npm install
npx expo start
```

Import one or more videos from the library, open one, and tap **Lock**. Lock mode leaves the video playing while hiding playback and navigation controls. It unlocks with a 3.5-second long-press in the top-left corner followed by the demo PIN `2468`.

## Current behavior

- Videos are listed locally in a scrollable library; tap to play and long-press an item to remove it.
- The app records the library between launches. Imported files are supplied by the device document picker.
- The owner PIN is intentionally a prototype-only demo value and should be replaced before release.

## Next steps

- Replace the demo PIN with a first-run owner PIN setup.
- Add biometric unlock.
- Add real thumbnails and playlists.
- Add native Guided Access/app-pinning instructions.
- Add cloud storage only after validating local playback.
