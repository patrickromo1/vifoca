# Vifoca

An offline-first React Native cat-video player.

## Run it

```bash
npm install
npx expo start
```

Import one or more videos from the library, open one, and tap **Lock**. Lock mode leaves the video playing while hiding playback and navigation controls. Tap **Owner unlock**, then enter the demo PIN `2468`.

## Verify locally

```bash
npm run lint
npm run typecheck
npm test
```

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

## License

Copyright (c) 2026 Meo Inc. All rights reserved. This is proprietary software;
unauthorized copying, distribution, or commercial use is prohibited. See
[LICENSE](LICENSE) for details.
