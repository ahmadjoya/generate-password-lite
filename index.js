const passwords = require("./lib/password-generator.js");
const errorCheck = require("./lib/check-options-error");
const processOptions = require("./lib/process-options");

function GeneratePassword(options) {
  options = processOptions(options);

  errorCheck(options);

  const pswd = passwords(options);

  return pswd;
}

exports.default = GeneratePassword;
module.exports = GeneratePassword;
