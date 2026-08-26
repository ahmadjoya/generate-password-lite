import { GenerateOptions, ResolvedOptions } from '../types'

const withDefault = <T>(value: T | undefined, fallback: T): T =>
  typeof value === 'undefined' ? fallback : value

/**
 * Fills in every unset option. Returns a new object so that the caller's
 * options are never mutated.
 */
export const processOption = (options: GenerateOptions): ResolvedOptions => {
  const lowercase = withDefault(options.lowercase, true)
  const uppercase = withDefault(options.uppercase, true)
  const numbers = withDefault(options.numbers, true)
  const symbols = withDefault(options.symbols, false)

  // A disabled character class can never contribute a minimum, regardless of
  // what the caller passed in.
  return {
    length: withDefault(options.length, 10),
    lowercase,
    uppercase,
    numbers,
    symbols,
    exclude: withDefault(options.exclude, ''),
    minLengthLowercase: lowercase
      ? withDefault(options.minLengthLowercase, 1)
      : 0,
    minLengthUppercase: uppercase
      ? withDefault(options.minLengthUppercase, 1)
      : 0,
    minLengthNumbers: numbers ? withDefault(options.minLengthNumbers, 1) : 0,
    minLengthSymbols: symbols ? withDefault(options.minLengthSymbols, 1) : 0,
  }
}
