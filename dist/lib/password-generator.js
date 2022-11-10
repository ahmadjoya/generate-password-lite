"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePswd = void 0;
// const generategenerateRandomNumberss = require("./generate-random-number");
// const shuffleString = require("./shuffle-string");
const generate_random_number_1 = require("./generate-random-number");
const shuffle_string_1 = require("./shuffle-string");
const generatePswd = (options) => {
    let pswd = "";
    let minChar = "";
    let { length, lowercase, uppercase, numbers, symbols, minLengthLowercase, minLengthUppercase, minLengthNumbers, minLengthSymbols, exclude, } = options;
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
    let upperLimit = lowercaseChar.length;
    for (let i = 0; i < minLengthLowercase; i++) {
        minChar += lowercaseChar.charAt((0, generate_random_number_1.generateRandomNumbers)(upperLimit));
    }
    upperLimit = uppercaseChar.length;
    for (let i = 0; i < minLengthUppercase; i++) {
        minChar += uppercaseChar.charAt((0, generate_random_number_1.generateRandomNumbers)(upperLimit));
    }
    upperLimit = numberChar.length;
    for (let i = 0; i < minLengthNumbers; i++) {
        minChar += numberChar.charAt((0, generate_random_number_1.generateRandomNumbers)(upperLimit));
    }
    upperLimit = specialChar.length;
    for (let i = 0; i < minLengthSymbols; i++) {
        minChar += specialChar.charAt((0, generate_random_number_1.generateRandomNumbers)(upperLimit));
    }
    //Shuffling the minChar to generate a password that holds minimum criteria.
    pswd = pswd + (0, shuffle_string_1.shuffleString)(minChar);
    let characterString = "";
    characterString = lowercase
        ? characterString + lowercaseChar
        : characterString;
    characterString = uppercase
        ? characterString + uppercaseChar
        : characterString;
    characterString = numbers ? characterString + numberChar : characterString;
    characterString = symbols ? characterString + specialChar : characterString;
    let remainingChar = length - pswd.length;
    upperLimit = characterString.length;
    for (let i = 0; i < remainingChar; i++) {
        pswd += characterString.charAt((0, generate_random_number_1.generateRandomNumbers)(upperLimit));
    }
    return pswd;
};
exports.generatePswd = generatePswd;
const removeExceptions = (str, EXCEPTIONS) => {
    EXCEPTIONS === null || EXCEPTIONS === void 0 ? void 0 : EXCEPTIONS.split("").forEach((char) => {
        str = str.replace(char, "");
    });
    return str;
};
// module.exports = generatePassword;
