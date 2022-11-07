const passwords = require("./lib/password-generator.js");
const errorCheck = require("./lib/check-options-error");
const processOptions = require("./lib/process-options");

function PasswordGenerator(options) {
  options = processOptions(options);

  errorCheck(options);

  const pswd = passwords(options);
  console.log("password: ", pswd);

  return pswd;
}

PasswordGenerator({ exclude: "abc567XYZ" });

module.exports = PasswordGenerator;
