# Changelog

All notable changes to this project are documented in this file.

This library is published under two names — [`generate-password-lite`](https://www.npmjs.com/package/generate-password-lite) and [`js-generate-password`](https://www.npmjs.com/package/js-generate-password). Both ship identical code and share this changelog.

## [1.1.0] - 2026-08-26

### Security

- **Passwords are now generated with a cryptographically secure random source.** Every character and every shuffle step draws from `crypto.getRandomValues` instead of `Math.random()`. `Math.random()` is not a CSPRNG: its output is predictable from previous values, so passwords produced by earlier versions should not be treated as secret. If you generated passwords with an earlier version and they still protect something, regenerate them.
- **Character selection is no longer biased.** Values are drawn with rejection sampling, so every character in the allowed set is equally likely. The previous `Math.floor(Math.random() * n)` was uniform, but the modulo-style reduction now used for the CSPRNG would otherwise skew toward the start of each set.
- **Guaranteed characters are spread through the whole password.** Previously the characters satisfying `minLengthLowercase`, `minLengthUppercase`, `minLengthNumbers` and `minLengthSymbols` were shuffled only among themselves and then placed at the front, so a default 10-character password always had exactly one lowercase letter, one uppercase letter and one digit in its first three positions. The complete password is now shuffled.
- **A missing Web Crypto implementation is now an error** rather than a silent fallback to a predictable source.

### Fixed

- Removed the `bin` field, which pointed at a `dist/index.js` that the build never produced and made installs warn `Failed to create bin ... ENOENT`. ([#12](https://github.com/ahmadjoya/generate-password-lite/issues/12))
- `exclude` now removes every occurrence of a character. It used `String.replace` with a string pattern, which only removes the first match.
- Excluding every character of a group that still has a minimum now throws a clear error. It previously returned a password that silently violated the minimum — `exclude: '0123456789'` with the default options produced a password containing no digits at all.
- Options passed by the caller are no longer mutated. `processOption` wrote its defaults back onto the object you passed in, so a reused options object was silently rewritten after the first call.
- `length` and the `minLength*` options are validated, and reject non-integer or negative values instead of behaving unpredictably.
- The package `license` field said `ISC` while the bundled `LICENSE` file and the README said MIT. Both now say MIT.
- The `author` field was spelled `Author`, so npm did not recognise it.

### Added

- A default export, alongside the existing named export. Both `import GeneratePassword from ...` and `import { GeneratePassword } from ...` now work, as do `require(...).default` and `require(...).GeneratePassword`.
- A test suite covering defaults, lengths, character groups, minimums, exclusions, validation, option purity and the random source.
- `engines: node >= 18`, reflecting the Web Crypto requirement.

### Changed

- **Build tooling replaced.** The rollup + `rollup-plugin-typescript2` + `rollup-plugin-dts` chain no longer runs: `import ... assert { type: 'json' }` in the config is a syntax error on Node 22+, and `rollup-plugin-typescript2` calls a compiler API that TypeScript 7 no longer ships. The build is now esbuild plus `tsc`, which have no peer dependencies.
- The `exports` map declares `types` ahead of the runtime condition, so TypeScript resolves the package correctly under `node16`, `nodenext` and `bundler` module resolution.
- Type declarations are self-contained and published as `.d.mts` and `.d.cts` so both the `import` and `require` conditions resolve.
- `tsconfig.json` no longer uses the deprecated `moduleResolution: "node"`.
- The README's `const { GeneratePassword } = "generate-password-lite"` example was not valid JavaScript, and the `exclude` example contained a stray semicolon inside an object literal. The documentation has been rewritten and every example is now verified against the built package.

### Verified against

Node.js 22, TypeScript 7, React 19, Next.js 16 (App Router: server components, client components and route handlers), and Vite 8 browser builds.

## [1.0.2] - 2025-03-25

- Fixed the import path for the ESM and CJS builds, and the Node 20+ error. ([#9](https://github.com/ahmadjoya/generate-password-lite/pull/9))

## [1.0.0] - 2023-12-04

- Rewritten in TypeScript with named exports and a smaller bundle. Published as `generate-password-lite`, continuing from `js-generate-password`.
