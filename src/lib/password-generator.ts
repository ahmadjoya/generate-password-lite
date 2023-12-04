// const generategenerateRandomNumberss = require("./generate-random-number");
// const shuffleString = require("./shuffle-string");
import { generateRandomNumbers } from './generate-random-number'
import { shuffleString } from './shuffle-string'
import { GenerateOptions } from '../types'
export const generatePswd = (options: GenerateOptions) => {
  let pswd = ''
  let minChar = ''
  let {
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

  let lowercaseChar = 'abcdefghijklmnopqrstuvwxyz'
  lowercaseChar = removeExceptions(lowercaseChar, exclude!)

  let uppercaseChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  uppercaseChar = removeExceptions(uppercaseChar, exclude!)

  let numberChar = '0123456789'
  numberChar = removeExceptions(numberChar, exclude!)

  let specialChar = "!#$%&'()*+,-./:;<=>?@[]^_{|}~"
  specialChar = removeExceptions(specialChar, exclude!)

  //  Generating a minChar string that holds minimum number of characters on the User Option Selection.
  // The minChar variable will store the minimum number of characters for each type - lowercase, uppercase, numbers, and symbols.
  //  Then, the minChar variable is shuffled to make the password random.

  let upperLimit = lowercaseChar.length
  for (let i = 0; i < minLengthLowercase!; i++) {
    minChar += lowercaseChar.charAt(generateRandomNumbers(upperLimit))
  }

  upperLimit = uppercaseChar.length
  for (let i = 0; i < minLengthUppercase!; i++) {
    minChar += uppercaseChar.charAt(generateRandomNumbers(upperLimit))
  }

  upperLimit = numberChar.length
  for (let i = 0; i < minLengthNumbers!; i++) {
    minChar += numberChar.charAt(generateRandomNumbers(upperLimit))
  }

  upperLimit = specialChar.length
  for (let i = 0; i < minLengthSymbols!; i++) {
    minChar += specialChar.charAt(generateRandomNumbers(upperLimit))
  }

  //Shuffling the minChar to generate a password that holds minimum criteria.
  pswd = pswd + shuffleString(minChar)

  let characterString = ''

  characterString = lowercase
    ? characterString + lowercaseChar
    : characterString

  characterString = uppercase
    ? characterString + uppercaseChar
    : characterString

  characterString = numbers ? characterString + numberChar : characterString

  characterString = symbols ? characterString + specialChar : characterString

  let remainingChar = length! - pswd.length

  upperLimit = characterString.length

  for (let i = 0; i < remainingChar; i++) {
    pswd += characterString.charAt(generateRandomNumbers(upperLimit))
  }
  return pswd
}

const removeExceptions = (str: string, EXCEPTIONS: string) => {
  EXCEPTIONS?.split('').forEach(char => {
    str = str.replace(char, '')
  })
  return str
}

// module.exports = generatePassword;
