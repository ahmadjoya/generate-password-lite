const randomNumber = require("./generate-random-number");
const shuffleString = require("./shuffle-string");

const generatePassword = (options) => {
  let pswd = "";
  let minChar = "";
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
  } = options;

  let lowercaseChar = "abcdefghijklmnopqrstuvwxyz";
  lowercaseChar = removeExceptions(lowercaseChar, exclude);

  let uppercaseChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  uppercaseChar = removeExceptions(uppercaseChar, exclude);

  let numberChar = "0123456789";
  numberChar = removeExceptions(numberChar, exclude);

  let specialChar = "!#$%&'()*+,-./:;<=>?@[]^_{|}~";
  specialChar = removeExceptions(specialChar, exclude);

  //  Generating a minChar string that holds minimum number of characters on the User Option Selection.
  // The minChar variable will store the minimum number of characters for each type - lowercase, uppercase, numbers, and symbols.
  //  Then, the minChar variable is shuffled to make the password random.

  upperLimit = lowercaseChar.length;
  for (i = 0; i < minLengthLowercase; i++) {
    minChar += lowercaseChar.charAt(randomNumber(upperLimit));
  }

  upperLimit = uppercaseChar.length;
  for (i = 0; i < minLengthUppercase; i++) {
    minChar += uppercaseChar.charAt(randomNumber(upperLimit));
  }

  upperLimit = numberChar.length;
  for (i = 0; i < minLengthNumbers; i++) {
    minChar += numberChar.charAt(randomNumber(upperLimit));
  }

  upperLimit = specialChar.length;
  for (i = 0; i < minLengthSymbols; i++) {
    minChar += specialChar.charAt(randomNumber(upperLimit));
  }

  //Shuffling the minChar to generate a password that holds minimum criteria.
  pswd = pswd + shuffleString(minChar);

  characterString = "";

  characterString = lowercase
    ? characterString + lowercaseChar
    : characterString;

  characterString = uppercase
    ? characterString + uppercaseChar
    : characterString;

  characterString = numbers ? characterString + numberChar : characterString;

  characterString = symbols ? characterString + specialChar : characterString;

  remainingChar = length - pswd.length;

  upperLimit = characterString.length;

  for (i = 0; i < remainingChar; i++) {
    pswd += characterString.charAt(randomNumber(upperLimit));
  }
  return pswd;
};

const removeExceptions = (str, EXCEPTIONS) => {
  EXCEPTIONS?.split("").forEach((char) => {
    str = str.replace(char, "");
  });
  return str;
};

module.exports = generatePassword;
