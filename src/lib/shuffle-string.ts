import { generateRandomNumbers } from './generate-random-number'

/**
 * Fisher-Yates shuffle backed by the same cryptographically secure source
 * used to pick the characters themselves.
 *
 * Spreads across code points rather than UTF-16 units so that a surrogate
 * pair supplied through `exclude` handling is never split in half.
 */
export const shuffleString = (str: string): string => {
  const chars = [...str]

  for (let i = chars.length - 1; i > 0; i--) {
    const j = generateRandomNumbers(i + 1)
    const tmp = chars[i]!
    chars[i] = chars[j]!
    chars[j] = tmp
  }

  return chars.join('')
}
