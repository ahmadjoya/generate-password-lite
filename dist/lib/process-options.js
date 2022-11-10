"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processOption = void 0;
const processOption = (options) => {
    {
        options.length = typeof options.length == "undefined" ? 10 : options.length;
        options.lowercase =
            typeof options.lowercase == "undefined" ? true : options.lowercase;
        options.uppercase =
            typeof options.uppercase == "undefined" ? true : options.uppercase;
        options.numbers =
            typeof options.numbers == "undefined" ? true : options.numbers;
        options.symbols =
            typeof options.symbols == "undefined" ? false : options.symbols;
        if (options.lowercase) {
            options.minLengthLowercase =
                typeof options.minLengthLowercase == "undefined"
                    ? 1
                    : options.minLengthLowercase;
        }
        else {
            options.minLengthLowercase = 0;
        }
        if (options.uppercase) {
            options.minLengthUppercase =
                typeof options.minLengthUppercase == "undefined"
                    ? 1
                    : options.minLengthUppercase;
        }
        else {
            options.minLengthUppercase = 0;
        }
        if (options.numbers) {
            options.minLengthNumbers =
                typeof options.minLengthNumbers == "undefined"
                    ? 1
                    : options.minLengthNumbers;
        }
        else {
            options.minLengthNumbers = 0;
        }
        if (options.symbols) {
            options.minLengthSymbols =
                typeof options.minLengthSymbols == "undefined"
                    ? 1
                    : options.minLengthSymbols;
        }
        else {
            options.minLengthSymbols = 0;
        }
        options.exclude =
            typeof options.exclude == "undefined" ? "" : options.exclude;
    }
    return options;
};
exports.processOption = processOption;
// module.exports = processOption;
