export interface GenerateOptions {
  /**
   * Length of the generated password.
   * @default 10
   */
  length?: number
  /**
   * Should the password include lowercase characters.
   * @default true
   */
  lowercase?: boolean
  /**
   * Should the password include uppercase characters.
   * @default true
   */
  uppercase?: boolean
  /**
   * Should the password include numbers.
   * @default true
   */
  numbers?: boolean
  /**
   * Should the password include symbol characters.
   * @default false
   */
  symbols?: boolean
  /**
   * Characters to exclude from the password.
   * @default ""
   */
  exclude?: string
  /**
   * Minimum number of lowercase characters. Forced to 0 when `lowercase` is false.
   * @default 1 when `lowercase` is true, otherwise 0
   */
  minLengthLowercase?: number
  /**
   * Minimum number of uppercase characters. Forced to 0 when `uppercase` is false.
   * @default 1 when `uppercase` is true, otherwise 0
   */
  minLengthUppercase?: number
  /**
   * Minimum number of numeric characters. Forced to 0 when `numbers` is false.
   * @default 1 when `numbers` is true, otherwise 0
   */
  minLengthNumbers?: number
  /**
   * Minimum number of symbol characters. Forced to 0 when `symbols` is false.
   * @default 1 when `symbols` is true, otherwise 0
   */
  minLengthSymbols?: number
}

/**
 * Every option resolved to a concrete value by `processOption`.
 */
export type ResolvedOptions = Required<GenerateOptions>
