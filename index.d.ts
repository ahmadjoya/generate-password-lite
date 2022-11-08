interface GenerateOptions {
  /**
   * lenght of the password
   * @default 10
   */
  length?: number;
  /**
   * Should the password include lowercase characters
   * @default true
   */
  lowercase?: boolean;
  /**
   * Should the password include uppercase characters
   * @default true
   */
  uppercase?: boolean;
  /**
   * Should the password include numbers
   * @default true
   */
  numbers?: boolean;
  /**
   * Should the password include symbol characters
   * @default false
   */
  symbols?: boolean;
  /**
   * List of characters to be excluded from the password
   * @default ""
   */
  exclude?: string;
  /**
   * min lentgh of lowercase character
   * @default 1
   */
  minLengthLowercase?: number;
  /**
   * min lentgh of uppercase character
   * @default 1
   */
  minLengthUppercase?: number;
  /**
   * min length of numbers
   * @default 1
   */
  minLengthNumbers?: number;
  /**
   * min length of symbols
   * @default 0
   */
  minLengthSymbols?: number;
}

declare namespace GeneratePassword {}

declare function GeneratePassword(options?: GenerateOptions): string;

export default GeneratePassword;
