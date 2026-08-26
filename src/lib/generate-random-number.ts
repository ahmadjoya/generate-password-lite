/**
 * Number of distinct values a Uint32 can hold.
 */
const UINT32_RANGE = 0x100000000

const getWebCrypto = (): Crypto => {
  const webCrypto = globalThis.crypto

  if (!webCrypto || typeof webCrypto.getRandomValues !== 'function') {
    throw new Error(
      'generate-password-lite: no Web Crypto implementation found. ' +
        'A secure random source is required to generate passwords. ' +
        'Use Node.js 18+, a modern browser, or polyfill `globalThis.crypto`.'
    )
  }

  return webCrypto
}

/**
 * Returns a cryptographically secure integer in the range [0, upperLimit).
 *
 * Uses rejection sampling so that every value is equally likely. Taking a
 * plain `random % upperLimit` would bias the low end of the range whenever
 * `upperLimit` is not a power of two.
 */
export const generateRandomNumbers = (upperLimit: number): number => {
  if (!Number.isInteger(upperLimit) || upperLimit <= 0) {
    throw new RangeError(
      `generate-password-lite: upperLimit must be a positive integer, received ${upperLimit}.`
    )
  }

  const webCrypto = getWebCrypto()
  const buffer = new Uint32Array(1)

  // Largest multiple of upperLimit that fits in the Uint32 range. Draws at or
  // above this cutoff are discarded rather than folded back into the range.
  const cutoff = Math.floor(UINT32_RANGE / upperLimit) * upperLimit

  let value: number
  do {
    webCrypto.getRandomValues(buffer)
    value = buffer[0]!
  } while (value >= cutoff)

  return value % upperLimit
}
