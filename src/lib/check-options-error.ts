import { ResolvedOptions } from '../types'

const assertCount = (value: number, name: string) => {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(
      `generate-password-lite: \`${name}\` must be a non-negative integer, received ${value}.`
    )
  }
}

export const checkError = (options: ResolvedOptions) => {
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
  } = options

  if (!Number.isInteger(length) || length < 1) {
    throw new Error(
      `generate-password-lite: \`length\` must be a positive integer, received ${length}.`
    )
  }

  assertCount(minLengthLowercase, 'minLengthLowercase')
  assertCount(minLengthUppercase, 'minLengthUppercase')
  assertCount(minLengthNumbers, 'minLengthNumbers')
  assertCount(minLengthSymbols, 'minLengthSymbols')

  // Lowercase, uppercase, numbers and symbols have all been turned off, so
  // there is no character class left to build a password from.
  if (!lowercase && !uppercase && !numbers && !symbols) {
    throw new Error(
      'generate-password-lite: `lowercase`, `uppercase`, `numbers` and `symbols` are all false. No valid characters to generate the password from.'
    )
  }

  // The guaranteed characters alone would already overflow the password.
  const minimumTotal =
    minLengthLowercase + minLengthUppercase + minLengthNumbers + minLengthSymbols

  if (minimumTotal > length) {
    throw new Error(
      `generate-password-lite: the sum of the minimum character counts (${minimumTotal}) is greater than \`length\` (${length}).`
    )
  }
}
