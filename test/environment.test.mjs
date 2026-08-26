import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'

import { GeneratePassword } from '../dist/index.mjs'

describe('random source', () => {
  it('uses the Web Crypto API rather than Math.random', () => {
    const originalRandom = Math.random
    let called = false
    Math.random = () => {
      called = true
      return originalRandom()
    }

    try {
      GeneratePassword({ length: 64, symbols: true })
    } finally {
      Math.random = originalRandom
    }

    assert.equal(called, false, 'Math.random must not be used to build passwords')
  })

  it('draws from globalThis.crypto', () => {
    const realCrypto = globalThis.crypto
    let draws = 0

    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: {
        getRandomValues(buffer) {
          draws++
          return realCrypto.getRandomValues(buffer)
        },
      },
    })

    try {
      GeneratePassword({ length: 32 })
    } finally {
      Object.defineProperty(globalThis, 'crypto', {
        configurable: true,
        value: realCrypto,
      })
    }

    assert.ok(draws > 0, 'expected getRandomValues to be called')
  })

  it('throws a helpful error when no Web Crypto implementation exists', () => {
    const realCrypto = globalThis.crypto

    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: undefined,
    })

    try {
      assert.throws(() => GeneratePassword(), /no Web Crypto implementation found/)
    } finally {
      Object.defineProperty(globalThis, 'crypto', {
        configurable: true,
        value: realCrypto,
      })
    }
  })
})

describe('distribution', () => {
  it('is not biased toward the start of the character set', () => {
    // The symbol set has 29 characters, which is not a power of two. A plain
    // `random % 29` would over-represent the first few symbols.
    const tally = new Map()
    const samples = 29 * 500

    for (let i = 0; i < samples / 50; i++) {
      const password = GeneratePassword({
        length: 50,
        lowercase: false,
        uppercase: false,
        numbers: false,
        symbols: true,
        minLengthSymbols: 0,
      })
      for (const char of password) tally.set(char, (tally.get(char) ?? 0) + 1)
    }

    assert.equal(tally.size, 29, 'every symbol should be reachable')

    const counts = [...tally.values()]
    const expected = samples / 29
    const min = Math.min(...counts)
    const max = Math.max(...counts)

    assert.ok(
      min > expected * 0.6 && max < expected * 1.4,
      `symbol counts ranged ${min}–${max}, expected around ${expected}`
    )
  })
})
