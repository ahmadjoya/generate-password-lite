<p align ="center">
  <a href="https://nodei.co/npm/generate-password-lite" target="_blank">
    <img src="https://nodei.co/npm/generate-password-lite.png" alt="npm Info" />
  </a>
</p>

<p align="center">
  <a href="https://npm.im/generate-password-lite" target="_blank">
    <img src="https://img.shields.io/npm/v/generate-password-lite.svg" alt="npm Version" />
  </a>
  <a href="https://npm.im/generate-password-lite" target="_blank">
    <img src="https://img.shields.io/npm/dm/generate-password-lite.svg" alt="npm Downloads" />
  </a>
  <a href="https://bundlephobia.com/package/generate-password-lite" target="_blank">
    <img src="https://img.shields.io/bundlephobia/minzip/generate-password-lite" alt="Bundle Size" />
  </a>
  <a href="https://github.com/ahmadjoya/generate-password-lite/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/npm/l/generate-password-lite.svg" alt="License" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/ahmadjoya/generate-password-lite/stargazers" target="_blank">
    <img src="https://img.shields.io/github/stars/ahmadjoya/generate-password-lite" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/ahmadjoya/generate-password-lite/network/members" target="_blank">
    <img src="https://img.shields.io/github/forks/ahmadjoya/generate-password-lite" alt="GitHub Forks" />
  </a>
  <a href="https://github.com/ahmadjoya/generate-password-lite/issues" target="_blank">
    <img src="https://img.shields.io/github/issues/ahmadjoya/generate-password-lite" alt="GitHub Issues" />
  </a>
</p>

# generate-password-lite

A tiny, dependency-free password generator for JavaScript and TypeScript projects — Node.js, React, Next.js, Vue, Svelte, Deno, Bun, and the browser.

Passwords may contain lowercase letters, uppercase letters, numbers and symbols. The `options` parameter lets you enable or disable each group, exclude specific characters, and require a minimum number of characters from each group.

- **Secure by default** — every character comes from the Web Crypto CSPRNG (`crypto.getRandomValues`), never `Math.random()`.
- **Zero dependencies** — nothing else is pulled into your lockfile.
- **Dual ESM + CommonJS** — `import` and `require` both work, with matching type declarations.
- **Fully typed** — TypeScript definitions ship with the package.

> **Note**
> This package is also published under the name [`js-generate-password`](https://www.npmjs.com/package/js-generate-password). The two packages are the same library — use whichever name you already depend on.

## Installation

```bash
npm install generate-password-lite
```

```bash
yarn add generate-password-lite
```

```bash
pnpm add generate-password-lite
```

**Requirements:** Node.js 18 or newer, or any modern browser. Both provide the Web Crypto API that this package relies on.

## Usage

### ES modules / TypeScript

```ts
import { GeneratePassword } from 'generate-password-lite'

const password = GeneratePassword({
  length: 14,
  symbols: true,
})

console.log(password) // => "q7#Rk2mV$pLx8w"
```

A default export is available too, if you prefer it:

```ts
import GeneratePassword from 'generate-password-lite'
```

### CommonJS

```js
const { GeneratePassword } = require('generate-password-lite')

const password = GeneratePassword({ length: 14, symbols: true })
```

### React

```tsx
import { useState } from 'react'
import { GeneratePassword } from 'generate-password-lite'

export function PasswordField() {
  const [password, setPassword] = useState(() =>
    GeneratePassword({ length: 16, symbols: true })
  )

  return (
    <div>
      <input readOnly value={password} />
      <button onClick={() => setPassword(GeneratePassword({ length: 16, symbols: true }))}>
        Regenerate
      </button>
    </div>
  )
}
```

### Next.js

The package works in both the App Router and the Pages Router, on the server and in the browser.

```ts
// app/api/password/route.ts
import { GeneratePassword } from 'generate-password-lite'

export function GET() {
  return Response.json({ password: GeneratePassword({ length: 20, symbols: true }) })
}
```

Generating a password during render of a **server component** produces a different value on the server and on the client. Generate it in an event handler, in a route handler, or inside `useState`'s initializer in a client component.

## Options

Every option is optional. Calling `GeneratePassword()` with no argument uses the defaults below.

```ts
GeneratePassword({
  length: 10,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: false,
  exclude: '',
  minLengthLowercase: 1,
  minLengthUppercase: 1,
  minLengthNumbers: 1,
  minLengthSymbols: 0,
})
```

| Name                 | Type      | Description                                                                       | Default |
| -------------------- | --------- | --------------------------------------------------------------------------------- | ------- |
| `length`             | `number`  | Length of the generated password. Must be a positive integer.                      | `10`    |
| `lowercase`          | `boolean` | Include lowercase letters (`a–z`).                                                 | `true`  |
| `uppercase`          | `boolean` | Include uppercase letters (`A–Z`).                                                 | `true`  |
| `numbers`            | `boolean` | Include digits (`0–9`).                                                            | `true`  |
| `symbols`            | `boolean` | Include symbols (see [Symbols](#symbols)).                                         | `false` |
| `exclude`            | `string`  | Characters to leave out of the password.                                           | `''`    |
| `minLengthLowercase` | `number`  | Minimum number of lowercase letters. Forced to `0` when `lowercase` is `false`.    | `1`     |
| `minLengthUppercase` | `number`  | Minimum number of uppercase letters. Forced to `0` when `uppercase` is `false`.    | `1`     |
| `minLengthNumbers`   | `number`  | Minimum number of digits. Forced to `0` when `numbers` is `false`.                 | `1`     |
| `minLengthSymbols`   | `number`  | Minimum number of symbols. Forced to `0` when `symbols` is `false`.                | `1`\*   |

At least one of `lowercase`, `uppercase`, `numbers` or `symbols` must be `true`.

\* `minLengthSymbols` defaults to `1` whenever you turn `symbols` on. Because `symbols` is `false` by default, the effective default for an untouched call is `0`.

### Symbols

When `symbols` is enabled the following characters are used:

```text
!#$%&'()*+,-./:;<=>?@[]^_{|}~
```

## Examples

**No options.** Defaults apply: 10 characters, upper and lowercase letters plus digits, no symbols.

```ts
import { GeneratePassword } from 'generate-password-lite'

console.log(GeneratePassword())
// => "xDU6izb3PV"
```

**A longer password.**

```ts
console.log(GeneratePassword({ length: 25 }))
// => "U4c3KpQP5UrbZgTcrqMgFeI3R"
```

**Excluding characters.** Useful for dropping look-alikes such as `O`/`0` and `l`/`1`.

```ts
console.log(GeneratePassword({ length: 16, exclude: 'Ol01Il' }))
// => "gT7yqW4nZbK9vRhs"
```

**Requiring a mix.** Guarantee at least two of each group.

```ts
console.log(
  GeneratePassword({
    length: 20,
    symbols: true,
    minLengthLowercase: 2,
    minLengthUppercase: 2,
    minLengthNumbers: 2,
    minLengthSymbols: 2,
  })
)
// => "k#9Wq2mZ$vT7pL4nRj%x"
```

**Digits only, for a one-time code.**

```ts
console.log(
  GeneratePassword({
    length: 6,
    lowercase: false,
    uppercase: false,
    numbers: true,
    symbols: false,
  })
)
// => "482915"
```

## Errors

`GeneratePassword` throws an `Error` when the options cannot produce a valid password:

| Condition                                                                    | Example                                                              |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `length` is not a positive integer                                           | `GeneratePassword({ length: 0 })`                                     |
| A `minLength*` value is not a non-negative integer                           | `GeneratePassword({ minLengthNumbers: -1 })`                          |
| Every character group is disabled                                            | `GeneratePassword({ lowercase: false, uppercase: false, numbers: false, symbols: false })` |
| The `minLength*` values add up to more than `length`                         | `GeneratePassword({ length: 4, symbols: true, minLengthSymbols: 5 })` |
| `exclude` removes every character of a group that still has a minimum        | `GeneratePassword({ exclude: '0123456789' })` — digits are on by default |

The last case is worth calling out: excluding all digits while `numbers` is still `true` is a contradiction, so it fails loudly instead of quietly returning a password with no digits.

## Security

Passwords are generated with `crypto.getRandomValues`, the cryptographically secure random source built into Node.js 18+ and every modern browser. Values are drawn using rejection sampling, so each character in the allowed set is equally likely — a plain modulo would skew the results toward the start of the alphabet.

The characters that satisfy your `minLength*` requirements are shuffled through the whole password rather than placed at the front, so the position of each group carries no information.

If `globalThis.crypto` is unavailable, the package throws rather than silently falling back to a predictable random source.

## TypeScript

The `GenerateOptions` type is exported for reuse:

```ts
import { GeneratePassword, type GenerateOptions } from 'generate-password-lite'

const strongDefaults: GenerateOptions = {
  length: 24,
  symbols: true,
  minLengthSymbols: 3,
}

const password = GeneratePassword(strongDefaults)
```

## Contributing

Issues and pull requests are welcome at [github.com/ahmadjoya/generate-password-lite](https://github.com/ahmadjoya/generate-password-lite).

```bash
npm install
npm run build
npm test
```

## License

[MIT](https://github.com/ahmadjoya/generate-password-lite/blob/main/LICENSE) © Ahmad Joya
