"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratePassword = void 0;
const password_generator_1 = require("./lib/password-generator");
const check_options_error_1 = require("./lib/check-options-error");
const process_options_1 = require("./lib/process-options");
function GeneratePassword(options) {
    let pswd;
    if (options) {
        options = (0, process_options_1.processOption)(options);
        (0, check_options_error_1.checkError)(options);
        pswd = (0, password_generator_1.generatePswd)(options);
        return pswd;
    }
    else {
        let opt = {
            length: 10,
            lowercase: true,
            uppercase: true,
            numbers: true,
            symbols: false,
            exclude: "",
            minLengthLowercase: 1,
            minLengthUppercase: 1,
            minLengthNumbers: 1,
            minLengthSymbols: 0,
        };
        options = (0, process_options_1.processOption)(opt);
        (0, check_options_error_1.checkError)(options);
        pswd = (0, password_generator_1.generatePswd)(options);
        return pswd;
    }
}
exports.GeneratePassword = GeneratePassword;
console.log(GeneratePassword({ minLengthLowercase: 4 }));
exports.default = { GeneratePassword };
