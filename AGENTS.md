# Repository Guidelines

## Project stack

- This is an Expo 54, React Native, and strict TypeScript application.
- Use npm and keep `package-lock.json` synchronized with `package.json`.
- Use `npx expo install` for dependencies whose versions are managed by Expo.

## Implementation

- Preserve existing user-facing behavior unless a task explicitly changes it.
- Keep non-UI logic in small, typed modules under `src/` when it benefits testing
  or reuse.
- Avoid unnecessary dependencies and configuration.

## Testing and verification

- Vitest is configured for pure TypeScript logic. Do not import React Native or
  Expo runtime modules into Vitest tests.
- Use an Expo-compatible React Native test setup if component or UI tests are
  introduced in the future.
- Before submitting changes, run:

  ```bash
  npm run lint
  npm run typecheck
  npm test
  ```

## Licensing

- This repository is proprietary software owned by Meo Inc. Follow `LICENSE`
  and do not replace it with an open-source license without explicit approval.
