import { GenerateOptions } from '../types'

export const checkError = (options: GenerateOptions) => {
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

  //Checking if the sum of minimum characters of Lowercase, uppercase, numbers and special case is greater than the total password length.
  if (
    minLengthLowercase! +
      minLengthUppercase! +
      minLengthNumbers! +
      minLengthSymbols! >
    length!
  ) {
    throw new Error(
      'Sum of Minimum Characters in the passwords greater than the length of the Password to be generated.'
    )
  }

  //Checking if lowercase, uppercase , numbers and special characters have all been set to false.
  if (
    lowercase == false &&
    uppercase == false &&
    numbers == false &&
    symbols == false
  ) {
    throw new Error(
      'Alphabets, Numbers and Symbols are all set to False. No valid Characters to generate the Password.'
    )
  }
}

// module.exports = checkError;
