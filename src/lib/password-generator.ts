import { generateRandomNumbers } from './generate-random-number'
import { shuffleString } from './shuffle-string'
import { ResolvedOptions } from '../types'

const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz'
const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBER_CHARS = '0123456789'
const SYMBOL_CHARS = "!#$%&'()*+,-./:;<=>?@[]^_{|}~"

/**
 * Drops every excluded character. `String.replace` with a string pattern only
 * removes the first match, so the exclusion is done with a set instead.
 */
const removeExceptions = (str: string, exclude: string): string => {
  if (!exclude) return str

  const banned = new Set([...exclude])
  return [...str].filter(char => !banned.has(char)).join('')
}

/**
 * Picks `count` characters from `pool`. Throws when the caller asked for
 * guaranteed characters out of a pool that `exclude` emptied.
 */
const pickFrom = (pool: string, count: number, name: string): string => {
  if (count === 0) return ''

  if (pool.length === 0) {
    throw new Error(
      `generate-password-lite: \`exclude\` removed every ${name} character, but \`minLength${name[0]!.toUpperCase()}${name.slice(1)}\` is ${count}.`
    )
  }

  let picked = ''
  for (let i = 0; i < count; i++) {
    picked += pool.charAt(generateRandomNumbers(pool.length))
  }
  return picked
}

export const generatePswd = (options: ResolvedOptions): string => {
  const {
    length,
    lowercase,
    uppercase,
    numbers,
    symbols,
    minLengthLowercase,
    minLengthUppercase,
    minLengthNumbers,
    minLengthSymbols,
    exclude,
  } = options

  const lowercaseChar = removeExceptions(LOWERCASE_CHARS, exclude)
  const uppercaseChar = removeExceptions(UPPERCASE_CHARS, exclude)
  const numberChar = removeExceptions(NUMBER_CHARS, exclude)
  const symbolChar = removeExceptions(SYMBOL_CHARS, exclude)

  // Characters that must appear, so that the password satisfies every
  // `minLength*` the caller asked for.
  const guaranteed =
    pickFrom(lowercaseChar, minLengthLowercase, 'lowercase') +
    pickFrom(uppercaseChar, minLengthUppercase, 'uppercase') +
    pickFrom(numberChar, minLengthNumbers, 'numbers') +
    pickFrom(symbolChar, minLengthSymbols, 'symbols')

  // Every character the enabled classes still allow after exclusions.
  const characterPool =
    (lowercase ? lowercaseChar : '') +
    (uppercase ? uppercaseChar : '') +
    (numbers ? numberChar : '') +
    (symbols ? symbolChar : '')

  const remaining = length - guaranteed.length

  if (remaining > 0 && characterPool.length === 0) {
    throw new Error(
      'generate-password-lite: `exclude` removed every character of every enabled class. No valid characters to generate the password from.'
    )
  }

  let filler = ''
  for (let i = 0; i < remaining; i++) {
    filler += characterPool.charAt(generateRandomNumbers(characterPool.length))
  }

  // Shuffle the whole password, not just the guaranteed part. Shuffling only
  // the guaranteed characters would pin them to the leading positions and make
  // the layout of the password predictable.
  return shuffleString(guaranteed + filler)
}
