import { strict as assert } from 'node:assert'
import { createRequire } from 'node:module'
import { describe, it } from 'node:test'

import { GeneratePassword, default as DefaultExport } from '../dist/index.mjs'

const require = createRequire(import.meta.url)
const cjs = require('../dist/index.cjs')

const LOWERCASE = /[a-z]/
const UPPERCASE = /[A-Z]/
const NUMBER = /[0-9]/
const SYMBOL = /['!#$%&()*+,\-./:;<=>?@[\]^_{|}~]/

const count = (str, re) => [...str].filter(char => re.test(char)).length

describe('module surface', () => {
  it('exposes a named export from ESM', () => {
    assert.equal(typeof GeneratePassword, 'function')
  })

  it('exposes a default export from ESM', () => {
    assert.equal(typeof DefaultExport, 'function')
    assert.equal(DefaultExport, GeneratePassword)
  })

  it('exposes a named export from CJS', () => {
    assert.equal(typeof cjs.GeneratePassword, 'function')
  })

  it('exposes a default export from CJS', () => {
    assert.equal(typeof cjs.default, 'function')
  })

  it('produces the same shape from both builds', () => {
    assert.equal(cjs.GeneratePassword({ length: 20 }).length, 20)
    assert.equal(GeneratePassword({ length: 20 }).length, 20)
  })
})

describe('defaults', () => {
  it('generates a 10 character password with no options', () => {
    assert.equal(GeneratePassword().length, 10)
  })

  it('accepts an empty options object', () => {
    assert.equal(GeneratePassword({}).length, 10)
  })

  it('includes letters and numbers but no symbols by default', () => {
    for (let i = 0; i < 200; i++) {
      const password = GeneratePassword()
      assert.match(password, LOWERCASE)
      assert.match(password, UPPERCASE)
      assert.match(password, NUMBER)
      assert.doesNotMatch(password, SYMBOL)
    }
  })
})

describe('length', () => {
  for (const length of [1, 2, 4, 8, 16, 64, 256, 1024]) {
    it(`honours length ${length}`, () => {
      const options = length < 3 ? { length, uppercase: false, numbers: false } : { length }
      assert.equal(GeneratePassword(options).length, length)
    })
  }

  it('honours length when symbols are enabled', () => {
    assert.equal(GeneratePassword({ length: 32, symbols: true }).length, 32)
  })
})

describe('character classes', () => {
  it('omits lowercase when disabled', () => {
    for (let i = 0; i < 100; i++) {
      assert.doesNotMatch(GeneratePassword({ length: 30, lowercase: false }), LOWERCASE)
    }
  })

  it('omits uppercase when disabled', () => {
    for (let i = 0; i < 100; i++) {
      assert.doesNotMatch(GeneratePassword({ length: 30, uppercase: false }), UPPERCASE)
    }
  })

  it('omits numbers when disabled', () => {
    for (let i = 0; i < 100; i++) {
      assert.doesNotMatch(GeneratePassword({ length: 30, numbers: false }), NUMBER)
    }
  })

  it('includes symbols when enabled', () => {
    for (let i = 0; i < 100; i++) {
      assert.match(GeneratePassword({ length: 30, symbols: true }), SYMBOL)
    }
  })

  it('supports a single enabled class', () => {
    const password = GeneratePassword({
      length: 40,
      lowercase: true,
      uppercase: false,
      numbers: false,
      symbols: false,
    })
    assert.equal(password.length, 40)
    assert.match(password, /^[a-z]+$/)
  })
})

describe('minimum counts', () => {
  it('honours every minimum at once', () => {
    for (let i = 0; i < 200; i++) {
      const password = GeneratePassword({
        length: 24,
        symbols: true,
        minLengthLowercase: 3,
        minLengthUppercase: 4,
        minLengthNumbers: 5,
        minLengthSymbols: 6,
      })
      assert.equal(password.length, 24)
      assert.ok(count(password, LOWERCASE) >= 3)
      assert.ok(count(password, UPPERCASE) >= 4)
      assert.ok(count(password, NUMBER) >= 5)
      assert.ok(count(password, SYMBOL) >= 6)
    }
  })

  it('allows the minimums to consume the whole password', () => {
    const password = GeneratePassword({
      length: 10,
      symbols: true,
      minLengthLowercase: 4,
      minLengthUppercase: 3,
      minLengthNumbers: 2,
      minLengthSymbols: 1,
    })
    assert.equal(password.length, 10)
    assert.equal(count(password, LOWERCASE), 4)
    assert.equal(count(password, UPPERCASE), 3)
    assert.equal(count(password, NUMBER), 2)
    assert.equal(count(password, SYMBOL), 1)
  })

  it('ignores a minimum for a disabled class', () => {
    const password = GeneratePassword({
      length: 20,
      symbols: false,
      minLengthSymbols: 5,
    })
    assert.equal(password.length, 20)
    assert.doesNotMatch(password, SYMBOL)
  })

  it('does not pin guaranteed characters to the front', () => {
    // Every password contains exactly one digit, so a generator that appends
    // the filler after the guaranteed block would always place it at index 0.
    const positions = new Set()
    for (let i = 0; i < 400; i++) {
      const password = GeneratePassword({
        length: 12,
        minLengthLowercase: 0,
        minLengthUppercase: 0,
        minLengthNumbers: 1,
        numbers: true,
        uppercase: false,
        lowercase: true,
      })
      positions.add([...password].findIndex(char => NUMBER.test(char)))
    }
    assert.ok(
      positions.size > 5,
      `expected digits spread across the password, saw positions ${[...positions].join(',')}`
    )
  })
})

describe('exclude', () => {
  it('excludes every listed character', () => {
    const exclude = 'abc567XYZ'
    for (let i = 0; i < 200; i++) {
      const password = GeneratePassword({ length: 30, exclude, symbols: true })
      for (const char of exclude) {
        assert.ok(!password.includes(char), `${password} contains ${char}`)
      }
    }
  })

  it('removes repeated occurrences, not just the first', () => {
    for (let i = 0; i < 200; i++) {
      const password = GeneratePassword({ length: 40, exclude: 'a' })
      assert.equal(count(password, /a/), 0)
    }
  })

  it('still honours length when many characters are excluded', () => {
    const password = GeneratePassword({
      length: 30,
      exclude: 'abcdefghijklmnopqrstuvwxyz0123456789',
      numbers: false,
      lowercase: false,
    })
    assert.equal(password.length, 30)
    assert.match(password, /^[A-Z]+$/)
  })

  it('throws when exclude empties a class that has a minimum', () => {
    assert.throws(
      () => GeneratePassword({ length: 20, exclude: '0123456789' }),
      /exclude/i
    )
  })

  it('treats an empty exclude string as no exclusions', () => {
    assert.equal(GeneratePassword({ length: 15, exclude: '' }).length, 15)
  })
})

describe('validation', () => {
  it('throws when the minimums exceed the length', () => {
    assert.throws(
      () =>
        GeneratePassword({
          length: 4,
          symbols: true,
          minLengthLowercase: 2,
          minLengthUppercase: 2,
          minLengthNumbers: 2,
          minLengthSymbols: 2,
        }),
      /greater than/i
    )
  })

  it('throws when every class is disabled', () => {
    assert.throws(
      () =>
        GeneratePassword({
          lowercase: false,
          uppercase: false,
          numbers: false,
          symbols: false,
        }),
      /all false/i
    )
  })

  it('throws on a non-positive length', () => {
    assert.throws(() => GeneratePassword({ length: 0 }), /length/i)
    assert.throws(() => GeneratePassword({ length: -5 }), /length/i)
  })

  it('throws on a fractional length', () => {
    assert.throws(() => GeneratePassword({ length: 10.5 }), /length/i)
  })

  it('throws on a negative minimum', () => {
    assert.throws(
      () => GeneratePassword({ length: 10, minLengthNumbers: -1 }),
      /minLengthNumbers/i
    )
  })
})

describe('purity', () => {
  it('does not mutate the caller options object', () => {
    const options = { length: 12 }
    const snapshot = { ...options }
    GeneratePassword(options)
    assert.deepEqual(options, snapshot)
  })

  it('can be called repeatedly with the same object', () => {
    const options = { length: 12, symbols: true }
    for (let i = 0; i < 50; i++) {
      assert.equal(GeneratePassword(options).length, 12)
    }
  })
})

describe('randomness', () => {
  it('does not repeat itself', () => {
    const seen = new Set()
    for (let i = 0; i < 2000; i++) {
      seen.add(GeneratePassword({ length: 16 }))
    }
    assert.equal(seen.size, 2000)
  })

  it('spreads characters roughly evenly across the alphabet', () => {
    const tally = new Map()
    const draws = 26 * 400
    for (let i = 0; i < draws / 20; i++) {
      const password = GeneratePassword({
        length: 20,
        uppercase: false,
        numbers: false,
        minLengthLowercase: 0,
      })
      for (const char of password) tally.set(char, (tally.get(char) ?? 0) + 1)
    }

    assert.equal(tally.size, 26, 'every lowercase letter should appear')

    const expected = draws / 26
    for (const [char, seen] of tally) {
      assert.ok(
        seen > expected * 0.6 && seen < expected * 1.4,
        `letter ${char} appeared ${seen} times, expected around ${expected}`
      )
    }
  })
})
