import { generatePswd } from './lib/password-generator'
import { checkError } from './lib/check-options-error'
import { processOption } from './lib/process-options'
import { GenerateOptions } from './types'

/**
 * Generates a random password using a cryptographically secure random source.
 *
 * @param options - Optional overrides. Every unset option falls back to its
 * documented default.
 * @returns The generated password.
 */
function GeneratePassword(options: GenerateOptions = {}): string {
  const resolved = processOption(options)

  checkError(resolved)

  return generatePswd(resolved)
}

export { GeneratePassword, type GenerateOptions }
export default GeneratePassword
